import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../shared/api";
import { setCookie } from "../../../utils/cookies";
import { UsersAPI } from "../../../shared/api";
import { transporter } from "../../../utils/transporter";
import { config } from "../../../utils/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { User } = await connect();
      let userData = req.body as UsersAPI["create"]["post"]["body"];
      userData = {
        ...userData,
        login: userData.login.toLowerCase(),
      };

      const existingUser = await User.findOne({ login: userData.login });
      if (existingUser) {
        res.json({ error: { user_exists: true } });
        return;
      }

      const user = await User.create(userData).catch(catcher);
      if (user) {
        setCookie(req, res, "id_token", user._id);
      }

      const mailOptions = {
        from: `Memory cards ${config.mail.address}`,
        to: userData.email,
        subject: `Welcome, ${userData.login}`,
        text: "Thanks for the registration",
      };

      transporter.sendMail(mailOptions, (err) => {
        console.log(err);
        res.json({
          user: user
            ? {
                _id: user._id,
                login: user.login,
                email: user.email,
                admin: user.admin,
              }
            : null,
        });
      });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
