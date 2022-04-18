import { Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { request } from "../../utils/request";
import { flip } from "../../utils/flip";
import styles from "./Auth.module.css";
import Header from "../../components/header";
import { State, User } from "../../utils/types";
import { setUser } from "../../redux/actions/main";
import { encryptString } from "../../utils/cookies";
import PasswordRecovery from "../../components/passwordRecovery";
import { validateInput } from "../../utils/validate-auth-input";

type Mode = "signIn" | "signUp";

type AuthProps = {
  user?: User | null;
  setUser: (u?: User | null) => void;
};

const Auth = ({ user, setUser }: AuthProps) => {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signIn");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const content = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      router.push({ pathname: "/app" });
      return;
    }
    setUser(undefined);
    request("users", "", "get").then(({ user }) => {
      if (user) {
        router.push({ pathname: "/app" });
      }
    });
  }, [user, setUser, router]);

  const handleLoginChange = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    if (validateInput(value)) {
      setLogin(value);
    }
  };

  const handlePasswordChange = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    if (validateInput(value)) {
      setPassword(value);
    }
  };

  const handleEmailChange = (event: BaseSyntheticEvent): void => {
    setEmail(event.target.value);
  };

  const handleAuth = async (): Promise<void> => {
    if (mode === "signIn") {
      await handleLogin();
      return;
    }
    await handleSignUp();
  };

  const handleLogin = async () => {
    setLoginError("");
    setPasswordError("");
    const { user, error } = await request("users", "", "post", {
      login,
      password: encryptedPassword(),
    });
    if (error?.no_user) {
      setLoginError("user_not_found");
      return;
    }
    if (error?.wrong_password) {
      setPasswordError("wrong_password");
      return;
    }
    if (user) {
      await router.push("/app");
    }
  };

  const handleSignUp = async () => {
    setLoginError("");
    setPasswordError("");

    if (!validateData()) return;

    const { user, error } = await request("users", "create", "post", {
      login,
      password: encryptedPassword(),
      email,
    });
    if (error?.user_exists) {
      setLoginError("user_exists");
      return;
    }
    if (user) {
      await router.push("/app");
    }
  };

  const validateData = (): boolean => {
    let result = true;
    if (login.length < 3) {
      setLoginError("short_login");
      result = false;
    }
    if (password.length < 9) {
      setPasswordError("short_password");
      result = false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("email");
      result = false;
    }
    return result;
  };

  const encryptedPassword = (): string => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET as string;
    return encryptString(password, secretKey);
  };

  const changeMode = (type: Mode) => {
    if (!content.current) return;
    setLoginError("");
    setPasswordError("");
    setLogin("");
    setPassword("");
    flip(content.current, 200, () => setMode(type));
  };

  const oppositeMode = (): Mode => {
    return mode === "signIn" ? "signUp" : "signIn";
  };

  return (
    <div className={styles.container}>
      <Header />

      <div ref={content} className={styles.content}>
        <p className={styles.title}>{t(`auth.${mode}`)}</p>

        <div className={styles.form}>
          <TextField
            className={styles.input}
            label={t("auth.placeholder.login").toLowerCase()}
            value={login}
            onChange={handleLoginChange}
            error={!!loginError}
            helperText={loginError ? t(`auth.error.${loginError}`) : ""}
            size="small"
          />
          {mode === "signUp" && (
            <TextField
              className={styles.input}
              label="email"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError ? t(`auth.error.${emailError}`) : ""}
              size="small"
              type="email"
              name="email"
            />
          )}
          <TextField
            className={styles.input}
            label={t("auth.placeholder.password").toLowerCase()}
            value={password}
            onChange={handlePasswordChange}
            error={!!passwordError}
            helperText={passwordError ? t(`auth.error.${passwordError}`) : ""}
            size="small"
            type="password"
          />

          {mode === "signIn" && <PasswordRecovery />}

          <div className={styles.buttonsContainer}>
            <Button
              variant="contained"
              onClick={handleAuth}
              disabled={!login || !password}
            >
              {t(`auth.button.${mode}`)}
            </Button>
            {t("ui.or")}
            <Button type="button" onClick={() => changeMode(oppositeMode())}>
              {t(`auth.button.${oppositeMode()}`)}
            </Button>
          </div>
        </div>
      </div>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
