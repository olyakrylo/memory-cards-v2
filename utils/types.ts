export type State = {
  user?: User;
  currentTopic?: Topic;
  colorMode: "light" | "dark";
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
}

export interface Card {
  _id: string;
  topic_id: string;
  question: string;
  answer: string;
}

export type UpdatedResult = { updated: boolean };
