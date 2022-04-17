import * as mongoose from "mongoose";

import { config } from "./config";

export const connect = async () => {
  const conn = await mongoose
    .connect(config.db_uri)
    .catch((err) => console.log(err));
  console.log("Mongoose Connection Established");

  const UserSchema = new mongoose.Schema({
    login: String,
    password: String,
    email: String,
  });

  const TopicSchema = new mongoose.Schema({
    users_id: Array,
    author_id: String,
    title: String,
    public: Boolean,
  });

  const CardSchema = new mongoose.Schema({
    topic_id: String,
    question: String,
    answer: String,
  });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
  const Card = mongoose.models.Card || mongoose.model("Card", CardSchema);

  return { conn, User, Topic, Card };
};
