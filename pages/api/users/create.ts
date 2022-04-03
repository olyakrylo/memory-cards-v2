import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import Cookies from "cookies";
import { setCookie } from "../../../utils/cookies";
import { UsersAPI } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const cookies = new Cookies(req, res);
  const secret = process.env.SECRET as string;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { User } = await connect();
      const userData = req.body as UsersAPI["create"]["post"]["params"];

      const existingUser = await User.findOne({ login: userData.login });
      if (existingUser) {
        res.json({ error: { user_exists: true } });
        return;
      }

      const user = await User.create(userData).catch(catcher);
      if (user) {
        setCookie(cookies, "id_token", secret, user._id);
      }
      res.json({ user });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
