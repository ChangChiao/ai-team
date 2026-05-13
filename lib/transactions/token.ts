import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function generateConfirmationToken() {
  return randomBytes(32).toString("base64url");
}

export function hashConfirmationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function confirmationTokensMatch(rawToken: string, storedHash: string) {
  const rawHash = hashConfirmationToken(rawToken);
  const rawBuffer = Buffer.from(rawHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (rawBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(rawBuffer, storedBuffer);
}
