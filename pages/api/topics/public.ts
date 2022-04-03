import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

import { connect } from "../../../utils/connection";
import { ResponseFuncs, Topic } from "../../../utils/types";
import { getCookie } from "../../../utils/cookies";
import { TopicsAPI } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const cookies = new Cookies(req, res);
  const secret = process.env.SECRET as string;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic, User, Card } = await connect();
      let topics = await Topic.find({ public: true });
      topics = await Promise.all(
        topics.map(async (topic) => {
          const author_name = (await User.findById(topic.author_id))?.login;
          const cards_count =
            (await Card.find({ topic_id: topic._id }))?.length ?? 0;
          return { ...topic._doc, author_name, cards_count };
        })
      );
      res.json(topics);
    },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      const userId = getCookie(cookies, "id_token", secret);
      const { topics_id } = req.body as TopicsAPI["public"]["put"]["params"];

      const updatedTopics = await Promise.all(
        topics_id.map(async (tid) => {
          const topic = (await Topic.findById(tid)) as Topic;
          const users = [...topic.users_id, userId];
          return Topic.findByIdAndUpdate(
            tid,
            { users_id: users },
            { new: true }
          );
        })
      );
      res.json(updatedTopics);
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
