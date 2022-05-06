import { Card, Topic, User } from "./models";
import { AppNotification } from "./notification";

export const SET_USER = "SET_USER";
export const SET_CURRENT_TOPIC = "SET_CURRENT_TOPIC";
export const SET_DARK_MODE = "SET_DARK_MODE";
export const SET_TOPICS = "SET_TOPICS";
export const SET_NOTIFICATION = "SET_NOTIFICATION";
export const SET_CARDS = "SET_CARDS";

export type State = {
  user?: User | null;
  currentTopic?: Topic;
  topics: Topic[];
  darkMode?: boolean;
  notification: AppNotification;
  cards: Record<string, Card[]>;
};
