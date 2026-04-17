import { Context } from "koa";
import { ZodError } from "zod";
import { send } from "#/lib/firebase";
import { fcmMessageSchema } from "#/models/FCMMessage";
import HttpError from "#/lib/HttpError";

export default async (ctx: Context) => {
  try {
    const message = fcmMessageSchema.parse(ctx.request.body);
    send(message);

    ctx.status = 200;
    ctx.body = {
      message: `Message received successfully`,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      throw HttpError.fromZod(err);
    }
    throw err;
  }
};
