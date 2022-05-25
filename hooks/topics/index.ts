import { useDispatch, useSelector } from "react-redux";

import { State } from "../../shared/redux";
import { Topic, TopicExt, User } from "../../shared/models";
import {
  setCurrentTopic,
  setTopics,
  toggleSwap,
} from "../../redux/actions/main";
import { TopicsCount, UpdatedResult } from "../../shared/api";
import { useApi } from "../index";

export const useTopicsImpl = () => {
  const api = useApi();

  const { user, topics, currentTopic, swap } = useSelector(
    (state: { main: State }) => ({
      user: state.main.user,
      topics: state.main.topics,
      currentTopic: state.main.currentTopic,
      swap: state.main.swap,
    })
  );
  const dispatch = useDispatch();

  const dispatchTopics = (topics: Topic[]): void => {
    dispatch(setTopics(topics));
  };

  const dispatchCurrentTopic = (topic?: Topic): void => {
    dispatch(setCurrentTopic(topic));
  };

  const dispatchSwap = (topicId: string): void => {
    dispatch(toggleSwap(topicId));
  };

  const getById = (id: string): Promise<{ topic?: Topic }> => {
    return api.request("topics", "", "get", {
      query: { id },
    });
  };

  const updateCurrentTopic = async (id?: string): Promise<void> => {
    if (!id) {
      dispatchCurrentTopic(undefined);
      return;
    }

    const fromTopics = topics.find((t) => t._id === id);
    if (fromTopics) {
      dispatchCurrentTopic(fromTopics);
      return;
    }

    getById(id).then(({ topic }) => {
      if (!topic) return;
      dispatchCurrentTopic(topic);
    });
  };

  const getCount = (): Promise<TopicsCount> => {
    return api.request("topics", "by_user_count", "get");
  };

  const getList = (): Promise<Topic[]> => {
    return api.request("topics", "by_user", "get");
  };

  const getPublicCount = (): Promise<{ count: number }> => {
    return api.request("topics", "public_count", "get");
  };

  const getPublicList = (): Promise<TopicExt[]> => {
    return api.request("topics", "public", "get");
  };

  const getByAuthorCount = (authorId: string): Promise<{ count: number }> => {
    return api.request("topics", "by_author_count", "get", {
      query: { id: authorId },
    });
  };

  const getByAuthorList = (authorId: string): Promise<{ topics: Topic[] }> => {
    return api.request("topics", "by_author", "get", {
      query: { id: authorId },
    });
  };

  const addTopic = async (
    title: string,
    isPublic: boolean
  ): Promise<{ newTopic?: Topic }> => {
    if (!user) return {};

    const newTopic = await api.request("topics", "", "put", {
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
    const updatedTopic = await api.request("topics", "", "patch", {
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

    const { updated } = await api.request("topics", "", "delete", {
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
    const { topics, new_id } = await api.request("topics", "copy", "put", {
      query: { id: topic._id },
      body: { title: topic.title },
    });
    dispatchTopics(topics);
    return { newId: new_id };
  };

  const updatePublicTopics = async (ids: string[]): Promise<void> => {
    const updatedTopics = await api.request("topics", "public", "put", {
      body: {
        topics_id: ids,
      },
    });
    dispatchTopics([...topics, ...updatedTopics]);
  };

  const deleteMany = (ids: string[]): Promise<UpdatedResult> => {
    return api.request("admin", "topics", "delete", { body: { ids } });
  };

  const toggleCardsSwap = (topicId?: string) => {
    const id = topicId ?? currentTopic?._id;
    if (!id) return;
    dispatchSwap(id);
  };

  const getFollowingUsersById = (topicId: string): Promise<User[]> => {
    return api.request("topics", "following_users", "get", {
      query: { id: topicId },
    });
  };

  const deleteUnused = (): Promise<UpdatedResult> => {
    return api.request("admin", "delete_unused_topics", "delete");
  };

  const isSwapped = (topicId?: string) => {
    const id = topicId ?? currentTopic?._id;
    if (!id) return;
    return swap[id];
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
    currentTopic,
    currentId: currentTopic?._id ?? "",
    list,
    set,
    clear,
    updateCurrentTopic,
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
    deleteMany,
    toggleCardsSwap,
    isSwapped,
    getFollowingUsersById,
    deleteUnused,
  };
};
