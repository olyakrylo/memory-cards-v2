import { useDispatch } from "react-redux";
import { setNotification } from "../../redux/actions/main";
import { AppNotification } from "../../shared/notification";
import { AlertColor } from "@mui/material";

export const useNotificationImpl = () => {
  const dispatch = useDispatch();

  const dispatchNotification = (n: AppNotification) => {
    dispatch(setNotification(n));
  };

  const setError = (text: string, translate = true, autoHide = 5000) => {
    dispatchNotification({
      severity: "error",
      text,
      translate,
      autoHide,
    });
  };

  const setWarning = (text: string, translate = true, autoHide = 5000) => {
    dispatchNotification({
      severity: "warning",
      text,
      translate,
      autoHide,
    });
  };

  const setSuccess = (text: string, translate = true, autoHide = 5000) => {
    dispatchNotification({
      severity: "success",
      text,
      translate,
      autoHide,
    });
  };

  return { setError, setWarning, setSuccess };
};
