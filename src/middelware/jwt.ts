import jwt from "jsonwebtoken";
import { Context, Next } from "koa";
import HttpError from "../lib/HttpError.js";
import { decode as jwtDecode } from "#/lib/jwt.js";

declare module "koa" {
  interface DefaultState {
    jwtPayload: jwt.JwtPayload;
  }
}

function getToken(ctx: Context) {
  if (!ctx.request.headers.authorization) {
    return null;
  }

  const auth = ctx.request.headers.authorization.split(" ");

  if (auth.length < 2 || auth[0] !== "Bearer") {
    return null;
  }

  return auth[1];
}

const jwtVerif = async (ctx: Context, next: Next) => {
  const token: string | null = getToken(ctx);

  if (!token) {
    throw new HttpError(401);
  }

  try {
    const data = jwtDecode(token);
    ctx.state.jwtPayload = data;
  } catch (err) {
    if (
      err instanceof jwt.TokenExpiredError ||
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.NotBeforeError
    ) {
      throw HttpError.create(401).setExtra("message", err.message);
    }
    throw err;
  }

  await next();
};

export default jwtVerif;
