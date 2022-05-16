import { useDispatch, useSelector } from "react-redux";

import { User } from "../../shared/models";
import { setUser } from "../../redux/actions/main";
import { AuthCredentials } from "../../shared/auth";
import { useApi, useNotification } from "../index";
import { UpdatedResult } from "../../shared/api";
import { State } from "../../shared/redux";

export const useUserImpl = () => {
  const dispatch = useDispatch();

  const notification = useNotification();
  const api = useApi();

  const user = useSelector((state: { main: State }) => state.main.user);
  const dispatchUser = (user?: User | null) => {
    dispatch(setUser(user));
  };

  const encryptPassword = async (password: string): Promise<string> => {
    const { encryptPassword: encrypt } = await import(
      "../../utils/encrypt-password"
    );
    return encrypt(password);
  };

  const loadUser = async (): Promise<void> => {
    const { user: userData } = await api.request("users", "", "get");
    dispatchUser(userData ?? null);
  };

  const logIn = async (data: AuthCredentials): Promise<void> => {
    const { user, error } = await api.request("users", "", "post", {
      body: {
        login: data.login,
        password: await encryptPassword(data.password),
      },
    });
    if (error?.no_user) {
      notification.setError("auth.error.user_not_found");
      return;
    }
    if (error?.wrong_password) {
      notification.setError("auth.error.wrong_password");
      return;
    }
    if (user) {
      dispatchUser(user);
    }
  };

  const signUp = async (data: AuthCredentials): Promise<void> => {
    const { user, error } = await api.request("users", "create", "post", {
      body: {
        ...data,
        password: await encryptPassword(data.password),
      },
    });
    if (error?.user_exists) {
      notification.setWarning("auth.error.user_exists");
      return;
    }
    if (user) {
      dispatchUser(user);
    }
  };

  const logout = async (): Promise<void> => {
    await api.request("users", "logout", "get");
    dispatchUser(null);
  };

  const sendRecoveryMessage = async (
    email: string
  ): Promise<{ sent?: boolean; no_user?: boolean }> => {
    const { sent, no_user } = await api.request("users", "recovery", "post", {
      body: {
        email,
      },
    });

    if (sent) {
      notification.setSuccess("auth.recovery.message_sent");
    } else {
      notification.setError("auth.recovery.sending_problem");
    }

    return { sent, no_user };
  };

  const getRecoveryUser = (id: string): Promise<{ user?: User }> => {
    return api.request("users", "recovery_user", "get", {
      query: { id },
    });
  };

  const updateRecoveryUser = async (
    user: User,
    password: string
  ): Promise<UpdatedResult> => {
    return api.request("users", "recovery_user", "put", {
      body: {
        id: user?._id,
        password: await encryptPassword(password),
      },
    });
  };

  const deleteMany = (ids: string[]): Promise<UpdatedResult> => {
    return api.request("admin", "users", "delete", { body: { ids } });
  };

  return {
    info: user,
    loadUser,
    logIn,
    signUp,
    logout,
    sendRecoveryMessage,
    getRecoveryUser,
    updateRecoveryUser,
    deleteMany,
  };
};
