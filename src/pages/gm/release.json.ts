import release from '../../../data/gm-release.json';

export function GET() {
  return new Response(JSON.stringify(release, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
