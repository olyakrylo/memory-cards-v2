export interface User {
  _id: string;
  login: string;
  email: string;
  admin: boolean;
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

export type ShortCard = Omit<Card, "_id" | "topic_id">;
