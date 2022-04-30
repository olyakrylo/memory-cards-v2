import { NextApiRequest, NextApiResponse } from "next";

import { ResponseFuncs } from "../../../utils/types";
import { UsersAPI } from "../../../utils/api";
import { connect } from "../../../utils/connection";
import { config } from "../../../utils/config";
import { decryptString } from "../../../utils/cookies";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const { secret } = config;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.query as UsersAPI["recovery_user"]["get"]["query"];

      const decryptedId = decryptString(id, secret);
      const { id: userId, count } = JSON.parse(decryptedId);
      if (!userId || !count) {
        res.json({});
        return;
      }

      const { User, Recovery } = await connect();

      const recovery = await Recovery.findOne({ user_id: userId, count });
      if (!recovery) {
        res.json({});
        return;
      }

      const user = await User.findById(userId);

      res.json({
        user: user
          ? { _id: user._id, login: user.login, email: user.email }
          : null,
      });
    },
    // POST: async (req: NextApiRequest, res: NextApiResponse) => {
    //   const { id } = req.body as UsersAPI["recovery_user"]["post"]["body"];
    //
    //   const decryptedId = decryptString(id, secret);
    //   const { id: userId, count } = JSON.parse(decryptedId);
    //   if (!userId || !count) {
    //     res.json({});
    //     return;
    //   }
    //
    //   const { User, Recovery } = await connect();
    //
    //   const recovery = await Recovery.findOne({ user_id: userId, count });
    //   if (!recovery) {
    //     res.json({});
    //     return;
    //   }
    //
    //   const user = await User.findById(userId);
    //
    //   res.json({
    //     user: user
    //       ? { _id: user._id, login: user.login, email: user.email }
    //       : null,
    //   });
    //   return;
    // },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { id, password } =
        req.body as UsersAPI["recovery_user"]["put"]["body"];

      const { User, Recovery } = await connect();

      const recovery = await Recovery.findOne({ user_id: id });
      const [updatedUser, updatedRecovery] = await Promise.all([
        await User.findByIdAndUpdate(
          recovery.user_id,
          {
            password,
          },
          { new: true }
        ),
        await Recovery.findByIdAndUpdate(
          recovery._id,
          {
            count: recovery.count + 1,
          },
          { new: true }
        ),
      ]);

      res.json({
        updated:
          updatedUser.password === password &&
          updatedRecovery.count === recovery.count + 1,
      });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
