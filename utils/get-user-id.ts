import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { config } from "./config";
import { getCookie } from "./cookies";

export const getUserId = (
  req: NextApiRequest,
  res: NextApiResponse
): string | undefined => {
  const cookies = new Cookies(req, res);
  const { secret } = config;
  return getCookie(cookies, "id_token", secret);
};
