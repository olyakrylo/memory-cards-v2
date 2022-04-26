import { AlertColor } from "@mui/material";
import { string } from "prop-types";

export type AppNotification = {
  severity: AlertColor;
  text: string;
  translate?: boolean;
  autoHide?: number;
};

export type State = {
  user?: User | null;
  currentTopic?: Topic;
  topics: Topic[];
  darkMode?: boolean;
  notification: AppNotification;
};

export interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
  PATCH?: Function;
}

export type AuthMode = "signIn" | "signUp";

export type AuthCredentials = {
  login: string;
  password: string;
  email: string;
};

export interface User {
  _id: string;
  login: string;
  email: string;
}

export interface Topic {
  _id: string;
  title: string;
  users_id: string[];
  author_id: string;
  public?: boolean;
}

export type CardField = "question" | "answer";

export interface CardFieldContent {
  text: string;
  image?: string;
}

export type Card = Record<CardField, CardFieldContent> & {
  _id: string;
  topic_id: string;
};

export type TopicExt = Topic & {
  author_name: string;
  cards_count: number;
};

export type UpdatedResult = { updated: boolean };

export type ShortCard = Omit<Card, "_id" | "topic_id">;
