// A engine cita pacotes de terceiros da Asset Store como referência interna (por
// exemplo, em descrições e termos de busca de componentes de efeito). Essas citações
// não vão para as páginas públicas: o site mostra a função, não o pacote.
const names = String.raw`UniStorm|Hovl\w*|RPG VFX|Synty|Pixagon|BoZo|\bEnviro\b|\bPOLYGON\b`;
const mention = new RegExp(`(${names})`, 'i');

export const isThirdParty = s => mention.test(String(s ?? ''));

// Tira trechos "como … <pacote> …" e termos soltos que citam o pacote.
export const publicText = s => String(s ?? '')
  .replace(new RegExp(`,?\\s*como [^,.;]*(${names})[^,.;]*`, 'gi'), '')
  .replace(new RegExp(`\\s*\\([^)]*(${names})[^)]*\\)`, 'gi'), '');

export const publicAliases = s => String(s ?? '').split(/\s+/).filter(w => w && !mention.test(w)).join(' ');

export const publicComponent = c => ({ ...c, description: publicText(c.description), aliases: publicAliases(c.aliases) });

export const publicApiType = t => ({ ...t, docs: t.docs ? { ...t.docs, summary: publicText(t.docs.summary), remarks: publicText(t.docs.remarks) } : t.docs });
