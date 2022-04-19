import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactCardFlip from "react-card-flip";

import {
  AppNotification,
  AuthCredentials,
  AuthMode,
  State,
} from "../../utils/types";
import { setNotification, setUser } from "../../redux/actions/main";
import { request } from "../../utils/request";
import styles from "./Auth.module.css";
import Header from "../../components/header";
import { User } from "../../utils/types";
import { encryptString } from "../../utils/cookies";
import AuthSide from "../../components/authSide";

type AuthProps = {
  user?: User | null;
  setUser: (u?: User | null) => void;
  setNotification: (n: AppNotification) => void;
};

const Auth = ({ user, setUser, setNotification }: AuthProps) => {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("signIn");

  useEffect(() => {
    if (user) {
      void router.push({ pathname: "/app" });
      return;
    }
    if (user === null) return;

    request("users", "", "get").then(({ user }) => {
      if (user) {
        setUser(user);
      }
    });
  }, [user, setUser, router]);

  const onAuth = async (data: AuthCredentials): Promise<void> => {
    if (mode === "signIn") {
      await handleLogin(data);
      return;
    }
    await handleSignUp(data);
  };

  const handleLogin = async (data: AuthCredentials) => {
    const { user, error } = await request("users", "", "post", {
      login: data.login,
      password: encryptedPassword(data.password),
    });
    if (error?.no_user) {
      setNotification({
        severity: "error",
        text: "auth.error.user_not_found",
        translate: true,
        autoHide: 5000,
      });
      return;
    }
    if (error?.wrong_password) {
      setNotification({
        severity: "error",
        text: "auth.error.wrong_password",
        translate: true,
        autoHide: 5000,
      });
      return;
    }
    if (user) {
      setUser(user);
    }
  };

  const handleSignUp = async (data: AuthCredentials) => {
    const { user, error } = await request("users", "create", "post", {
      ...data,
      password: encryptedPassword(data.password),
    });
    if (error?.user_exists) {
      setNotification({
        severity: "warning",
        text: "auth.error.user_exists",
        translate: true,
        autoHide: 5000,
      });
      return;
    }
    if (user) {
      setUser(user);
    }
  };

  const encryptedPassword = (password: string): string => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET as string;
    return encryptString(password, secretKey);
  };

  const changeMode = (type: AuthMode) => {
    setMode(type);
  };

  return (
    <div className={styles.container}>
      <Header />

      <ReactCardFlip
        isFlipped={mode === "signUp"}
        flipDirection="vertical"
        containerClassName={styles.flipContainer}
      >
        <AuthSide
          mode="signIn"
          emitAuth={onAuth}
          changeMode={() => changeMode("signUp")}
        />
        <AuthSide
          mode="signUp"
          emitAuth={onAuth}
          changeMode={() => changeMode("signIn")}
        />
      </ReactCardFlip>
    </div>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = {
  setUser,
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
