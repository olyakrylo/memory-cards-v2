import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../utils/types";
import Cookies from "cookies";
import { getCookie } from "../utils/cookies";
import { connect } from "../utils/connection";

type Method = "get" | "post" | "put" | "delete";

export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | null> {
  const cookies = new Cookies(req, res);
  const { SECRET } = process.env;
  const id = getCookie(cookies, "id_token", SECRET as string);
  if (id) {
    const { User } = await connect();
    const user = await User.findById(id);
    return {
      ...user._doc,
      _id: id,
    };
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
