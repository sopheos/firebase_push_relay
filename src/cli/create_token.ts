import { decode, encode } from "#/lib/jwt";

const payload = {
  sub: "test",
};

const token = encode(payload, "1y");

const payloadDecoded = decode(token);

console.log("Generated JWT Token:", token);
console.log("Decoded JWT Payload:", payloadDecoded);
