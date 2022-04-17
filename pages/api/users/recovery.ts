import { NextApiRequest, NextApiResponse } from "next";
import Mail from "nodemailer/lib/mailer";

import { ResponseFuncs } from "../../../utils/types";
import { UsersAPI } from "../../../utils/api";
import { connect } from "../../../utils/connection";
import { transporter } from "../../../utils/transporter";
import { config } from "../../../utils/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { email } = req.body as UsersAPI["recovery"]["post"]["params"];

      const { User } = await connect();
      const user = await User.findOne({ email });

      if (!user) {
        res.json({ no_user: true });
        return;
      }

      const mailOptions: Mail.Options = {
        from: `Memory cards ${config.mail.address}`,
        to: email,
        subject: "Password recovery",
        html: `<h1>Hi, ${user.login}!</h1>
            <p>Your credentials:</p>
            <div><b>Login:</b> ${user.login}</div>
            <div><b>Password:</b> ${user.password}</div>`,
      };

      transporter.sendMail(mailOptions, (err) => {
        res.json({ sent: !err });
      });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
