import { trail, badge, to } from './tools.mjs';

const d = (slug, title, description, body) => trail('desempenho', slug, title, description, body);

export const performanceTrail = [
d('niveis-de-qualidade', 'Níveis de qualidade S, A, B e C', 'O que cada nível de qualidade corta, onde escolher e como ele limita o que a cena pede.', `
${badge('device', 'medido no POCO F7 entre 22 e 25/10')}

O nível de qualidade do projeto é um **teto**, como o URP Asset de cada nível da Unity: a cena pode pedir sombras de 4 cascatas, mas no nível C recebe 2. Escolha o nível no ícone de **controles deslizantes** da barra superior (**Gráficos do projeto**). O painel mostra o corte no próprio valor (por exemplo, 4 → 2).

| O que limita | C | B | A e S |
| --- | --- | --- | --- |
| Render Scale | até 0,85, com resolução dinâmica | — | — |
| Sombra do sol | 2 cascatas de 1024 | 3 cascatas de 2048 | o que a cena pedir |
| Filtro da sombra | até 9 amostras | até 9 amostras | o que a cena pedir |
| Luzes por objeto | 4 | 8 | 8 |
| Luzes adicionais no quadro | 8 | 12 | 16 |
| Oclusão de ambiente | desligada | em meia resolução | o que a cena pedir |
| Bloom | em cadeia de mips | em cadeia de mips | o que a cena pedir |

Em todos os níveis, cada objeto avalia só as luzes pontuais que o alcançam.

## O que mudou na Vila Astra

| Medida (POCO F7) | Antes | Depois |
| --- | --- | --- |
| GPU do quadro no nível C, com o teto | 18,91 ms | 14,33 ms |
| Thread do jogo no nível S, personagens em paralelo | 13,83 ms | 10,00 ms |
| Sombra do sol em dois mapas, nível S | 2,64 ms | 1,37 ms |
| GPU do quadro na qualidade alta, contra 17/10 | 50,8 ms | 28,2 ms |

## Resolução dinâmica

No nível C (ou ligada no painel Gráficos), a escala de renderização desce quando a GPU passa do orçamento e volta quando sobra. Ela decide pela mediana de alguns quadros, ignora os quadros logo depois de cada troca e desce mais de um degrau quando o custo passa muito. Na Vila Astra em nível C no POCO F7, o FPS foi de 36,6 para 55,4 com a resolução dinâmica.

## Personagens

O **Animator** tem **Culling Mode**: Sempre animar, Atualizar transformações ou Desligar fora da câmera do jogo. Personagens que ocupam pouco da tela animam a cada 2 ou 4 quadros, com interpolação.
`),

d('custo-por-recurso', 'Quanto custa cada recurso gráfico', 'Tabela do custo medido no POCO F7 de cada recurso: nuvens, chuva, sondas, profundidade de campo, partículas e lightmap.', `
${badge('device', 'POCO F7 (Adreno 825), 2772×1280, rodadas intercaladas com e sem o recurso')}

Os custos são do POCO F7 e servem de ordem de grandeza: em outro aparelho os números mudam, a proporção costuma se manter.

| Recurso | Custo medido | Onde |
| --- | --- | --- |
| Nuvens (Cloud Layer) | +0,7 ms de GPU | Vila Astra |
| Nuvens volumétricas | +1,5 ms de GPU | Vila Astra |
| Chuva do Clima | +0,8 ms de GPU (3.200 gotas: ~0,06 ms no passe) | Vila Astra |
| Sondas de reflexo e de luz | +0,6 ms de GPU | Sponza |
| Profundidade de campo | +2 a 3,5 ms no pós | Vila Astra |
| Desfoque de movimento, aberração, distorção, vinheta, curvas | dentro do ruído | Vila Astra |
| Gradação de cor (LUT) | +0,09 ms | Vila Astra |
| Partículas: 1.000 faíscas / 8.000 | 0,26 / 0,87 ms de GPU | projeto de teste |
| Reflexo do céu, recaptura a cada quadro | +0,5 ms no pior caso | Vila Astra |
| Lightmap no lugar de 8 luzes em tempo real | −5,4 ms (18,58 → 13,18) | Sponza |

## O que mais pesa numa cena como a Vila

Medição de 23/10 na qualidade alta: o desenho da cena (14 ms), o pós-processamento (8,6 ms), a sombra do sol (cerca de 3,8 ms) e as 8 luzes da praça (2,9 ms). Para cortar, comece pelo ${to('desempenho', 'niveis-de-qualidade', 'nível de qualidade')} e pelo lightmap das luzes que não se movem.
`),
];
