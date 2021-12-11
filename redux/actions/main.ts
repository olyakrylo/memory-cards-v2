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
    type: t.SET_TOPIC,
    payload: topic,
  });
};

export const setColorMode =
  (mode: "light" | "dark") => (dispatch: Function) => {
    dispatch({
      type: t.SET_COLOR_MODE,
      payload: mode,
    });
  };
