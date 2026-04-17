import { Context } from "koa";
import { getFailedTokens } from "#/lib/db";

export default async (ctx: Context) => {
  const failedTokens = await getFailedTokens(1000);
  ctx.status = 200;
  ctx.body = failedTokens && failedTokens.length ? failedTokens : [];
};
