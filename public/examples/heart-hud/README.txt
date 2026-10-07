ASTRA DOCS — HUD DE CORAÇÕES
Snapshot C# 06/10/2026

Tutorial completo:
https://astraengine.com.br/pt-br/snapshot-2026-10-06/ui/hud-coracoes/

Este pacote contém um documento de UI, duas imagens PNG e três scripts de exemplo.
Não é um APK nem um projeto/cena completo importável por um único clique.
Não contém fontes da engine.

1. Coloque Images/heart-full.png e Images/heart-empty.png na pasta Images do seu projeto.
2. Coloque UI/hud.aeui na pasta UI. Na área Interface, informe UI/hud.aeui e use Abrir;
   depois Salvar para registrá-lo como recurso do projeto.
3. Adicione os três arquivos .cs à área de código e compile o projeto.
4. No objeto Jogador, anexe PlayerHealth. No objeto HUD, anexe Canvas UI e HeartHud.
5. Atribua o recurso UI/hud.aeui no Canvas UI e use Apresentação = Tela.
6. Atribua Jogador no campo Player do HeartHud. Salve a cena e a UI.
7. Entre em Play. Dano/Cura mudam a vida e os corações; Interagir não executa o C#.
8. HeartDamageTrigger é opcional: anexado a uma zona de sensor 3D, retira vida na entrada.
   Exige participação física 3D do jogador e PlayerHealth no objeto resolvido pelo evento.

Vida começa em 3, limita dano/cura a 0–3 e reinicia ao reabrir Play.
Não implementa respawn, invulnerabilidade, meio coração ou save persistente.

O .aeui foi produzido pelo serializer nativo e relido com 10 elementos válidos.
Compilação dos scripts é registrada separadamente no manifesto de exemplos.
Esta edição de documentação não executou o cenário em aparelho físico.

As imagens e os scripts foram autorados para este tutorial. A política de
redistribuição acompanha a política editorial do portal; uma licença pública
não foi definida. O pacote não concede licença dos fontes da engine.
