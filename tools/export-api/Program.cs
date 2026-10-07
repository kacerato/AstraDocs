using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Build.Locator;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.MSBuild;
using Microsoft.CodeAnalysis.CSharp;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Xml.Linq;

if (args.Length is < 2 or > 3) throw new ArgumentException("Expected project path, output JSON path and optional examples directory.");
MSBuildLocator.RegisterDefaults();
using var workspace = MSBuildWorkspace.Create();
workspace.WorkspaceFailed += (_, e) => Console.Error.WriteLine(e.Diagnostic.Message);
var project = await workspace.OpenProjectAsync(Path.GetFullPath(args[0]));
var compilation = await project.GetCompilationAsync() ?? throw new Exception("Compilation unavailable");
var errors = compilation.GetDiagnostics().Where(d => d.Severity == DiagnosticSeverity.Error).ToArray();
if (errors.Length > 0) throw new Exception(string.Join("\n", errors.Select(e => e.ToString())));
var format = new SymbolDisplayFormat(
    kindOptions: SymbolDisplayKindOptions.IncludeTypeKeyword,
    globalNamespaceStyle: SymbolDisplayGlobalNamespaceStyle.Omitted,
    typeQualificationStyle: SymbolDisplayTypeQualificationStyle.NameAndContainingTypesAndNamespaces,
    genericsOptions: SymbolDisplayGenericsOptions.IncludeTypeParameters | SymbolDisplayGenericsOptions.IncludeTypeConstraints | SymbolDisplayGenericsOptions.IncludeVariance,
    memberOptions: SymbolDisplayMemberOptions.IncludeAccessibility | SymbolDisplayMemberOptions.IncludeModifiers | SymbolDisplayMemberOptions.IncludeType | SymbolDisplayMemberOptions.IncludeParameters | SymbolDisplayMemberOptions.IncludeExplicitInterface,
    parameterOptions: SymbolDisplayParameterOptions.IncludeType | SymbolDisplayParameterOptions.IncludeName | SymbolDisplayParameterOptions.IncludeDefaultValue | SymbolDisplayParameterOptions.IncludeParamsRefOut,
    propertyStyle: SymbolDisplayPropertyStyle.ShowReadWriteDescriptor,
    miscellaneousOptions: SymbolDisplayMiscellaneousOptions.UseSpecialTypes | SymbolDisplayMiscellaneousOptions.IncludeNullableReferenceTypeModifier | SymbolDisplayMiscellaneousOptions.EscapeKeywordIdentifiers);
