import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { getCookie, setCookie } from "../../../utils/cookies";
import { dataExample } from "../../../data.example";
import { UsersAPI } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const cookies = new Cookies(req, res);
  const { SECRET, NO_CONNECTION } = process.env;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      if (NO_CONNECTION) {
        res.json({ user: dataExample.user });
        return;
      }
      const id = getCookie(cookies, "id_token", SECRET as string);
      if (!id) {
        res.json({ user: null });
        return;
      }
      const { User } = await connect();
      const user = await User.findById(id);
      res.json({ user });
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { User } = await connect();
      const { login, password } = req.body as UsersAPI[""]["post"]["params"];
      const user = await User.findOne({ login });
      if (!user) {
        res.json({ error: { no_user: true } });
        return;
      }

      const checked = user.password === password;
      if (checked) {
        setCookie(cookies, "id_token", SECRET as string, user._id);
        res.json({ user });
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
