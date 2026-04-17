import z from "zod";

const MAX_TOKENS = 100;

export const fcmMessageSchema = z
  .object({
    token: z.string().optional(),
    topic: z.string().optional(),
    condition: z.string().optional(),

    tokens: z
      .array(z.string().trim().min(1, "Empty token not allowed"))
      .max(MAX_TOKENS, `Maximum ${MAX_TOKENS} tokens allowed`)
      .optional(),

    notification: z
      .object({
        title: z.string(),
        body: z.string(),
      })
      .optional(),

    data: z.record(z.string(), z.string()).optional(),
  })
  // At least one target (token, topic, condition or tokens) must be provided
  .refine(
    (data) => {
      const count =
        (data.token ? 1 : 0) +
        (data.topic ? 1 : 0) +
        (data.condition ? 1 : 0) +
        (data.tokens && data.tokens.length > 0 ? 1 : 0);

      return count === 1;
    },
    {
      message:
        "Exactly one target must be provided: token, tokens, topic, or condition",
    },
  )
  // notification OR data is required
  .refine((data) => !!data.notification || !!data.data, {
    message: "Message is missing : notification or data",
  });

export type FCMMessage = z.infer<typeof fcmMessageSchema>;
