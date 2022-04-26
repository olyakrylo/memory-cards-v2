import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable, { File } from "formidable";

import { ResponseFuncs } from "../../../utils/types";
import { connect } from "../../../utils/connection";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        const file = files.file as File;

        const filename = file.newFilename;
        const path = `./public/uploads/${filename}`;

        const data = fs.readFileSync(file.filepath);
        fs.writeFileSync(path, data);
        await fs.unlinkSync(file.filepath);

        const { Attachment } = await connect();
        const readStream = fs.createReadStream(path);
        const options = { filename, contentType: file.mimetype };
        Attachment.write(options, readStream, () => {
          res.json({ filename });
          fs.rmSync(path);
        });
      });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
