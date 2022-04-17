import { Card, Topic, User } from "./utils/types";

export const dataExample: { user: User; topics: Topic[]; cards: Card[] } = {
  user: { _id: "test_user", login: "test user", email: "name@example.com" },
  topics: [
    {
      _id: "test_topic_1",
      title: "test topic 1",
      users_id: ["test_user"],
      author_id: "test_user",
    },
    {
      _id: "test_topic_2",
      title: "test topic 2",
      users_id: ["test_user"],
      author_id: "test_user",
    },
    {
      _id: "test_topic_3",
      title: "test topic 3",
      users_id: ["test_user"],
      author_id: "test_user",
    },
  ],
  cards: [
    {
      _id: "test_card_1",
      question: "q_1_1?",
      answer: "a_1_1",
      topic_id: "test_topic_1",
    },
    {
      _id: "test_card_2",
      question: "q_1_2?",
      answer: "a_1_2",
      topic_id: "test_topic_1",
    },
    {
      _id: "test_card_3",
      question: "q_1_3?",
      answer: "a_1_3",
      topic_id: "test_topic_1",
    },
  ],
};
