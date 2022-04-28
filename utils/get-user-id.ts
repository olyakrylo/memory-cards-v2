import { NextApiRequest, NextApiResponse } from "next";

import { getCookie } from "./cookies";

export const getUserId = (
  req: NextApiRequest,
  res: NextApiResponse
): string | undefined => {
  return getCookie(req, res, "id_token");
};
