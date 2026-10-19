// POST /api/telemetry/ingest/ — endereço estável que o app Astra usa para a
// telemetria de desempenho opcional. Repassa o corpo, sem ler nem guardar nada,
// para a Neon Function "ingest" do projeto astra-telemetry, que valida o lote
// (astra.telemetry.batch/1 ou astra.telemetry.delete/1), grava no Postgres e
// aplica a retenção de 180 dias. Fonte da função: repositório da engine,
// services/telemetry/neon/index.mjs.
const Upstream = "https://br-mute-dawn-b70p1deg-ingest.compute.c-13.us-east-1.aws.neon.tech/";
const MaximumBodyBytes = 256 * 1024;

function reply(response, status, body) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.end(typeof body === "string" ? body : JSON.stringify(body));
}

export default async function handler(request, response) {
  if (request.method !== "POST") return reply(response, 405, { error: "método" });
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MaximumBodyBytes) return reply(response, 413, { error: "tamanho" });
    chunks.push(chunk);
  }
  try {
    const upstream = await fetch(Upstream, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: Buffer.concat(chunks),
      signal: AbortSignal.timeout(20000),
    });
    return reply(response, upstream.status, await upstream.text());
  } catch (error) {
    console.error("[telemetry] repasse falhou", error?.message);
    return reply(response, 502, { error: "indisponível" });
  }
}
