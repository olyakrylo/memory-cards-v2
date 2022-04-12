import { Card, Topic, TopicExt, UpdatedResult, User } from "./types";

export type Paths = {
  users: UsersAPI;
  topics: TopicsAPI;
  cards: CardsAPI;
  config: ConfigAPI;
};

export type UsersAPI = {
  "": {
    get: {
      result: { user?: User };
    };
    post: {
      params: {
        login: string;
        password: string;
      };
      result: {
        user?: string;
        error?: {
          no_user?: boolean;
          wrong_password?: boolean;
        };
      };
    };
  };
  create: {
    post: {
      params: {
        login: string;
        password: string;
      };
      result: {
        user?: User;
        error?: {
          user_exists?: boolean;
        };
      };
    };
  };
  logout: {
    get: {
      result: UpdatedResult;
    };
  };
};

export type TopicsAPI = {
  "": {
    get: {
      result: Topic[];
    };
    post: {
      params: { id: string };
      result: { topic?: Topic };
    };
    put: {
      params: Omit<Topic, "_id">;
      result: Topic;
    };
    patch: {
      params: Topic;
      result: Topic;
    };
    delete: {
      params: { user_id: string; topic_id: string };
      result: UpdatedResult;
    };
  };
  public: {
    get: {
      params: {};
      result: TopicExt[];
    };
    put: {
      params: { topics_id: string[] };
      result: Topic[];
    };
  };
  by_user: {
    post: {
      params: { user_id: string };
      result: Topic[];
    };
  };
};

export type CardsAPI = {
  "": {
    get: {
      result: Card;
    };
    post: {
      params: { cards: Omit<Card, "_id">[] };
      result: Card[];
    };
    put: {
      params: Card;
      result: Card;
    };
    delete: {
      params: { id: string };
      result: Card;
    };
  };
  by_topic: {
    post: {
      params: { topic_id: string };
      result: Card[];
    };
  };
};

export type ConfigAPI = {
  color: {
    get: {
      params: {};
      result: { dark: boolean };
    };
    put: {
      params: { dark: boolean };
      result: UpdatedResult;
    };
  };
  arrows: {
    get: {
      params: {};
      result: { hide: boolean };
    };
    put: {
      params: { hide: boolean };
      result: UpdatedResult;
    };
  };
};
