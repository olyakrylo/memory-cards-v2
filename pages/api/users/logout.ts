import { NextApiRequest, NextApiResponse } from "next";

import { ResponseFuncs } from "../../../utils/types";
import { getCookie, setCookie } from "../../../utils/cookies";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    GET: (req: NextApiRequest, res: NextApiResponse) => {
      if (getCookie(req, res, "id_token")) {
        setCookie(req, res, "id_token");
      }
      res.json({ updated: true });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
