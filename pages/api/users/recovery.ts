import { NextApiRequest, NextApiResponse } from "next";
import Mail from "nodemailer/lib/mailer";

import { ResponseFuncs } from "../../../utils/types";
import { UsersAPI } from "../../../utils/api";
import { connect } from "../../../utils/connection";
import { transporter } from "../../../utils/transporter";
import { config } from "../../../utils/config";
import { encryptString } from "../../../utils/cookies";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const { secret } = config;

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { email } = req.body as UsersAPI["recovery"]["post"]["body"];

      const { User, Recovery } = await connect();
      const user = await User.findOne({ email });

      if (!user) {
        res.json({ no_user: true });
        return;
      }

      const recoveryData = await Recovery.findOne({ user_id: user._id });
      let count;
      if (recoveryData) {
        count = recoveryData.count;
      } else {
        await Recovery.create({ user_id: user._id, count: 1 });
        count = 1;
      }

      const data = encryptString(
        JSON.stringify({
          id: user._id.toString(),
          count,
        }),
        secret
      );

      const mailOptions: Mail.Options = {
        from: `Memory cards ${config.mail.address}`,
        to: email,
        subject: "Password recovery",
        html: `<h1>Hi, ${user.login}!</h1>
            <p>Follow this link:</p>
            <div>${req.headers.origin}/recovery?id=${data}</div>`,
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
