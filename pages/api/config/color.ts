import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { ResponseFuncs } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const cookies = new Cookies(req, res);

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const dark = cookies.get("dark") === "true";
      res.json({ dark });
    },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      cookies.set("dark", req.body.dark.toString());
      res.json({ updated: true });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
