import { Context } from "koa";
import z from "zod";
import { send } from "#/lib/firebase";
import { fcmMessageSchema } from "#/models/FCMMessage";
import { ZodError } from "zod";
import HttpError from "#/lib/HttpError";

export const fcmBatchSchema = z.object({
  messages: z.array(fcmMessageSchema).min(1).max(100), // limite batch (important)
});

export type FCMBatch = z.infer<typeof fcmBatchSchema>;

export default async (ctx: Context) => {
  try {
    const batch = fcmBatchSchema.parse(ctx.request.body);

    for (const message of batch.messages) {
      send(message);
    }

    ctx.status = 200;
    ctx.body = {
      message: `Batch of ${batch.messages.length} message${batch.messages.length > 1 ? "s" : ""} received successfully`,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      throw HttpError.fromZod(err);
    }
    throw err;
  }
};
