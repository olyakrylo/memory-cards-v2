import { useTranslation } from "react-i18next";
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { BaseSyntheticEvent } from "react";

import { useNotification } from "../../hooks";

export const Notification = () => {
  const { t } = useTranslation();
  const notification = useNotification();

  const handleClose = (
    _: BaseSyntheticEvent,
    reason?: SnackbarCloseReason
  ): void => {
    if (reason === "clickaway") {
      return;
    }
    notification.set({ ...notification.current, text: "" });
  };

  return (
    <Snackbar
      open={!!notification.current.text}
      autoHideDuration={notification.current.autoHide}
      onClose={handleClose}
    >
      <Alert
        severity={notification.current.severity}
        sx={{ width: "100%" }}
        onClose={handleClose}
      >
        {notification.current.translate
          ? t(notification.current.text)
          : notification.current.text}
      </Alert>
    </Snackbar>
  );
};
