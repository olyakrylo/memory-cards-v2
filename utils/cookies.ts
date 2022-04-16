import Cookies from "cookies";
import * as crypto from "crypto";

export const setCookie = (
  cookies: Cookies,
  name: string,
  secret: string,
  value?: string
): void => {
  const data = value ? encryptCookie(value.toString(), secret) : undefined;
  cookies.set(name, data, { maxAge: 7 * 24 * 60 * 60 * 1000 });
};

export const getCookie = (
  cookies: Cookies,
  name: string,
  secret: string
): string | undefined => {
  const value = cookies.get(name);
  return value ? decryptCookie(value, secret) : undefined;
};

const algorithm = "AES-256-CBC";

export function encryptCookie(str: string, key: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = [
    iv.toString("hex"),
    ":",
    cipher.update(str, "utf8", "hex"),
    cipher.final("hex"),
  ];

  return encrypted.join("");
}

export function decryptCookie(str: string, key: string) {
  const encryptedArray = str.split(":");

  const iv = Buffer.from(encryptedArray[0], "hex");
  const encrypted = Buffer.from(encryptedArray[1], "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  // @ts-ignore
  return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
}