string Text(XElement? e) {
    if (e is null) return "";
    foreach (var see in e.Descendants("see").ToArray()) see.ReplaceWith(see.Attribute("cref")?.Value.Replace("T:", "").Replace("M:", "") ?? "");
    foreach (var p in e.Descendants("paramref").ToArray()) p.ReplaceWith(p.Attribute("name")?.Value ?? "");
    var text = Regex.Replace(e.Value, @"\s+", " ").Trim();
    // Public documentation contains contracts, never locations of private implementation.
    return Regex.Replace(text, @"(?:native|managed|tools|platform|android|tests)/[\w./-]+", "implementação da engine");
}
object Doc(ISymbol symbol) {
    var xml = symbol.GetDocumentationCommentXml();
    var root = string.IsNullOrWhiteSpace(xml) ? new XElement("member") : XElement.Parse(xml);
    return new { summary = Text(root.Element("summary")), remarks = Text(root.Element("remarks")), returns = Text(root.Element("returns")),
        parameters = root.Elements("param").Select(p => new { name = p.Attribute("name")?.Value, description = Text(p) }),
        exceptions = root.Elements("exception").Select(p => new { type = p.Attribute("cref")?.Value.Replace("T:", ""), description = Text(p) }) };
}
IEnumerable<INamedTypeSymbol> Types(INamespaceOrTypeSymbol parent) {
    foreach (var item in parent.GetMembers()) {
        if (item is INamespaceSymbol ns) foreach (var type in Types(ns)) yield return type;
        if (item is INamedTypeSymbol named) { yield return named; foreach (var nested in Types(named)) yield return nested; }
    }
}
bool Visible(ISymbol symbol) => symbol.DeclaredAccessibility is Accessibility.Public or Accessibility.Protected or Accessibility.ProtectedOrInternal;
bool PublicType(INamedTypeSymbol type) => Visible(type) && (type.ContainingType is null || PublicType(type.ContainingType));
var excluded = new HashSet<string> { "NativeGraphicsState", "RawQueryHit", "AnimationCommandKind", "AudioVoiceCommand", "Body2DCommandKind", "ComponentEventRecord", "HierarchyChange", "SimulationTimeState", "MessageRoute" };
string Signature(ISymbol symbol) {
    var signature = symbol.ToDisplayString(format);
    if(symbol is IMethodSymbol method) foreach(var p in method.Parameters) {
        if(p.HasExplicitDefaultValue && p.Type is INamedTypeSymbol en && en.TypeKind == TypeKind.Enum) {
            var field = en.GetMembers().OfType<IFieldSymbol>().FirstOrDefault(f=>f.HasConstantValue && Equals(f.ConstantValue,p.ExplicitDefaultValue));
            if(field is not null) signature=signature.Replace("= "+field.Name,"= "+en.ToDisplayString()+"."+field.Name);
        }
    }
    return signature;
}
var types = Types(compilation.Assembly.GlobalNamespace).Where(t => PublicType(t) &&
    (t.ContainingNamespace.ToDisplayString() is "Astra" or "Astra.Components") && t.TypeKind != TypeKind.Interface && !excluded.Contains(t.Name))
    .OrderBy(t => t.ToDisplayString()).Select(t => new {
        uid = t.GetDocumentationCommentId(), name = t.Name,
        fullName = t.ToDisplayString(), ns = t.ContainingNamespace.ToDisplayString(), kind = t.TypeKind.ToString(),
        signature = Signature(t), baseType = t.BaseType?.ToDisplayString(),
        interfaces = t.Interfaces.Select(i => i.ToDisplayString()), docs = Doc(t),
        members = t.GetMembers().Where(m => Visible(m) && !m.IsImplicitlyDeclared && m is not INamedTypeSymbol &&
            (m is not IMethodSymbol method || method.MethodKind is MethodKind.Ordinary or MethodKind.Constructor or MethodKind.UserDefinedOperator or MethodKind.Conversion))
            .OrderBy(m => m.GetDocumentationCommentId()).Select(m => new {
                uid = m.GetDocumentationCommentId(), name = m.Name, kind = m.Kind.ToString(), signature = Signature(m), docs = Doc(m),
                constant = m is IFieldSymbol f && f.HasConstantValue ? Convert.ToString(f.ConstantValue, System.Globalization.CultureInfo.InvariantCulture) : null,
                parameters = m is IMethodSymbol fn ? fn.Parameters.Select(p => new { name = p.Name, type = p.Type.ToDisplayString(), modifier = p.RefKind.ToString(), optional = p.IsOptional, defaultValue = p.HasExplicitDefaultValue ? Convert.ToString(p.ExplicitDefaultValue, System.Globalization.CultureInfo.InvariantCulture) : null }) : null
            }).ToArray()
    }).ToArray();
var output = new { format = 1, engineGeneration = "astra-current", version = "snapshot-2026-10-06", language = "C#", assembly = "Astra.Scripting", extraction = "Roslyn/MSBuild semantic compilation", runtimeVerified = false, platformEvidence = Array.Empty<string>(), types };
Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(args[1]))!);
await File.WriteAllTextAsync(args[1], JsonSerializer.Serialize(output, new JsonSerializerOptions { WriteIndented = true }));
Console.WriteLine($"Exported {types.Length} types and {types.Sum(t => t.members.Length)} members. Semantic compilation: no errors. Runtime was not executed.");
if(args.Length == 3) {
    var evidence = new List<object>();
    var files=Directory.GetFiles(args[2], "*.cs", SearchOption.AllDirectories).OrderBy(p=>p).ToArray();
    var trees=new List<SyntaxTree>();
    foreach(var file in files) {
        var bytes=await File.ReadAllBytesAsync(file);
        trees.Add(CSharpSyntaxTree.ParseText(System.Text.Encoding.UTF8.GetString(bytes), (CSharpParseOptions)project.ParseOptions!,path:file));
        evidence.Add(new { file=Path.GetFileName(file), sha256=Convert.ToHexString(SHA256.HashData(bytes)).ToLowerInvariant(), compilationVerified=true, method="Roslyn semantic compilation of the example assembly against the loaded project", runtimeVerified=false });
    }
    var diagnostics=compilation.AddSyntaxTrees(trees).GetDiagnostics().Where(d=>d.Severity==DiagnosticSeverity.Error).ToArray();
    if(diagnostics.Length>0)throw new Exception(string.Join("\n",diagnostics.Select(d=>d.ToString())));
    await File.WriteAllTextAsync(Path.Combine(Path.GetDirectoryName(args[1])!,"example-evidence.json"),JsonSerializer.Serialize(evidence,new JsonSerializerOptions{WriteIndented=true}));
    Console.WriteLine($"Semantically compiled {evidence.Count} documentation examples; none were executed.");
}
