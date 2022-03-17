export type State = {
  user?: User;
  currentTopic?: Topic;
  topics: Topic[];
  darkMode?: boolean;
};

export interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
}

export interface User {
  _id: string;
  login: string;
  password: string;
}

export interface Topic {
  _id: string;
  title: string;
  users_id: string[];
  author_id: string;
  public?: boolean;
}

export interface Card {
  _id: string;
  topic_id: string;
  question: string;
  answer: string;
}

export type TopicExt = Topic & {
  author_name: string;
  cards_count: number;
};

export type UpdatedResult = { updated: boolean };
