import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { decryptString, getCookie, setCookie } from "../../../utils/cookies";
import { UsersAPI } from "../../../utils/api";
import { config } from "../../../utils/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const { secret } = config;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const id = getCookie(req, res, "id_token");
      if (!id) {
        res.json({ user: null });
        return;
      }
      const { User } = await connect();
      const user = await User.findById(id);

      res.json({
        user: user
          ? { _id: user._id, login: user.login, email: user.email }
          : null,
      });
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { User } = await connect();
      const { login, password } = req.body as UsersAPI[""]["post"]["body"];
      const user = await User.findOne({
        $or: [{ login: login.toLowerCase() }, { email: login }],
      });
      if (!user) {
        res.json({ error: { no_user: true } });
        return;
      }

      const checked =
        decryptString(user.password, secret) ===
        decryptString(password, secret);

      if (checked) {
        setCookie(req, res, "id_token", user._id);
        res.json({
          user: user
            ? { _id: user._id, login: user.login, email: user.email }
            : null,
        });
        return;
      } else {
        res.json({ error: { wrong_password: true } });
      }
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
