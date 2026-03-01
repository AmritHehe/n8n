import crypto from "crypto";


const ENC_ALGO = "aes-256-gcm";
const ENC_KEY = crypto
  .createHash("sha256")
  .update(process.env.CREDENTIALS_SECRET || "")
  .digest(); // 32 bytes key

  export function encryptJSON(data: any) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENC_ALGO, ENC_KEY, iv);

  const json = JSON.stringify(data);
  let encrypted = cipher.update(json, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag().toString("base64");

  return {
    iv: iv.toString("base64"),
    content: encrypted,
    tag: authTag,
  };
}

export function decryptJSON(enc: {
  iv: string;
  content: string;
  tag: string;
}) {
  const decipher = crypto.createDecipheriv(
    ENC_ALGO,
    ENC_KEY,
    Buffer.from(enc.iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(enc.tag, "base64"));

  let decrypted = decipher.update(enc.content, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}

export function safeDecrypt(data: any) {
  if (
    data &&
    typeof data === "object" &&
    typeof data.iv === "string" &&
    typeof data.content === "string" &&
    typeof data.tag === "string"
  ) {
    try {
      return decryptJSON(data);
    } catch (err) {
      console.error("Failed to decrypt:", err);
      return data; // fallback, return encrypted data untouched
    }
  }

  // Not encrypted → return as-is
  return data;
}