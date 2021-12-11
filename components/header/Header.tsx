import { Brightness4 } from "@mui/icons-material";

import styles from "./Header.module.css";

type HeaderProps = {
  colorMode: "dark" | "light";
  setColorMode: (mode: "dark" | "light") => void;
};

export const Header = ({ colorMode, setColorMode }: HeaderProps) => {
  const toggleTheme = () => {
    const newMode = colorMode === "dark" ? "light" : "dark";
    document.documentElement.classList.add(newMode);
    document.documentElement.classList.remove(colorMode);
    setColorMode(newMode);
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
