#include "scene/component_reflection.h"
#include <iostream>
#include <iomanip>

static void str(std::string_view s) {
  std::cout << '"';
  for (unsigned char c : s) {
    if(c=='"'||c=='\\') std::cout << '\\' << c;
    else if(c=='\n') std::cout << "\\n";
    else if(c=='\r') std::cout << "\\r";
    else if(c=='\t') std::cout << "\\t";
    else if(c<32) std::cout << ' ';
    else std::cout << c;
  }
  std::cout << '"';
}
static void field(const char *key,std::string_view value) { str(key);std::cout<<':';str(value);std::cout<<','; }
int main() {
  using namespace ae::scene;
  std::cout << "["; bool first=true;
  for(const auto &s:componentSchemas) {
    if(!first) std::cout << ',';first=false;
    std::cout << '{';field("typeId",s.type->id);field("name",s.name);field("description",s.description);
    field("family",componentFamilyName(s.family));field("subfamily",s.subfamily);field("api",s.apiName);
    field("reference",s.reference);field("aliases",s.searchTerms);
    std::cout << "\"schemaVersion\":" << s.type->version << ",\"allowMultiple\":" << (s.allowMultiple()?"true":"false")
      << ",\"listedInAdd\":" << (s.listedInAdd?"true":"false") << ',';
    field("structuralInPlay",s.structuralInPlay==PlayMutability::SafePoint?"ponto seguro":"não permitido");
    field("propertiesInPlay",s.propertiesInPlay==PlayMutability::SafePoint?"ponto seguro":"não permitido");
    std::cout << "\"requirements\":[";bool rfirst=true;
    for(const auto &r:s.requirements) { if(!rfirst)std::cout<<',';rfirst=false;std::cout<<'{';field("typeId",r.typeId);str("message");std::cout<<':';str(r.message);std::cout<<'}'; }
    std::cout << "],\"conflicts\":[";rfirst=true;
    for(const auto &r:s.conflicts) { if(!rfirst)std::cout<<',';rfirst=false;std::cout<<'{';field("typeId",r.typeId);str("message");std::cout<<':';str(r.message);std::cout<<'}'; }
    std::cout << "],\"properties\":[";rfirst=true;
    for(const auto &p:componentContracts(s)) {
      if(!rfirst)std::cout<<',';rfirst=false;std::cout<<'{';
      field("id",p.propertyId);field("name",p.label);field("kind",propertyKindName(p.kind));field("group",p.group);
      field("unit",p.unit);field("help",p.help?p.help:"");field("default",p.defaultValue);field("domain",p.domain);
      field("limitation",p.limitation?p.limitation:"");field("capability",p.capability);
      field("invalidation",describeInvalidation(p.invalidates));
      std::cout << "\"conditional\":"<<(p.conditional?"true":"false")<<",\"restrictedWrite\":"<<(p.readOnly?"true":"false")
        <<",\"perSlot\":"<<(p.perSlot?"true":"false")<<",\"tweenable\":"<<(p.tweenable?"true":"false")
        <<",\"slots\":"<<p.slots<<'}';
    }
    std::cout << "]}";
  }
  std::cout << "]\n";
}
