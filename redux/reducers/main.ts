import * as t from "../../shared/redux";
import { AnyAction } from "redux";
import { State } from "../../shared/redux";

const main = (
  state: State = {
    topics: [],
    cards: {},
    notification: { severity: "success", text: "" },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case t.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case t.SET_CURRENT_TOPIC:
      return {
        ...state,
        currentTopic: action.payload,
      };

    case t.SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      };

    case t.SET_TOPICS:
      return {
        ...state,
        topics: action.payload,
      };

    case t.SET_CARDS:
      return {
        ...state,
        cards: {
          ...state.cards,
          [action.payload.topicId]: action.payload.cards,
        },
      };

    case t.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };

    default:
      return { ...state };
  }
};

export default main;
