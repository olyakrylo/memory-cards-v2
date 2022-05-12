import { Card, Topic, User } from "./models";
import { AppNotification } from "./notification";

export enum ActionType {
  SET_USER = "SET_USER",
  SET_CURRENT_TOPIC = "SET_CURRENT_TOPIC",
  SET_DARK_MODE = "SET_DARK_MODE",
  SET_TOPICS = "SET_TOPICS",
  SET_NOTIFICATION = "SET_NOTIFICATION",
  SET_CARDS = "SET_CARDS",
  SET_SHUFFLED_CARDS = "SET_SHUFFLED_CARDS",
  SET_CARDS_LOADING = "SET_CARDS_LOADING",
  SET_HIDE_ARROWS = "SET_HIDE_ARROWS",
  TOGGLE_SWAP = "TOGGLE_SWAP",
}

export type State = {
  user?: User | null;
  currentTopic?: Topic;
  topics: Topic[];
  darkMode?: boolean;
  notification: AppNotification;
  cards: Record<string, Card[]>;
  shuffledCards: Record<string, Card[] | undefined>;
  cardsLoading: boolean;
  hideArrows: boolean;
  swap: Record<string, boolean>;
};
