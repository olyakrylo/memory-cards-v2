import * as t from "../types";
import { Topic, User } from "../../utils/types";

export const setUser = (user?: User) => (dispatch: Function) => {
  dispatch({
    type: t.SET_USER,
    payload: user,
  });
};

export const setCurrentTopic = (topic: Topic) => (dispatch: Function) => {
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

export const setDarkMode = (darkMode: boolean) => (dispatch: Function) => {
  dispatch({
    type: t.SET_DARK_MODE,
    payload: darkMode,
  });
};
