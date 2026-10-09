export const animatorAdditiveGuide = {
  route: 'pt-br/snapshot-2026-10-07/sistemas/animator-aditivo',
  title: 'Animator: composição aditiva e pose de referência',
  description: 'Sobreponha deslocamentos relativos em hierarquias, mecanismos, modelos com skin e canais de morph.',
  body: `:::note[Disponível no APK público 0.3.0]
A composição aditiva, aceita no Astra Dev 0.2.7 (code 15), está no APK público **0.3.0-preview.20261009**, versionCode 28, em [Download](/download/). A validação desta revisão segue registrada em Atualizações.
:::

## O que a camada faz

**Substituição** mistura poses absolutas. **Aditiva** calcula a diferença entre o clipe tocando e uma referência; aplica essa diferença sobre o resultado das camadas inferiores.

- Posição e morph: diferença dos valores.
- Rotação: diferença local por quaternion, aplicada com peso entre identidade e diferença.
- Escala: razão entre amostra e referência, multiplicada sobre a escala inferior.

Um peso de zero remove a contribuição, sem congelar sua última pose. Trocar para um estado vazio também retira os canais antigos enquanto o grafo permanece ativo. Desativar o Animator preserva o contrato anterior de manter a última pose.

A ordem é a das camadas: aditivas são aplicadas depois das inferiores; uma camada superior de substituição atenua as inferiores por propriedade. Máscaras restringem a subárvore, incluindo morphs. Transformações cuja autoridade pertence à física continuam protegidas.

## Criar e ajustar

1. Abra o grafo de um Animator e selecione a camada, sem selecionar um estado.
2. Abra **Ajustes**. Escolha **Composição → Aditiva**, ajuste **Peso** e escolha **Referência**.
3. Sem clipe explícito, a referência é a pose de repouso capturada pelo compositor ao tocar o objeto pela primeira vez. Com clipe, escolha **Tempo · s**; o instante é limitado à duração daquele clipe.
4. **Usar pose inicial** limpa o clipe e o tempo de referência. Edições de autoria entram no histórico e na cena/recurso.
5. Durante o Play, peso, modo, referência e tempo são valores por instância. **Restaurar composição** recupera os valores autorados. Stop descarta esses ajustes de execução.

Controllers compartilhados exigem **Editar recurso** para alterar a definição. O Play mantém alterações independentes por objeto. Overrides de clipes também substituem usos como referência; confira esse efeito ao reutilizar um controller.

![Camada aditiva no Android após salvar e reabrir: peso 0,65 e referência em 0,25 s.](/assets/animator-additive-dev.png)

## Validação desta revisão

16/16 cenários focados no host, incluindo compositor, máscaras, transições, morph, skin, migração, histórico e isolamento. SDK Release sem erros ou avisos; build nativo Android e APK concluídos. No POCO F7/Android 16, oito checks pela API C# passaram antes e depois da autoria de valores personalizados; salvar, encerrar e reabrir preservou peso 0,65 e referência em 0,25 s. Os 417 frames da captura foram revisados, com PTS e hashes, em 14 folhas e capturas completas adicionais.

A sonda altera poses em etapas para comparar composição e instâncias. Essa conferência não mede FPS sustentado, multidões nem suavidade de caminhada. A cadeia de skin e morph foi verificada no host; o cenário físico usa mecanismos sem skin.

## API C# de execução

~~~csharp
var animator = Object.Animator();
animator.SetLayerBlendMode(1, AnimationLayerBlendMode.Additive);
animator.SetLayerWeight(1, 0.4f);
animator.SetLayerReferenceClip(1, referenceClipGuid);
animator.SetLayerReferenceTime(1, 0.25f);
var reference = animator.GetLayerReferenceClip(1);
var weight = animator.GetLayerWeight(1);
animator.ResetLayerOverrides(1);
~~~

As camadas usam índices começando em zero. Peso aceita 0–1; tempo aceita 0–86400 segundos, com amostragem limitada ao clipe. GetLayerBlendMode e GetLayerReferenceTime completam a inspeção. Índice inválido e valores fora do contrato são recusados; um GUID desconhecido retorna UnknownResource, preservando o ajuste anterior.

Essas APIs alteram execução. Autoria de topologia aninhada e edição de clipes por SDK são etapas posteriores; não estão implícitas nesses setters.

## Referências e erros

Uma referência explícita precisa oferecer canais compatíveis no mesmo alvo e caminho. Canais ausentes ou com largura incompatível são diagnosticados e mantêm a base; não há substituição silenciosa pela pose inicial. Canais compatíveis continuam sendo compostos.

Referência com escala zero não permite calcular uma razão. Quaternion inválido e TRS não representável também são diagnosticados. O compositor atual não publica escalas negativas/nulas como uma decomposição inventada. Confira o aviso do workspace e corrija a referência.

Retargeting não é realizado pela escolha do clipe: seus canais ainda precisam encontrar os nós corretos. Máscara é subárvore, sem pesos diferentes por osso. Não há garantia de desempenho para multidões nesta revisão.

## Persistência e limites

Animator **v4** acrescenta modo, GUID e tempo de referência por camada. Recursos usam **AEANIMATOR 2**. Leitores novos aceitam Animator v1–v3 e AEANIMATOR 1; preservam o comportamento antigo da camada base com peso integral. APKs antigos não leem os novos formatos: faça backup antes de salvar.

Esta entrega fecha composição aditiva de pose; submáquinas, interrupções, editor completo de clipes/curvas, retargeting, IK, root motion e importação nativa de FBX continuam em desenvolvimento. A presença de ícones FBX no navegador não significa suporte de importação.

Referência estudada: [Unity 6000.0 — Animation Layers](https://docs.unity3d.com/6000.0/Documentation/Manual/AnimationLayers.html). O princípio de sobreposição foi adaptado ao compositor tipado existente e à autoria por toque da Astra.
`
};
