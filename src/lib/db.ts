import Redis from "ioredis";

export const redis = new Redis(
  6379,
  process.env.IS_DOCKER === "true" ? "redis" : "localhost",
);

export async function addFailedToken(token: string) {
  await redis.rpush("failed_tokens", token);
}

export async function getFailedTokens(count: number) {
  return await redis.lpop("failed_tokens", count);
}
