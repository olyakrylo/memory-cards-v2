import { connect } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import ReactCardFlip from "react-card-flip";
import { GetServerSideProps } from "next";

import { AppNotification, AuthCredentials, AuthMode } from "../../utils/types";
import { setNotification } from "../../redux/actions/main";
import { request } from "../../utils/request";
import styles from "./Auth.module.css";
import Header from "../../components/header";
import { encryptString } from "../../utils/cookies";
import AuthSide from "../../components/authSide";
import SSRUser from "../../utils/ssr-user";

type AuthProps = {
  setNotification: (n: AppNotification) => void;
};

const Auth = ({ setNotification }: AuthProps) => {
  const router = useRouter();

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
    const { user, error } = await request("users", "", "post", {
      login: data.login,
      password: encryptedPassword(data.password),
    });
    setLoading(false);

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
      await redirectToApp();
    }
  };

  const handleSignUp = async (data: AuthCredentials) => {
    setLoading(true);
    const { user, error } = await request("users", "create", "post", {
      ...data,
      password: encryptedPassword(data.password),
    });
    setLoading(false);

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
      await redirectToApp();
    }
  };

  const redirectToApp = async () => {
    await router.push("/auth");
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
          loading={mode === "signIn" && loading}
        />
        <AuthSide
          mode="signUp"
          emitAuth={onAuth}
          changeMode={() => changeMode("signIn")}
          loading={mode === "signUp" && loading}
        />
      </ReactCardFlip>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await SSRUser.getUser(context);

  if (user) {
    return {
      redirect: {
        destination: "/app",
        permanent: true,
      },
    };
  }

  return { props: {} };
};

const mapDispatchToProps = {
  setNotification,
};

export default connect(undefined, mapDispatchToProps)(Auth);
