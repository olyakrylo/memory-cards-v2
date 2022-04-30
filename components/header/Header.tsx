import { useEffect } from "react";
import { Brightness4 } from "@mui/icons-material";

import { request } from "../../utils/request";
import styles from "./Header.module.css";

type HeaderProps = {
  darkMode?: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

export const Header = ({ darkMode, setDarkMode }: HeaderProps) => {
  useEffect(() => {
    request("config", "color", "get").then(({ dark }) => {
      if (!dark) return;
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    });
  }, [setDarkMode]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    document.documentElement.classList.toggle("dark");
    setDarkMode(newMode);

    void request("config", "color", "put", { body: { dark: newMode } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Memory <span className={styles.title_gray}>cards</span>
      </div>
      <button className={styles.modeButton} onClick={toggleTheme}>
        <Brightness4 sx={{ fontSize: 34 }} />
      </button>
    </div>
  );
};
