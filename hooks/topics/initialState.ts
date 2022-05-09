import { Topic, TopicExt } from "../../shared/models";

export const useTopicsInitialState = {
  list: () => [] as Topic[],
  set: (_: Topic[]) => {},
  clear: () => {},
  currentId: "",
  updateCurrentTopic: () => Promise.resolve(),
  currentTopic: undefined as Topic | undefined,
  getById: (_: string) => Promise.resolve({}),
  getCount: () => Promise.resolve({ self: 0, public: 0 }),
  getList: () => Promise.resolve([] as Topic[]),
  addTopic: (_: string, __: boolean) =>
    Promise.resolve({} as { newTopic?: Topic }),
  updateTopic: (_: Topic, __: string, ___: boolean) => Promise.resolve(),
  deleteTopic: (_: string) =>
    Promise.resolve({} as { updatedTopics?: Topic[] }),
  copyTopic: (_: Topic) => Promise.resolve({ newId: "" }),
  getPublicCount: () => Promise.resolve({ count: 0 }),
  getPublicList: () => Promise.resolve([] as TopicExt[]),
  getByAuthorCount: (_: string) => Promise.resolve({ count: 0 }),
  getByAuthorList: (_: string) => Promise.resolve({ topics: [] as Topic[] }),
  updatePublicTopics: (_: string[]) => Promise.resolve(),
};
