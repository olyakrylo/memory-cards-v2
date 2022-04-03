import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs, Topic } from "../../../utils/types";
import { TopicsAPI } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    // get all
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      res.json(await Topic.find({}).catch(catcher));
    },
    // get by id
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      const { id } = req.body as TopicsAPI[""]["post"]["params"];
      res.json({ topic: await Topic.findById(id).catch(catcher) });
    },
    // create
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      const topicData = req.body as TopicsAPI[""]["put"]["params"];
      res.json(await Topic.create(topicData).catch(catcher));
    },
    // update
    PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      const topic = req.body as TopicsAPI[""]["patch"]["params"];
      res.json(await Topic.findByIdAndUpdate(topic._id, topic, { new: true }));
    },
    // delete
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      const { user_id, topic_id } =
        req.body as TopicsAPI[""]["delete"]["params"];

      const topic = (await Topic.findById(topic_id)) as Topic;
      const users_id = topic.users_id.filter((u) => u !== user_id);
      const result = (await Topic.findByIdAndUpdate(
        topic_id,
        { users_id },
        { new: true }
      )) as Topic;
      res.json({ updated: !result.users_id.includes(user_id) });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
