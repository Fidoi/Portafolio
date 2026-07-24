/**
 * Rate limiter de ventana fija en memoria.
 *
 * Nota de arquitectura: al ser en memoria, el conteo es por instancia. En un
 * despliegue serverless con varias instancias (p.ej. Vercel) el límite es
 * "best-effort", no estricto. Para un portafolio es más que suficiente y evita
 * abuso trivial (spam del formulario, quema de cuota de la IA). Si en el futuro
 * necesitas límites duros, migra el store a Upstash Redis manteniendo esta API.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();
const MAX_ENTRIES = 10_000;

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

function sweepExpired(now: number) {
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  // Limpieza oportunista para que el Map no crezca sin límite.
  if (store.size > MAX_ENTRIES) sweepExpired(now);

  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

/** Extrae la IP del cliente desde las cabeceras de proxy habituales. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") ?? "unknown";
}
