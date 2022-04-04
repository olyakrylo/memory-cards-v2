import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { ResponseFuncs } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const cookies = new Cookies(req, res);

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const hide = cookies.get("hide_arrows") === "true";
      res.json({ hide });
    },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      cookies.set("hide_arrows", req.body.hide.toString());
      res.json({ updated: true });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
