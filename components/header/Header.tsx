import { useEffect } from "react";
import { Brightness4 } from "@mui/icons-material";

import styles from "./Header.module.css";
import { useConfig } from "../../hooks";

export const Header = () => {
  const config = useConfig();

  useEffect(() => {
    config.getColorMode().then(({ dark }) => {
      if (dark) {
        document.documentElement.classList.add("dark");
      }
    });
  });

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    config.toggleColorMode();
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
