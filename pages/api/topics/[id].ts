import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs, Topic } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const { id } = req.query;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      res.json(await Topic.findById(id).catch(catcher));
    },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      res.json(await Topic.findByIdAndUpdate(id, req.body, { new: true }));
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      const topic = (await Topic.findById(id)) as Topic;
      const { user_id } = req.body;
      const users_id = topic.users_id.filter((u) => u !== user_id);
      const result = (await Topic.findByIdAndUpdate(
        id,
        { users_id },
        { new: true }
      )) as Topic;
      res.json({ updated: !result.users_id.includes(user_id) });
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
