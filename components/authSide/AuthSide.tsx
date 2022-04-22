import { useTranslation } from "react-i18next";
import { BaseSyntheticEvent, useState } from "react";
import { Button, CircularProgress } from "@mui/material";

import { validateInput } from "../../utils/validate-auth-input";
import styles from "./AuthSide.module.css";
import AuthInput from "../authInput";
import { AuthCredentials, AuthMode } from "../../utils/types";
import PasswordRecovery from "../passwordRecovery";

type AuthSideProps = {
  mode: AuthMode;
  emitAuth: (data: AuthCredentials) => void;
  changeMode: () => void;
  loading: boolean;
};

export const AuthSide = ({
  mode,
  emitAuth,
  changeMode,
  loading,
}: AuthSideProps) => {
  const { t } = useTranslation();

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const oppositeMode = (): AuthMode => {
    return mode === "signIn" ? "signUp" : "signIn";
  };

  const handleLoginChange = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    if (validateInput(value)) {
      setLoginError("");
      setLogin(value);
    }
  };

  const handlePasswordChange = (event: BaseSyntheticEvent): void => {
    const { value } = event.target;
    if (validateInput(value)) {
      setPasswordError("");
      setPassword(value);
    }
  };

  const handleEmailChange = (event: BaseSyntheticEvent): void => {
    setEmail(event.target.value);
    setEmailError("");
  };

  const handleAuth = () => {
    const checked = validateAuth();
    if (checked) {
      emitAuth({ login, password, email });
    }
  };

  const validateAuth = (): boolean => {
    if (mode === "signIn") return true;

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

  return (
    <div className={styles.content}>
      <p className={styles.title}>
        {t(`auth.${mode}`)}
        {loading && <CircularProgress size={24} className={styles.loader} />}
      </p>

      <div className={styles.form}>
        <AuthInput
          label={t("auth.placeholder.login").toLowerCase()}
          value={login}
          changeHandler={handleLoginChange}
          error={loginError ? t(`auth.error.${loginError}`) : ""}
          type="text"
          name="username"
        />
        {mode === "signUp" && (
          <AuthInput
            label="email"
            value={email}
            changeHandler={handleEmailChange}
            error={emailError ? t(`auth.error.${emailError}`) : ""}
            type="email"
          />
        )}
        <AuthInput
          label={t("auth.placeholder.password").toLowerCase()}
          value={password}
          changeHandler={handlePasswordChange}
          error={passwordError ? t(`auth.error.${passwordError}`) : ""}
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
          <Button type="button" onClick={changeMode}>
            {t(`auth.button.${oppositeMode()}`)}
          </Button>
        </div>
      </div>
    </div>
  );
};
