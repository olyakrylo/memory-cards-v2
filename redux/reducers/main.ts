import { ActionType } from "../../shared/redux";
import { AnyAction } from "redux";
import { State } from "../../shared/redux";

const main = (
  state: State = {
    topics: [],
    cards: {},
    shuffledCards: {},
    cardsLoading: false,
    hideArrows: false,
    swap: {},
    notification: { severity: "success", text: "" },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case ActionType.SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };

    case ActionType.SET_CURRENT_TOPIC:
      return {
        ...state,
        currentTopic: action.payload.topic,
      };

    case ActionType.SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload.darkMode,
      };

    case ActionType.SET_TOPICS:
      return {
        ...state,
        topics: action.payload.topics,
      };

    case ActionType.SET_CARDS:
      return {
        ...state,
        cards: {
          ...state.cards,
          [action.payload.topicId]: action.payload.cards,
        },
      };

    case ActionType.SET_SHUFFLED_CARDS:
      return {
        ...state,
        shuffledCards: {
          ...state.shuffledCards,
          [action.payload.topicId]: action.payload.cards,
        },
      };

    case ActionType.SET_CARDS_LOADING:
      return {
        ...state,
        cardsLoading: action.payload.loading,
      };

    case ActionType.SET_HIDE_ARROWS:
      return {
        ...state,
        hideArrows: action.payload.hide,
      };

    case ActionType.TOGGLE_SWAP:
      const { topicId } = action.payload;
      return {
        ...state,
        swap: {
          ...state.swap,
          [topicId]: !state.swap[topicId],
        },
      };

    case ActionType.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload.notification,
      };

    default:
      return { ...state };
  }
};

export default main;
