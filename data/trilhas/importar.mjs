import { trail, badge, shot, to } from './tools.mjs';

// A conversão de efeitos (G6) só aparece quando estiver no APK. Nas páginas públicas
// não entram nomes de pacotes da Asset Store, só o fluxo e o que vira o quê.
const g6Merged = true;
const i = (slug, title, description, body) => trail('importar', slug, title, description, body);

export const importTrail = [
i('o-que-importar', 'O que dá para importar e os limites', 'Modelos, texturas, HDRI, áudio e arquivos Unity: o que cada formato vira no projeto, os limites e as mensagens de recusa.', `
${badge('host', 'limites e mensagens conferidos na fonte do importador')}

Importe pelo botão **Importar** da barra superior (Modelo, Pasta de pacote, Textura, Ambiente HDRI, Áudio) ou pelos ícones do painel Arquivos. O seletor do Android aceita até **64 arquivos e 128 MB por seleção**; uma pasta pode ter até 8 níveis e 4.096 arquivos.

## Resumo

| Formato | Vira | Limite principal |
| --- | --- | --- |
| GLB (glTF 2.0 binário) | Modelo com malhas, materiais, texturas, skin, blend shapes e clipes | 256 MiB, 4 milhões de vértices |
| .gltf com .bin e texturas | O mesmo, pela importação de **pasta** | um .gltf avulso é recusado |
| FBX | Modelo (perfil estático) ou modelo com rig, takes e morph | até 256 ossos, 4 influências por vértice |
| PNG, JPEG, TGA, KTX2 (BasisU), TIFF | Textura | 8192 px; acima de 4096 é reduzida |
| .hdr (Radiance) | Céu e reflexo (HDRI) | panorama 2:1; OpenEXR não |
| WAV | Clipe de áudio | 32 MiB pelo seletor |
| .mat, .anim, .prefab, .controller da Unity | Material, clipe, prefab, Animator | só pela Biblioteca de pacotes |

## Modelos

**GLB / glTF.** Aceita as extensões de compressão (Draco, meshopt, BasisU, quantização) e de luz; outras extensões obrigatórias são recusadas com "Extensão obrigatória sem decodificador". Skin com mais de 4 influências fica com as 4 maiores, renormalizadas. Até 64 blend shapes por malha.

**FBX.** Dois perfis:
- **Perfil estático:** malhas e materiais; recusa skin, morph, takes e constraints.
- **FBX rig/takes/morph = Importar:** um skin por malha, de 1 a 256 ossos; mais de 4 influências pede **Reduzir top 4** no Perfil; takes assados a 30 ou 60 Hz.
- Sempre recusados: constraints, NURBS e, se ligados, câmeras e luzes do FBX.

**Gerar UV de lightmap** (no Perfil) cria a UV2 para o lightmap; malhas com skin ou blend shape ficam de fora.

## Texturas

- PNG, JPEG, TGA não indexado (RGB, RGBA ou cinza), KTX2 com BasisU e TIFF **sem compressão** (TIFF com LZW ou outra compressão é recusado: converta para PNG).
- Até 8192 px e 16 megapixels; o projeto guarda no máximo 4096 px (reduz, não recusa).
- Opções: Interpretação (Cor sRGB, Dados lineares, Mapa normal), Tamanho máximo, Mipmaps, Normal Y (DirectX ou OpenGL), streaming.

## HDRI

Só Radiance **.hdr** equiretangular 2:1, até 8192 px. Vira o céu panorâmico e o reflexo do ambiente. "OpenEXR não está disponível."

## Áudio

Só **WAV**: PCM de 8, 16, 24 ou 32 bits ou float, mono ou estéreo, de 8 a 192 kHz, até 32 MiB pelo seletor. MP3 e OGG não são lidos.

## Arquivos Unity

Entram pela ${to('importar', 'biblioteca-de-pacotes', 'Biblioteca de pacotes')}, a partir de uma pasta. \`.unitypackage\` não é lido: extraia o pacote numa pasta antes. Cenas \`.unity\`, scripts \`.cs\` e shaders \`.shader\` não têm conversor. O que vira o quê: ${to('importar', 'unity-para-astra', 'Unity → Astra')}.
`),

i('biblioteca-de-pacotes', 'Importar um pacote pela Biblioteca', 'Passo a passo para trazer uma pasta de pacote (por exemplo, um pacote Unity extraído): catalogar, revisar, preparar o perfil e pôr na cena.', `
${badge('device', 'fluxo usado no POCO F7 com pacotes de teste em 16 e 19/10')}

## 1. Ter a pasta no celular

Copie a pasta do pacote para o aparelho (por exemplo, \`/sdcard/Astra/Pacotes/MeuPacote\`). Se for um \`.unitypackage\`, extraia antes no computador.

## 2. Importar

Barra superior › **Importar** › **Pasta de pacote** › escolha a pasta no seletor do Android. A Astra copia e cataloga cada arquivo: "Pacote preservado e catalogado; conversões são ações explícitas por item." Nada é convertido ainda.

## 3. A Biblioteca

${shot('importar/biblioteca.webp', 'Biblioteca de pacotes com o trilho de tipos e os cartões de um pacote próprio', 'A Biblioteca com um pacote.')}

- O **trilho de tipos** filtra: Todos, Modelos, Clipes, Materiais, Texturas, Prefabs, Cenas, Código, Documentos, Outros, Controllers, Projeto.
- Cada cartão tem um selo: ✓ pronto, ⤓ a converter, ⚠ recusado (≈ quando é aproximado).
- O cartão **Materiais Unity** mostra **Completos**, **Aproximados** e **Sem conversão**; tocar num bloco filtra a lista.

## 4. Um modelo: revisar e preparar

Toque o modelo › **Abrir**. O importador abre com as abas Resumo, Estrutura, Malhas, Texturas, **Perfil** e Rig/Takes.

${shot('importar/perfil.webp', 'Aba Perfil do importador com Gerar UV de lightmap', 'Aba Perfil do modelo.')}

No **Perfil** (páginas com Anterior / Próxima): Escala, Textura máxima, Compressão (ASTC), Normais, Tangentes, LOD, **Gerar UV de lightmap** e, no FBX, **FBX rig/takes/morph**, **Mais de 4 influências** (Reduzir top 4 ou Recusar perda), Steps e a taxa de Bake dos takes. Depois toque **Preparar**. Mudar o perfil depois pede preparar de novo.

## 5. Publicar

Nas outras abas: **Só recurso** (fica no projeto) ou **Na cena** (põe na cena). Se a estrutura for ambígua, escolha **Pela ordem** ou **Como novos**.

## 6. Efeitos prontos (prefabs de partícula)

Toque um prefab de efeito › **Abrir**. A Astra converte em cascata o que ele usa: materiais, sons WAV, prefabs de impacto e a malha das partículas. O resultado é um prefab Astra com **Sistema de partículas** e, conforme o efeito, **Linha**, **Laser**, **Projétil**, **Instanciar ao colidir**, **Som repetido**, **Girar** ou **Seguir câmera**. Ponha **Na cena** e aperte **Play**.

- Para ouvir os sons 3D, a cena precisa de um **Ouvinte de áudio**: o projeto novo já traz um na Main Camera, e sem Ouvinte o Play ouve pela câmera do jogo.
- O que não converte aparece no detalhe do item como perda ou aproximação; o efeito abre sem a parte que faltou.
- Nenhum asset de pacote vem com a Astra: você importa os pacotes que tem.

## 7. Materiais, clipes, prefabs e controllers

\`.mat\`, \`.anim\`, \`.prefab\` e \`.controller\` convertem ao tocar **Abrir**. Para um clipe Humanoid, selecione antes o personagem na cena. Um prefab precisa das malhas e materiais já convertidos ("Converta primeiro a dependência pela Biblioteca").

## Se algo não converter

O detalhe do item mostra o motivo em chips (Conversão…, Aproximação…). As fontes ficam preservadas: dá para reimportar depois que a Astra ganhar o conversor.
`),

i('unity-para-astra', 'Unity → Astra: o que vira o quê', 'Tabela do que o importador converte de prefabs, materiais e clipes da Unity, o que é aproximado e o que é recusado.', `
${badge('host', 'regras conferidas na fonte do importador; recusas listadas como aparecem no app')}

## Prefabs

| Unity | Astra | Observação |
| --- | --- | --- |
| GameObject + Transform | Objeto | Static e metadados do editor descartados |
| MeshFilter + MeshRenderer | Mesh Renderer | sombras e sondas convertidas; lightmaps não são trazidos |
| Tag diferente de Untagged, Layer diferente de 0 | Untagged e camada Padrão, com aviso | ajuste a marca e a camada depois |
| Prefab Variant, instância com patches | recusado | |
| Componente sem equivalente | perda listada no detalhe do item | o prefab abre sem ele |
${g6Merged ? `| ParticleSystem + Renderer | Sistema de partículas | módulos convertidos; Folha em modo Sprites e Trilha Ribbon ficam de fora |
| Light | Luz | luz de Área vira pontual |
| AudioSource | Fonte de áudio | rolloff personalizado vira logarítmico |
| Rigidbody, Box/Sphere/Capsule Collider (3D e 2D) | Corpo físico, Colisor | trigger sem Rigidbody vira sólido estático |
| LineRenderer | Linha | até 8 pontos |
| Scripts comuns de pacotes de efeitos: destruir ao terminar, projétil, instanciar na colisão, som de efeito, laser, girar, seguir o jogador | Destruir ao parar, Projétil, Instanciar ao colidir, Som repetido, Laser, Girar, Seguir câmera | outros scripts viram perda listada; o prefab abre sem eles |
| Materiais de partícula (shaders de efeito conhecidos e os Particles legados da Unity) | Material com shader Partícula | brilho, rolagem, ruído e distorção vão para o Sistema de partículas |
` : ''}
## Materiais (.mat)

| Shader Unity | Astra |
| --- | --- |
| Standard | Lit (Complex Lit com clear coat) |
| Standard (Specular setup) | Lit, fluxo especular |
| URP Lit / Simple Lit / Unlit | Lit / Simple Lit / Unlit |
| URP Particles Lit / Unlit | Particles Lit / Unlit |

Suavidade do mapa metálico e do alfa do albedo viram suavidade de verdade; o Metallic é convertido de sRGB para linear, como a Unity faz. Recusas: shader sem conversor, alfa da cor fora do modo opaco, Blend ou ZWrite personalizados, textura fora dos slots conhecidos. Aproximações declaradas: Receive Shadows, Soft Particles, Flip-Book Blending.

## Clipes e controllers

- \`.anim\` vira clipe; Humanoid em ${to('importar', 'humanoid-e-clipes', 'Humanoid e clipes')}.
- \`.controller\` vira Animator. Recusa: máscara, IK ou sync na camada, camada aditiva, sub-state machines, Write Defaults desligado, StateMachineBehaviour, Blend Tree que não seja 1D simples.

## Não convertidos

Cenas \`.unity\`, scripts \`.cs\` (fora os casos conhecidos), shaders \`.shader\`, \`.obj\`, \`.dae\`, \`.unitypackage\`.
`),

i('humanoid-e-clipes', 'Personagens Humanoid e clipes .anim', 'Como um clipe Humanoid da Unity vira animação no seu personagem, e o que é recusado.', `
${badge('device', 'dois personagens Humanoid de teste convertidos e vistos no POCO F7 em 16/10')}

A Astra não tem um componente Avatar: o mapeamento vem do \`.meta\` do modelo (humanDescription e a pose em T). Sem o \`.meta\`, usa os nomes humanos da Unity e os do Mixamo.

## Passo a passo

1. Importe o modelo do personagem e ponha na cena.
2. Selecione o personagem.
3. Na Biblioteca, toque o \`.anim\` › **Abrir**. Sem o personagem selecionado: "Clipe Humanoid (músculos): escolha o personagem com Avatar Humanoid antes de aplicar…".
4. O clipe abre no estúdio de animação.

## Como converte

Os 95 músculos viram rotações de 55 ossos, ajustadas pela pose em T do seu personagem, mais a posição do quadril. Contra o projeto UMotion do Kyle, o erro médio das mãos ficou em 6,7 a 7,2 cm, com cerca de 5 cm de deslocamento vertical constante.

## Aceito e recusado

- **Bake Into Pose** é aceito; a pose completa é escrita, sem extrair root motion.
- **Loop Time** vira o laço do clipe.
- Recusado: **Loop Pose**, **Mirror**, pose de referência aditiva, Level e Cycle Offset diferentes de zero, curvas Euler e WrapMode legado.
- Curvas de IK e Motion ficam de fora.
`),
];
