import * as t from "../../shared/redux";
import { Card, Topic, User } from "../../shared/models";
import { AppNotification } from "../../shared/notification";

export const setUser = (user?: User | null) => (dispatch: Function) => {
  dispatch({
    type: t.SET_USER,
    payload: user,
  });
};

export const setCurrentTopic = (topic?: Topic) => (dispatch: Function) => {
  dispatch({
    type: t.SET_CURRENT_TOPIC,
    payload: topic,
  });
};

export const setTopics = (topics: Topic[]) => (dispatch: Function) => {
  dispatch({
    type: t.SET_TOPICS,
    payload: topics,
  });
};

export const setCards =
  (topicId: string, cards: Card[]) => (dispatch: Function) => {
    dispatch({
      type: t.SET_CARDS,
      payload: { topicId, cards },
    });
  };

export const setDarkMode = (darkMode: boolean) => (dispatch: Function) => {
  dispatch({
    type: t.SET_DARK_MODE,
    payload: darkMode,
  });
};

export const setNotification =
  (notification: AppNotification) => (dispatch: Function) => {
    dispatch({
      type: t.SET_NOTIFICATION,
      payload: notification,
    });
  };
