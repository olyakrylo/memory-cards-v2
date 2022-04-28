import Cookies from "cookies";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

import { config } from "./config";

export const setCookie = (
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
  value?: string
): void => {
  const { secret } = config;
  const cookies = new Cookies(req, res, { secure: true });

  const data = value ? encryptString(value.toString(), secret) : undefined;
  const age = 7 * 24 * 60 * 60 * 1000; // week
  cookies.set(name, data, { maxAge: age, expires: new Date(Date.now() + age) });
};

export const getCookie = (
  req: NextApiRequest,
  res: NextApiResponse,
  name: string
): string | undefined => {
  const { secret } = config;
  const cookies = new Cookies(req, res, { secure: true });

  const value = cookies.get(name);
  return value ? decryptString(value, secret) : undefined;
};

const algorithm = "AES-256-CBC";

export function encryptString(str: string, key: string) {
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

export function decryptString(str: string, key: string) {
  const encryptedArray = str.split(":");

  const iv = Buffer.from(encryptedArray[0], "hex");
  const encrypted = Buffer.from(encryptedArray[1], "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  // @ts-ignore
  return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
}
