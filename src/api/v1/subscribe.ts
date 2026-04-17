import { Context } from "koa";
import { ZodError } from "zod";
import { messaging } from "#/lib/firebase";
import { fcmTopicSchema } from "#/models/FCMTopic";
import HttpError from "#/lib/HttpError";

export default async (ctx: Context) => {
  try {
    const data = fcmTopicSchema.parse(ctx.request.body);
    await messaging().subscribeToTopic(data.tokens, data.topic);

    ctx.status = 200;
    ctx.body = {
      message: `Successfully subscribed ${data.tokens.length} token${data.tokens.length > 1 ? "s" : ""} to topic ${data.topic}`,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      throw HttpError.fromZod(err);
    }
    console.log(err);
    throw err;
  }
};
