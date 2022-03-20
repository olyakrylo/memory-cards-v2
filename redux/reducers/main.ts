import * as t from "../types";
import { AnyAction } from "redux";
import { State } from "../../utils/types";

const main = (
  state: State = {
    topics: [],
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
