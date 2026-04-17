import z from "zod";

const MAX_TOKENS = 100;

export const fcmTopicSchema = z.object({
  tokens: z
    .array(z.string().trim().min(1, "Empty token not allowed"))
    .min(1, "At least one token is required")
    .max(MAX_TOKENS, `Maximum ${MAX_TOKENS} tokens allowed`),
  topic: z.string().trim().min(1, "Topic is required"),
});

export type FCMTopic = z.infer<typeof fcmTopicSchema>;
