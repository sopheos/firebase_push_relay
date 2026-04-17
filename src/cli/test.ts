import { redis } from "#/lib/db";

async function main() {
  const add = [];

  for (let i = 0; i < 100; i++) {
    add.push(redis.rpush("test", `Hello, World! ${i}`));
  }

  await Promise.all(add);

  console.log(await redis.llen("test"));
  console.log(await redis.lpop("test", 1000));
  console.log(await redis.llen("test"));

  await redis.del("test");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(console.error);
