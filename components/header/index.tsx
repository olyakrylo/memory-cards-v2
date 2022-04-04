import { connect } from "react-redux";
import { Brightness4 } from "@mui/icons-material";

import { State } from "../../utils/types";
import { setDarkMode } from "../../redux/actions/main";
import styles from "./Header.module.css";
import { useEffect } from "react";
import { request } from "../../utils/request";

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

    void request("config", "color", "put", { dark: newMode });
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

const mapStateToProps = (state: { main: State }) => {
  return {
    darkMode: state.main.darkMode,
  };
};

const mapDispatchToProps = {
  setDarkMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
