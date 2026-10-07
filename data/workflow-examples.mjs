export const workflowExamples = [
  {
    id: 'input-move', filename: 'InputMove.cs',
    description: 'Move um objeto visual no plano XZ usando a ação Mover a 2 m/s.',
    prerequisites: 'Ação Mover Axis2D habilitada e vinculada; objeto visual sem física, caminho ou constraint; câmera enquadrada.',
    code: `using Astra;
using System.Numerics;

[ComponentId("docs.input-move")]
public sealed class InputMove : Behavior
{
    public override void Update(float deltaTime)
    {
        if (!Input.Exists("Mover")) return;
        Vector2 axis = Input.Axis2("Mover");
        if (axis.LengthSquared() > 1f) axis = Vector2.Normalize(axis);
        Vector3 step = new Vector3(axis.X, 0f, axis.Y) * (2f * deltaTime);
        Object.Translate(step, TransformSpace.World);
    }
}`,
  },
  {
    id: 'save-action-counter', filename: 'SaveActionCounter.cs',
    description: 'Lê um contador persistente e incrementa uma vez por pressão na ação Saltar.',
    prerequisites: 'Ação Saltar do tipo Botão habilitada/vinculada; Behavior anexado a objeto ativo; SaveStore do projeto disponível.',
    code: `using Astra;

[ComponentId("docs.save-action-counter")]
public sealed class SaveActionCounter : Behavior
{
    private long _count;
    public override void Start()
    {
        _count = Save.GetInt64("docs.action-count", 0);
    }
    public override void Update(float deltaTime)
    {
        if (!Input.Exists("Saltar") || !Input.JustPressed("Saltar")) return;
        _count = checked(_count + 1);
        Save.SetInt64("docs.action-count", _count);
        Save.Flush();
        Object.Name = "Contador " + _count;
    }
}`,
  },
  {
    id: 'delayed-deactivate', filename: 'DelayedDeactivate.cs',
    description: 'Espera três segundos de jogo e desativa o dono, respeitando cancelamento da sessão.',
    prerequisites: 'Behavior em objeto ativo visível; observe em Play antes de Stop; não exige Timer no objeto.',
    code: `using Astra;

[ComponentId("docs.delayed-deactivate")]
public sealed class DelayedDeactivate : Behavior
{
    public override void Start()
    {
        StartAsync(async cancellation =>
        {
            await Awaitable.Seconds(3.0, cancellation);
            cancellation.ThrowIfCancellationRequested();
            Object.SetActive(false);
        });
    }
}`,
  },
];
export const exampleCode = id => {
  const e = workflowExamples.find(e => e.id === id);
  if (!e) throw new Error(`Exemplo desconhecido: ${id}`);
  return `\`\`\`csharp title="${e.filename}"\n${e.code}\n\`\`\`\n\n[Baixar ${e.filename}](/examples/${e.id}/${e.filename})`;
};
