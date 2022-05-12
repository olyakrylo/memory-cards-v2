import { ActionType } from "../../shared/redux";
import { Card, Topic, User } from "../../shared/models";
import { AppNotification } from "../../shared/notification";

export const setUser = (user?: User | null) => (dispatch: Function) => {
  dispatch({
    type: ActionType.SET_USER,
    payload: { user },
  });
};

export const setCurrentTopic = (topic?: Topic) => (dispatch: Function) => {
  dispatch({
    type: ActionType.SET_CURRENT_TOPIC,
    payload: { topic },
  });
};

export const setTopics = (topics: Topic[]) => (dispatch: Function) => {
  dispatch({
    type: ActionType.SET_TOPICS,
    payload: { topics },
  });
};

export const setCards =
  (topicId: string, cards: Card[]) => (dispatch: Function) => {
    dispatch({
      type: ActionType.SET_CARDS,
      payload: { topicId, cards },
    });
  };

export const setShuffledCards =
  (topicId: string, cards?: Card[]) => (dispatch: Function) => {
    dispatch({
      type: ActionType.SET_SHUFFLED_CARDS,
      payload: { topicId, cards },
    });
  };

export const setCardsLoading = (loading: boolean) => (dispatch: Function) => {
  dispatch({
    type: ActionType.SET_CARDS_LOADING,
    payload: { loading },
  });
};

export const setHideArrows = (hide: boolean) => (dispatch: Function) => {
  dispatch({
    type: ActionType.SET_HIDE_ARROWS,
    payload: { hide },
  });
};

export const setDarkMode = (darkMode: boolean) => (dispatch: Function) => {
  dispatch({
    type: ActionType.SET_DARK_MODE,
    payload: { darkMode },
  });
};

export const toggleSwap = (topicId: string) => (dispatch: Function) => {
  dispatch({ type: ActionType.TOGGLE_SWAP, payload: { topicId } });
};

export const setNotification =
  (notification: AppNotification) => (dispatch: Function) => {
    dispatch({
      type: ActionType.SET_NOTIFICATION,
      payload: { notification },
    });
  };
