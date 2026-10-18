// Cron diário da Vercel: apaga janelas e eventos com mais de 180 dias e sessões
// que ficaram vazias. Com CRON_SECRET definido, a Vercel assina a chamada e só
// ela passa; sem ele, qualquer chamada apenas aplica a mesma política de 180 dias.
import { database, ensureSchema } from "./_store.js";

export default async function handler(request, response) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.authorization !== `Bearer ${secret}`) {
    response.statusCode = 401;
    return response.end("unauthorized");
  }
  const sql = database();
  if (!sql) {
    response.statusCode = 503;
    return response.end("banco não configurado");
  }
  await ensureSchema(sql);
  const windows = await sql`delete from telemetry.windows where received_at < now() - interval '180 days' returning id`;
  const events = await sql`delete from telemetry.events where received_at < now() - interval '180 days' returning id`;
  const sessions = await sql`delete from telemetry.sessions s where s.received_at < now() - interval '180 days'
                             and not exists (select 1 from telemetry.windows w where w.session_id = s.id) returning id`;
  response.statusCode = 200;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify({ windows: windows.length, events: events.length, sessions: sessions.length }));
}
