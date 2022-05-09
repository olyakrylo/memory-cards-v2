import { singletonHook } from "react-singleton-hook";

import { useTopicsImpl, useTopicsInitialState } from "./useTopics";
import { useCardsImpl, useCardsInitialState } from "./useCards";

export const useTopics = singletonHook(useTopicsInitialState, useTopicsImpl);
export const useCards = singletonHook(useCardsInitialState, useCardsImpl);
