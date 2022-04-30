import { Card, Topic, TopicExt, UpdatedResult, User } from "./types";

export type Paths = {
  users: UsersAPI;
  topics: TopicsAPI;
  cards: CardsAPI;
  files: FilesAPI;
  config: ConfigAPI;
};

export type Method = "get" | "post" | "put" | "patch" | "delete";

// export interface API {
//   [key: string]: {
//     [key in Method]?: {
//       query?: Record<string, any>;
//       body?: Record<string, any>;
//       result: any;
//     };
//   };
// }

export interface UsersAPI {
  "": {
    get: {
      query: {};
      body: {};
      result: { user?: User };
    };
    post: {
      query: {};
      body: {
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
      query: {};
      body: {
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
      query: {};
      body: { email: string };
      result: {
        no_user?: boolean;
        sent?: boolean;
      };
    };
  };
  recovery_user: {
    get: {
      query: { id: string };
      body: {};
      result: { user?: User };
    };
    put: {
      query: {};
      body: {
        id: string;
        password: string;
      };
      result: UpdatedResult;
    };
  };
}

export interface TopicsAPI {
  "": {
    get: {
      query: { id: string };
      body: {};
      result: { topic?: Topic };
    };
    put: {
      query: {};
      body: Omit<Topic, "_id">;
      result: Topic;
    };
    patch: {
      query: {};
      body: Topic;
      result: Topic;
    };
    delete: {
      query: {};
      body: { user_id: string; topic_id: string };
      result: UpdatedResult;
    };
  };
  public_count: {
    get: {
      query: {};
      body: {};
      result: { count: number };
    };
  };
  public: {
    get: {
      query: {};
      body: {};
      result: TopicExt[];
    };
    put: {
      query: {};
      body: { topics_id: string[] };
      result: Topic[];
    };
  };
  by_user_count: {
    get: {
      query: {};
      body: {};
      result: TopicsCount;
    };
  };
  by_user: {
    get: {
      query: {};
      body: {};
      result: Topic[];
    };
  };
}

export interface CardsAPI {
  "": {
    get: {
      result: Card;
    };
    put: {
      query: {};
      body: { cards: Omit<Card, "_id">[] };
      result: Card[];
    };
    patch: {
      query: {};
      body: Card;
      result: Card;
    };
    delete: {
      query: { id: string };
      body: {};
      result: Card;
    };
  };
  by_topic: {
    get: {
      query: { topic_id: string };
      body: {};
      result: Card[];
    };
  };
}

export interface FilesAPI {
  upload: {
    post: {
      query: {};
      body: FormData;
      result: { filename: string };
    };
  };
}

export interface ConfigAPI {
  color: {
    get: {
      query: {};
      body: {};
      result: { dark: boolean };
    };
    put: {
      query: {};
      body: { dark: boolean };
      result: UpdatedResult;
    };
  };
  arrows: {
    get: {
      query: {};
      body: {};
      result: { hide: boolean };
    };
    put: {
      query: {};
      body: { hide: boolean };
      result: UpdatedResult;
    };
  };
}

export type TopicsCount = {
  self: number;
  public: number;
};
