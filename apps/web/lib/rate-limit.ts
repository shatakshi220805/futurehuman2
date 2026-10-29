import { getRedis } from "./redis";

export async function rateLimit(key: string, limit: number, windowSec: number) {
  const redis = getRedis();
  if (!redis) return { ok: true, remaining: limit };

  const id = `rl:${key}`;
  const count = await redis.incr(id);
  if (count === 1) await redis.expire(id, windowSec);
  return { ok: count <= limit, remaining: Math.max(0, limit - count) };
}
