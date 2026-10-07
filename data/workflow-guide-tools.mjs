import fs from 'node:fs';
import zlib from 'node:zlib';

const source = new URL('./components.json', import.meta.url);
const components = JSON.parse((fs.existsSync(source) ? fs.readFileSync(source) : zlib.gunzipSync(fs.readFileSync(new URL('./components.json.gz', import.meta.url)))).toString('utf8'));
export const link = (route, label) => `[${label}]($BASE/${route}/)`;
export const api = name => link(`api/astra-${name.replaceAll('.', '-').toLowerCase()}`, name);
export const component = id => {
  const item = components.find(c => c.typeId === id);
  if (!item) throw new Error(`Componente desconhecido no guia: ${id}`);
  return link(`componentes/${id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`, item.name);
};
export const roadmap = (route, label = 'Estado e evolução desta família') => link(route, label);
export const page = (section, slug, title, description, body, order) => ({
  route: `${section}/${slug}`, title, description, body,
  options: { kind: slug === 'indice' ? 'index' : 'guide', front: {
    reviewedAt: '2026-10-07', ...(order === undefined ? {} : { sidebar: { order } }),
  } },
});
