import { singletonHook } from "react-singleton-hook";

import { useApiImpl } from "./api";
import { useConfigImpl } from "./config";
import { useUserImpl } from "./user";
import { useNotificationImpl } from "./notification";
import { useFilesImpl } from "./files";

import { useTopicsImpl } from "./topics";
import { useTopicsServiceImpl } from "./topics/service";
import { useCardsImpl } from "./cards";
import {
  useCardsServiceImpl,
  useCardsServiceInitialState,
} from "./cards/service";
import { useUserServiceImpl } from "./user/service";

export const useUser = useUserImpl;
export const useUserService = singletonHook({}, useUserServiceImpl);

export const useTopics = useTopicsImpl;
export const useTopicsService = singletonHook({}, useTopicsServiceImpl);

export const useCards = useCardsImpl;
export const useCardsService = singletonHook(
  useCardsServiceInitialState,
  useCardsServiceImpl
);

export const useApi = useApiImpl;
export const useConfig = useConfigImpl;
export const useNotification = useNotificationImpl;
export const useFiles = useFilesImpl;
