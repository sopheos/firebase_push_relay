import jwt from "jsonwebtoken";
import config from "#/config.js";

export function encode(
  payload: jwt.JwtPayload,
  expiresIn: jwt.SignOptions["expiresIn"] = "1h",
): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

export function decode(token: string): jwt.JwtPayload {
  const isProd = config.env !== "development";
  let option: jwt.VerifyOptions = {};

  const data = jwt.verify(token, config.jwtSecret, {
    ...option,
    complete: false,
    maxAge: isProd ? "10m" : undefined, // 10 min only in prod
  });

  if (typeof data === "string") {
    throw new jwt.JsonWebTokenError("Empty payload");
  }
  return data;
}

export default {
  encode,
  decode,
};
