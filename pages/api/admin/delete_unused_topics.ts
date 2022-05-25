import { NextApiRequest, NextApiResponse } from "next";

import { ResponseFuncs } from "../../../shared/api";
import { checkAccessToData } from "../../../utils/check-access-to-data";
import { connect } from "../../../utils/connection";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const hasAccess = await checkAccessToData(req, res);
  if (!hasAccess) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const handleCase: ResponseFuncs = {
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      await Topic.deleteMany({ users_id: { $size: 0 } });
      res.json({ updated: true });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
