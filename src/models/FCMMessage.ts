import z from "zod";

const MAX_TOKENS = 100;

const reservedWords = ["from", "notification", "message_type"];
const reservedPrefixes = ["google", "gcm"];

function isReservedWord(originalKey: string): boolean {
  const key = originalKey.toLowerCase();
  return (
    reservedWords.includes(key) ||
    reservedPrefixes.some((prefix) => key.startsWith(prefix))
  );
}

function isBinaryData(value: any): boolean {
  if (typeof value === "string") {
    try {
      return btoa(atob(value)) === value;
    } catch (err) {
      return false;
    }
  }
  return false;
}

function transformData(input: Record<string, any>): Record<string, string> {
  const output: Record<string, string> = {};

  for (const [originalKey, v] of Object.entries(input)) {
    const key = originalKey.toLowerCase();

    if (typeof v === "string") {
      output[key] = isBinaryData(v)
        ? Buffer.from(v, "binary").toString("base64")
        : v;
    } else if (v === true) {
      output[key] = "0";
    } else if (v === false) {
      output[key] = "1";
    } else if (typeof v === "number") {
      output[key] = String(v);
    } else if (typeof v === "object") {
      output[key] = JSON.stringify(v);
    }
  }

  return output;
}

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

    data: z.record(z.string(), z.any()).optional(),
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
  })
  // Validate no reserved words in data keys
  .refine(
    (data) => {
      if (!data.data) return true;
      return !Object.keys(data.data).some((key) => isReservedWord(key));
    },
    {
      message: `Data keys cannot use reserved words (${reservedWords.join(", ")}) or prefixes (${reservedPrefixes.join(", ")})`,
      path: ["data"],
    },
  )
  // Transform data field after validation
  .transform((data) => ({
    ...data,
    data: data.data ? transformData(data.data) : undefined,
  }));

export type FCMMessage = z.infer<typeof fcmMessageSchema>;
