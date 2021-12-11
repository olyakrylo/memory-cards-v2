import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../utils/types";
import Cookies from "cookies";
import { getCookie } from "../utils/cookies";

type Method = "get" | "post" | "put" | "delete";

export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | null> {
  const cookies = new Cookies(req, res);
  const { API_URL, SECRET } = process.env;
  const token = getCookie(cookies, "id_token", SECRET as string);
  if (token) {
    const res = await fetch(`${API_URL as string}/users/${token}`);
    const { user } = await res.json();

    return user;
  }

  return null;
}

export async function request<T = any>(
  method: Method,
  path: string,
  body?: Record<string, any>
): Promise<T> {
  const request: Record<string, any> = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    request.body = JSON.stringify(body);
  }
  const res = await fetch(`/api/${path}`, request);
  return (await res.json()) as T;
}
