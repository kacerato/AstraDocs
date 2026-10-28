// Ferramentas comuns das trilhas (/guia/…): páginas atuais, sem data no endereço.
import fs from 'node:fs';

export const releaseLabel = '0.4.0';
const statusLabels = {
  device: 'Validado no aparelho',
  host: 'Conferido na fonte e no computador',
  partial: 'Parcial',
};
// Selo de verdade de cada página ou seção: o que foi visto no POCO F7, o que foi só
// conferido na fonte e o que é parcial.
export const badge = (status, note = '') => `> **${statusLabels[status]}** · APK ${releaseLabel}${note ? ` · ${note}` : ''}`;

// Captura real do aparelho em public/guia/. Enquanto a rodada de capturas não chega,
// a página sai sem a imagem.
export const shot = (file, alt, caption) => {
  const exists = fs.existsSync(`public/guia/${file}`);
  if (!exists) return '';
  return `\n<figure class="astra-shot"><img src="/guia/${file}" alt="${alt.replaceAll('"', '&quot;')}" loading="lazy" /><figcaption>${caption}</figcaption></figure>\n`;
};

export const trail = (dir, slug, title, description, body, extra = {}) => ({
  route: `guia/${dir}/${slug}`, title, description, body: body.trim(), ...extra,
});
export const to = (dir, slug, label) => `[${label}](/guia/${dir}/${slug}/)`;
