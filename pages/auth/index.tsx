import { NextApiRequest, NextApiResponse } from "next";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { getUser, request } from "../../middleware";
import { User } from "../../utils/types";
import { flip } from "../../utils/flip";
import styles from "./Auth.module.css";
import Header from "../../components/header";

type Mode = "signIn" | "signUp";

const Auth = () => {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signIn");
  const content = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { login, password } = e.target as HTMLFormElement;
    if (!login.value || !password.value) return;
    const { user } = await request<{ user: User }>("post", "users", {
      login: login.value,
      password: password.value,
    });
    if (user) {
      await router.push("/app");
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const { login, password } = e.target as HTMLFormElement;
    if (!login.value || !password.value) return;
    const { user } = await request<{ user: User }>("post", "users/create", {
      login: login.value,
      password: password.value,
    });
    if (user) {
      await router.push("/app");
    }
  };

  const changeMode = (type: Mode) => {
    if (!content.current) return;
    flip(content.current, 200, () => setMode(type));
  };

  return (
    <div className={styles.container}>
      <Header />

      <div ref={content} className={styles.content}>
        <p className={styles.title}>{t(`auth.${mode}`)}</p>

        {mode === "signIn" && (
          <form onSubmit={handleLogin} className={styles.form}>
            <Login />
            <Password />

            <div className={styles.buttonsContainer}>
              <Button variant="contained" type="submit">
                {t("auth.button.signIn")}
              </Button>
              {t("ui.or")}
              <Button type="button" onClick={() => changeMode("signUp")}>
                {t("auth.button.signUp")}
              </Button>
            </div>
          </form>
        )}

        {mode === "signUp" && (
          <form onSubmit={handleSignUp} className={styles.form}>
            <Login />
            <Password />

            <div className={styles.buttonsContainer}>
              <Button variant="contained" type="submit">
                {t("auth.button.signUp")}
              </Button>
              {t("ui.or")}
              <Button type="button" onClick={() => changeMode("signIn")}>
                {t("auth.button.signIn")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  const { t } = useTranslation();
  return (
    <TextField
      className={styles.input}
      label={t("auth.placeholder.login").toLowerCase()}
      size="small"
      name="login"
    />
  );
};

const Password = () => {
  const { t } = useTranslation();
  return (
    <TextField
      className={styles.input}
      label={t("auth.placeholder.password").toLowerCase()}
      size="small"
      type="password"
      name="password"
    />
  );
};

export async function getServerSideProps(ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user = await getUser(ctx.req, ctx.res);
  if (user) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default Auth;
