import { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

import { User } from "../../shared/models";
import styles from "./Recovery.module.css";
import { useUser } from "../../hooks";

const AuthInput = dynamic(() => import("../../components/authInput"));

const Link = dynamic(() => import("next/link"));
const CircularProgress = dynamic(
  () => import("@mui/material/CircularProgress")
);
const Typography = dynamic(() => import("@mui/material/Typography"));
const Button = dynamic(() => import("@mui/material/Button"));

const REDIRECT_TIME = 5; // seconds

const Recovery = () => {
  const router = useRouter();
  const userService = useUser();
  const { t } = useTranslation();

  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<{ first: string; second: string }>({
    first: "",
    second: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [remainedSeconds, setRemainedSeconds] = useState<number>(REDIRECT_TIME);

  useEffect(() => {
    if (!router.query.id) return;
    userService.getRecoveryUser(router.query.id as string).then(({ user }) => {
      setUser(user);
      setLoading(false);
    });
  }, [router.query.id]);

  const handlePassword = async (
    event: BaseSyntheticEvent,
    repeat?: boolean
  ): Promise<void> => {
    const { value } = event.target;
    setError("");

    const { validateInput } = await import("../../utils/validate-auth-input");

    if (!validateInput(value)) return;

    if (repeat) {
      setPassword({ ...password, second: value });
    } else {
      setPassword({ ...password, first: value });
    }
  };

  const update = async () => {
    if (!user) return;
    if (!validateInputs()) return;

    setLoading(true);
    const { updated } = await userService.updateRecoveryUser(
      user,
      password.first
    );

    if (updated) {
      setSuccess(true);
      setLoading(false);

      let seconds = remainedSeconds;
      const interval = setInterval(() => {
        setRemainedSeconds(--seconds);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        router.push("/auth");
      }, REDIRECT_TIME * 1000);
    }
  };

  const validateInputs = (): boolean => {
    if (password.first.length < 8) {
      setError("auth.error.short_password");
      return false;
    }
    if (password.first !== password.second) {
      setError("auth.error.not_same_pass");
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <CircularProgress className={styles.loader} />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Typography>{t("auth.recovery.success")}</Typography>
          <Typography
            variant="subtitle1"
            color="primary"
            className={styles.link}
          >
            <Link href="/auth">{t("auth.recovery.to_auth")}</Link>
          </Typography>
          <Typography variant="subtitle2">
            {t("ui.redirect-in-seconds", { count: remainedSeconds })}
          </Typography>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Typography>{t("ui.non_working_link")} :(</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography color="primary" fontWeight={500} variant="h5">
          Hi, {user?.login}!
        </Typography>
        <Typography variant="subtitle2">
          {t("auth.recovery.set_new_pass")}:
        </Typography>

        <AuthInput
          label={t("auth.placeholder.password")}
          value={password.first}
          changeHandler={handlePassword}
          type="password"
        />
        <AuthInput
          label={t("auth.placeholder.repeat")}
          value={password.second}
          changeHandler={(e) => handlePassword(e, true)}
          type="password"
        />

        {error && (
          <Typography color="secondary" variant="subtitle2">
            {t(error)}
          </Typography>
        )}

        <Button variant="contained" onClick={update}>
          {t("auth.recovery.update")}
        </Button>
      </div>
    </div>
  );
};

export default Recovery;
