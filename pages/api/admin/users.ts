import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { AdminAPI, ResponseFuncs } from "../../../shared/api";
import { checkAccessToData } from "../../../utils/check-access-to-data";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const hasAccess = await checkAccessToData(req, res);
  if (!hasAccess) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const { User } = await connect();

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const skip = parseInt(req.query.skip as string, 10) || 0;
      const limit = parseInt(req.query.limit as string, 10) || 0;

      const [count, users] = await Promise.all([
        User.count({}),
        User.find({}).skip(skip).limit(limit),
      ]);

      res.json({
        count,
        data: users.map((u) => ({
          _id: u._id,
          login: u.login,
          email: u.email,
        })),
      });
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { ids } = req.body as AdminAPI["users"]["delete"]["body"];
      await User.deleteMany({ _id: { $in: ids } });
      res.json({ updated: true });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
