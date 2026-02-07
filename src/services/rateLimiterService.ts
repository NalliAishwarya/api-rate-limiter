import redisClient from "../utils/redisClient";

const MAX_TOKENS = 5;
const REFILL_RATE = 1; // tokens per second

export async function isRequestAllowed(
  identifier: string,
  route: string
) {
  const key = `rate_limit:${identifier}:${route}`;
  const now = Date.now();

  const data = await redisClient.hGetAll(key);

  let tokens = data.tokens ? Number(data.tokens) : MAX_TOKENS;
  let lastRefill = data.lastRefill ? Number(data.lastRefill) : now;

  // refill tokens
  const elapsedSeconds = (now - lastRefill) / 1000;
  tokens = Math.min(MAX_TOKENS, tokens + elapsedSeconds * REFILL_RATE);

  if (tokens < 1) {
    const retryAfterSeconds = Math.ceil(
      (1 - tokens) / REFILL_RATE
    );

    return {
      allowed: false,
      remaining: 0,
      retryAfter: retryAfterSeconds
    };
  }

  tokens -= 1;

  await redisClient.hSet(key, {
    tokens: tokens.toString(),
    lastRefill: now.toString()
  });

  await redisClient.expire(key, 60);

  return {
    allowed: true,
    remaining: Math.floor(tokens),
    retryAfter: 0
  };
}

