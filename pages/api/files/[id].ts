import { NextApiRequest, NextApiResponse } from "next";
import { ResponseFuncs } from "../../../utils/types";
import { connect } from "../../../utils/connection";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { id: filename } = req.query as { id: string };

      const { Attachment } = await connect();

      const stream = Attachment.read({ filename });
      // stream.on("data", (data: any) => {
      //   images[filename] = data;
      //   res.write(data);
      // });
      stream.on("close", (data: any) => {
        res.end(data);
      });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
