import { singletonHook } from "react-singleton-hook";

import { useApiImpl } from "./api/useApi";
import { useConfigImpl } from "./config/useConfig";
import { useUserImpl } from "./user/useUser";
import { useNotificationImpl } from "./notification/notification";
import { useFilesImpl } from "./files/useFiles";

import { useTopicsImpl } from "./topics/useTopics";
import { useTopicsInitialState } from "./topics/initialState";
import { useCardsImpl } from "./cards/useCards";
import { useCardsInitialState } from "./cards/initialState";

export const useApi = useApiImpl;
export const useConfig = useConfigImpl;
export const useUser = useUserImpl;
export const useNotification = useNotificationImpl;
export const useFiles = useFilesImpl;

export const useTopics = singletonHook(useTopicsInitialState, useTopicsImpl);
export const useCards = singletonHook(useCardsInitialState, useCardsImpl);
