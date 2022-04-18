import { useRouter } from "next/router";
import { BaseSyntheticEvent, Fragment, useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { User } from "../../utils/types";
import { request } from "../../utils/request";
import styles from "./Recovery.module.css";
import { validateInput } from "../../utils/validate-auth-input";
import { encryptString } from "../../utils/cookies";
import AuthInput from "../../components/authInput";

const REDIRECT_TIME = 5; // seconds

const Recovery = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [firstPass, setFirstPass] = useState<string>("");
  const [secondPass, setSecondPass] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [remainedSeconds, setRemainedSeconds] = useState<number>(REDIRECT_TIME);

  useEffect(() => {
    if (!router.query.id) return;
    request("users", "recovery_user", "post", {
      id: router.query.id as string,
    }).then(({ user }) => {
      setUser(user);
      setLoading(false);
    });
  }, [router.query]);

  const handlePassword = (event: BaseSyntheticEvent, repeat?: boolean) => {
    const { value } = event.target;
    setError("");
    if (!validateInput(value)) return;

    if (repeat) {
      setSecondPass(value);
    } else {
      setFirstPass(value);
    }
  };

  const update = async () => {
    if (!user) return;
    if (!validateInputs()) return;

    setLoading(true);
    const { updated } = await request("users", "recovery_user", "put", {
      id: user?._id,
      password: encryptString(
        firstPass,
        process.env.NEXT_PUBLIC_SECRET as string
      ),
    });
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
    if (firstPass.length < 8) {
      setError("auth.error.short_password");
      return false;
    }
    if (secondPass !== firstPass) {
      setError("auth.error.not_same_pass");
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div className={styles.content}>
        <CircularProgress className={styles.loader} />
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.content}>
        <Typography>{t("auth.recovery.success")}</Typography>
        <Typography variant="subtitle1" color="primary" className={styles.link}>
          <Link href="/auth">{t("auth.recovery.to_auth")}</Link>
        </Typography>
        <Typography variant="subtitle2">
          {t("ui.redirect-in-seconds", { count: remainedSeconds })}
        </Typography>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.content}>
        <Typography>{t("ui.non_working_link")} :(</Typography>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <Fragment>
        <Typography color="primary" fontWeight={500} variant="h5">
          Hi, {user?.login}!
        </Typography>
        <Typography variant="subtitle2">
          {t("auth.recovery.set_new_pass")}:
        </Typography>

        <AuthInput
          label={t("auth.placeholder.password")}
          value={firstPass}
          changeHandler={handlePassword}
          type="password"
        />
        <AuthInput
          label={t("auth.placeholder.repeat")}
          value={secondPass}
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
      </Fragment>
    </div>
  );
};

export default Recovery;
