import { createTransport } from "nodemailer";

import { config } from "./config";

export const transporter = createTransport({
  service: config.mail.service,
  auth: {
    user: config.mail.address,
    pass: config.mail.password,
  },
});
