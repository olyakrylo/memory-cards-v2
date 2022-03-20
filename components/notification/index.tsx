import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BaseSyntheticEvent } from "react";
import { connect } from "react-redux";

import { AppNotification, State } from "../../utils/types";
import { setNotification } from "../../redux/actions/main";

type NotificationProps = {
  notification: AppNotification;
  setNotification: (n: AppNotification) => void;
};

export const Notification = ({
  notification,
  setNotification,
}: NotificationProps) => {
  const { t } = useTranslation();

  const handleClose = (
    _: BaseSyntheticEvent,
    reason?: SnackbarCloseReason
  ): void => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({ ...notification, text: "" });
  };

  return (
    <Snackbar
      open={!!notification.text}
      autoHideDuration={notification.autoHide}
      onClose={handleClose}
    >
      <Alert
        severity={notification.severity}
        sx={{ width: "100%" }}
        onClose={handleClose}
      >
        {notification.translate ? t(notification.text) : notification.text}
      </Alert>
    </Snackbar>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    notification: state.main.notification,
  };
};

const mapDispatchToProps = {
  setNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
