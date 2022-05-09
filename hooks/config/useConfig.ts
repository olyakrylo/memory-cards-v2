import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../../redux/actions/main";
import { State } from "../../shared/redux";
import { useApi } from "../index";

export const useConfigImpl = () => {
  const api = useApi();
  const darkMode = useSelector((state: { main: State }) => state.main.darkMode);
  const dispatch = useDispatch();

  const dispatchDarkMode = (dark: boolean) => {
    dispatch(setDarkMode(dark));
  };

  const toggleColorMode = () => {
    const newMode = !darkMode;
    dispatchDarkMode(newMode);
    void api.request("config", "color", "put", { body: { dark: newMode } });
  };

  const getColorMode = async (): Promise<{ dark: boolean }> => {
    const { dark } = await api.request("config", "color", "get");
    dispatchDarkMode(dark);
    return { dark };
  };

  return {
    toggleColorMode,
    getColorMode,
  };
};
