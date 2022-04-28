import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable, { File } from "formidable";

import { RedisRequest, ResponseFuncs } from "../../../utils/types";
import RedisClient from "../../../utils/redis";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    POST: async (req: RedisRequest, res: NextApiResponse) => {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        const file = files.file as File;
        const filename = file.newFilename;
        const data = fs.readFileSync(file.filepath);

        const { uploaded } = await RedisClient.uploadImage(filename, data);
        res.json(uploaded ? { filename } : {});
      });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
