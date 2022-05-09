import { useState } from "react";
import dynamic from "next/dynamic";

import styles from "./Auth.module.css";
import { AuthCredentials, AuthMode } from "../../shared/auth";
import { useUser } from "../../hooks";

const AuthSide = dynamic(() => import("../../components/authSide"));
const CardFlip = dynamic(() => import("react-card-flip"));

const Auth = () => {
  const userService = useUser();

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
    await userService.logIn(data);
    setLoading(false);
  };

  const handleSignUp = async (data: AuthCredentials) => {
    setLoading(true);
    await userService.signUp(data);
    setLoading(false);
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

export default Auth;
