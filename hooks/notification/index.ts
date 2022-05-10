import { useDispatch, useSelector } from "react-redux";

import { setNotification } from "../../redux/actions/main";
import { AppNotification } from "../../shared/notification";
import { State } from "../../shared/redux";

export const useNotificationImpl = () => {
  const dispatch = useDispatch();

  const notification = useSelector(
    (state: { main: State }) => state.main.notification
  );
  const dispatchNotification = (n: AppNotification) => {
    dispatch(setNotification(n));
  };

  const set = (n: AppNotification): void => {
    dispatchNotification(n);
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

  return { current: notification, set, setError, setWarning, setSuccess };
};
