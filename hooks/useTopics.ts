import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { State } from "../shared/redux";
import { request } from "../utils/request";
import { Topic, TopicExt } from "../shared/models";
import { setTopics } from "../redux/actions/main";
import { TopicsCount } from "../shared/api";

export const useTopicsImpl = () => {
  const router = useRouter();

  const [currentTopic, setCurrentTopic] = useState<Topic>();

  const { user, topics } = useSelector((state: { main: State }) => ({
    user: state.main.user,
    topics: state.main.topics,
  }));
  const dispatch = useDispatch();

  const dispatchTopics = (topics: Topic[]): void => {
    dispatch(setTopics(topics));
  };

  useEffect(() => {
    void updateCurrentTopic();
  }, [router.query.topic]);

  const currentId = (): string => {
    return (router.query.topic as string) ?? "";
  };

  const getById = (id: string): Promise<{ topic?: Topic }> => {
    return request("topics", "", "get", {
      query: { id },
    });
  };

  const updateCurrentTopic = async (): Promise<void> => {
    if (!currentId()) {
      setCurrentTopic(undefined);
      return;
    }

    const fromTopics = topics.find((t) => t._id === currentId());
    if (fromTopics) {
      setCurrentTopic(fromTopics);
      return;
    }

    getById(currentId()).then(({ topic }) => {
      if (!topic) return;
      setCurrentTopic(topic);
    });
  };

  const getCount = (): Promise<TopicsCount> => {
    return request("topics", "by_user_count", "get");
  };

  const getList = (): Promise<Topic[]> => {
    return request("topics", "by_user", "get");
  };

  const getPublicCount = (): Promise<{ count: number }> => {
    return request("topics", "public_count", "get");
  };

  const getPublicList = (): Promise<TopicExt[]> => {
    return request("topics", "public", "get");
  };

  const getByAuthorCount = (authorId: string): Promise<{ count: number }> => {
    return request("topics", "by_author_count", "get", {
      query: { id: authorId },
    });
  };

  const getByAuthorList = (authorId: string): Promise<{ topics: Topic[] }> => {
    return request("topics", "by_author", "get", {
      query: { id: authorId },
    });
  };

  const addTopic = async (
    title: string,
    isPublic: boolean
  ): Promise<{ newTopic?: Topic }> => {
    if (!user) return {};

    const newTopic = await request("topics", "", "put", {
      body: {
        users_id: [user._id],
        author_id: user._id,
        title,
        public: isPublic,
      },
    });

    if (newTopic) {
      dispatchTopics([...topics, newTopic]);
      return { newTopic };
    }

    return {};
  };

  const updateTopic = async (
    topic: Topic,
    title: string,
    isPublic: boolean
  ): Promise<void> => {
    const updatedTopic = await request("topics", "", "patch", {
      body: {
        _id: topic._id,
        title,
        public: isPublic,
      },
    });

    const updatedTopicsList = topics.map((item) => {
      if (item._id !== topic._id) return item;
      return updatedTopic;
    });
    dispatchTopics(updatedTopicsList);
  };

  const deleteTopic = async (
    id: string
  ): Promise<{ updatedTopics?: Topic[] }> => {
    if (!user) return {};

    const { updated } = await request("topics", "", "delete", {
      body: {
        user_id: user._id,
        topic_id: id,
      },
    });

    if (updated) {
      const newTopics = topics.filter((t) => t._id !== id);
      dispatchTopics(newTopics);
      return { updatedTopics: newTopics };
    }

    return {};
  };

  const copyTopic = async (topic: Topic): Promise<{ newId: string }> => {
    const { topics, new_id } = await request("topics", "copy", "put", {
      query: { id: topic._id },
      body: { title: topic.title },
    });
    dispatchTopics(topics);
    return { newId: new_id };
  };

  const updatePublicTopics = async (ids: string[]): Promise<void> => {
    const updatedTopics = await request("topics", "public", "put", {
      body: {
        topics_id: ids,
      },
    });
    dispatchTopics([...topics, ...updatedTopics]);
  };

  const list = (): Topic[] => {
    return topics;
  };

  const set = (topics: Topic[]): void => {
    dispatchTopics(topics);
  };

  const clear = (): void => {
    dispatchTopics([]);
  };

  return {
    list,
    set,
    clear,
    currentId,
    updateCurrentTopic,
    currentTopic,
    getById,
    getCount,
    getList,
    addTopic,
    updateTopic,
    deleteTopic,
    copyTopic,
    getPublicCount,
    getPublicList,
    getByAuthorCount,
    getByAuthorList,
    updatePublicTopics,
  };
};

export const useTopicsInitialState = {
  list: () => [] as Topic[],
  set: (t: Topic[]) => {},
  clear: () => {},
  currentId: () => "",
  updateCurrentTopic: () => Promise.resolve(),
  currentTopic: undefined as Topic | undefined,
  getById: (id: string) => Promise.resolve({}),
  getCount: () => Promise.resolve({ self: 0, public: 0 }),
  getList: () => Promise.resolve([] as Topic[]),
  addTopic: (t: string, p: boolean) =>
    Promise.resolve({} as { newTopic?: Topic }),
  updateTopic: (topic: Topic, t: string, p: boolean) => Promise.resolve(),
  deleteTopic: (id: string) =>
    Promise.resolve({} as { updatedTopics?: Topic[] }),
  copyTopic: (t: Topic) => Promise.resolve({ newId: "" }),
  getPublicCount: () => Promise.resolve({ count: 0 }),
  getPublicList: () => Promise.resolve([] as TopicExt[]),
  getByAuthorCount: (id: string) => Promise.resolve({ count: 0 }),
  getByAuthorList: (id: string) => Promise.resolve({ topics: [] as Topic[] }),
  updatePublicTopics: (ids: string[]) => Promise.resolve(),
};
