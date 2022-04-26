import * as mongoose from "mongoose";

// @ts-ignore
import { createModel } from "mongoose-gridfs";

import { config } from "./config";

export const connect = async () => {
  const conn = await mongoose
    .connect(config.db_uri)
    .catch((err) => console.log(err));
  console.log("Mongoose Connection Established");

  const Attachment = createModel({
    modelName: "Attachment",
    connection: mongoose.connection,
  });

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
    question: {
      text: String,
      image: String,
    },
    answer: {
      text: String,
      image: String,
    },
  });

  const FileSchema = new mongoose.Schema({
    createdAt: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      required: [true, "Uploaded file must have a name"],
    },
  });

  const RecoverySchema = new mongoose.Schema({
    user_id: String,
    count: Number,
  });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
  const Card = mongoose.models.Card || mongoose.model("Card", CardSchema);
  const File = mongoose.models.File || mongoose.model("File", FileSchema);
  const Recovery =
    mongoose.models.Recovery || mongoose.model("Recovery", RecoverySchema);

  return { conn, Attachment, User, Topic, Card, File, Recovery };
};
