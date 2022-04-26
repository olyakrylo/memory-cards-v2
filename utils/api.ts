import { Card, Topic, TopicExt, UpdatedResult, User } from "./types";

export type Paths = {
  users: UsersAPI;
  topics: TopicsAPI;
  cards: CardsAPI;
  files: FilesAPI;
  config: ConfigAPI;
};

export type UsersAPI = {
  "": {
    get: {
      params: {};
      result: { user?: User };
    };
    post: {
      params: {
        login: string;
        password: string;
      };
      result: {
        user?: User;
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
        email: string;
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
  recovery: {
    post: {
      params: { email: string };
      result: {
        no_user?: boolean;
        sent?: boolean;
      };
    };
  };
  recovery_user: {
    post: {
      params: { id: string };
      result: { user?: User };
    };
    put: {
      params: {
        id: string;
        password: string;
      };
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
  public_count: {
    get: {
      params: {};
      result: { count: number };
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
  by_user_count: {
    get: {
      params: {};
      result: TopicsCount;
    };
  };
  by_user: {
    get: {
      params: {};
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

export type FilesAPI = {
  upload: {
    post: {
      params: FormData;
      result: { filename: string };
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

export type TopicsCount = {
  self: number;
  public: number;
};
