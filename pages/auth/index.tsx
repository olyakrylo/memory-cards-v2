import { connect } from "react-redux";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AlertColor } from "@mui/material";

import { setNotification, setUser } from "../../redux/actions/main";
import { request } from "../../utils/request";
import styles from "./Auth.module.css";
import { User } from "../../shared/models";
import { AppNotification } from "../../shared/notification";
import { AuthCredentials, AuthMode } from "../../shared/auth";

const AuthSide = dynamic(() => import("../../components/authSide"));
const CardFlip = dynamic(() => import("react-card-flip"));

type AuthProps = {
  setUser: (u?: User | null) => void;
  setNotification: (n: AppNotification) => void;
};

const Auth = ({ setUser, setNotification }: AuthProps) => {
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [loading, setLoading] = useState<boolean>(false);

  const onAuth = async (data: AuthCredentials): Promise<void> => {
    if (mode === "signIn") {
      await handleLogin(data);
      return;
    }
    await handleSignUp(data);
  };

  const handleLogin = async (data: AuthCredentials) => {
    setLoading(true);
    const { encryptPassword } = await import("../../utils/encrypt-password");
    const { user, error } = await request("users", "", "post", {
      body: {
        login: data.login,
        password: await encryptPassword(data.password),
      },
    });
    setLoading(false);

    if (error?.no_user) {
      setError("auth.error.user_not_found");
      return;
    }
    if (error?.wrong_password) {
      setError("auth.error.wrong_password");
      return;
    }
    if (user) {
      setUser(user);
    }
  };

  const handleSignUp = async (data: AuthCredentials) => {
    setLoading(true);
    const { encryptPassword } = await import("../../utils/encrypt-password");
    const { user, error } = await request("users", "create", "post", {
      body: {
        ...data,
        password: await encryptPassword(data.password),
      },
    });
    setLoading(false);

    if (error?.user_exists) {
      setError("auth.error.user_exists", "warning");
      return;
    }
    if (user) {
      setUser(user);
    }
  };

  const setError = (text: string, severity: AlertColor = "error"): void => {
    setNotification({
      severity,
      text,
      translate: true,
      autoHide: 5000,
    });
  };

  const changeMode = (type: AuthMode) => {
    setMode(type);
  };

  return (
    <div className={styles.container}>
      <CardFlip
        isFlipped={mode === "signUp"}
        flipDirection="vertical"
        containerClassName={styles.flipContainer}
      >
        <AuthSide
          mode="signIn"
          emitAuth={onAuth}
          changeMode={() => changeMode("signUp")}
          loading={mode === "signIn" && loading}
        />
        <AuthSide
          mode="signUp"
          emitAuth={onAuth}
          changeMode={() => changeMode("signIn")}
          loading={mode === "signUp" && loading}
        />
      </CardFlip>
    </div>
  );
};

const mapDispatchToProps = {
  setUser,
  setNotification,
};

export default connect(undefined, mapDispatchToProps)(Auth);
