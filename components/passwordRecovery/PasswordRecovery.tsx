import { useTranslation } from "react-i18next";
import { BaseSyntheticEvent, Fragment, useState } from "react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";

import { AppNotification } from "../../utils/types";
import { request } from "../../utils/request";
import styles from "./PasswordRecovery.module.css";
import AppDialog from "../dialog";

type PasswordRecoveryProps = {
  setNotification: (n: AppNotification) => void;
};

export const PasswordRecovery = ({
  setNotification,
}: PasswordRecoveryProps) => {
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleEmailChange = (event: BaseSyntheticEvent) => {
    setEmailError("");
    setEmail(event.target.value);
  };

  const send = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("email");
      return;
    }

    setLoading(true);
    const { sent, no_user } = await request("users", "recovery", "post", {
      email,
    });
    setLoading(false);

    if (no_user) {
      setEmailError("user_not_found");
      return;
    }

    if (!sent) {
      setNotification({
        severity: "error",
        text: "auth.recovery.sending_problem",
        translate: true,
      });
    } else {
      setNotification({
        severity: "success",
        text: "auth.recovery.message_sent",
        translate: true,
      });
      setDialogOpen(false);
    }
  };

  return (
    <Fragment>
      <Button
        color="secondary"
        className={styles.forgotPassButton}
        onClick={openDialog}
      >
        {t("auth.recovery.forgot")}
      </Button>

      <AppDialog
        open={dialogOpen}
        size={"xs"}
        title={
          <Typography variant={"h6"} className={styles.title} color={"primary"}>
            {t("auth.recovery.title")}
            {loading && <CircularProgress size={32} />}
          </Typography>
        }
        content={
          <div className={styles.content}>
            <TextField
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={
                emailError ? t(`auth.error.${emailError}`) : undefined
              }
              label="email"
              type="email"
              name="email"
              size="small"
            />

            <Typography variant={"subtitle2"}>
              {t("auth.recovery.message")}.
            </Typography>
          </div>
        }
        actions={
          <>
            <Button onClick={send} variant="contained">
              {t("ui.send")}
            </Button>
            <Button onClick={closeDialog} color="secondary">
              {t("ui.cancel")}
            </Button>
          </>
        }
      />
    </Fragment>
  );
};
