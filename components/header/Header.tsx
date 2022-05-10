import { useEffect } from "react";
import { Brightness4 } from "@mui/icons-material";
import Link from "next/link";

import styles from "./Header.module.css";
import { useConfig, useUser } from "../../hooks";

export const Header = () => {
  const config = useConfig();
  const { info: user } = useUser();

  useEffect(() => {
    console.log("here");
    config.getColorMode().then(({ dark }) => {
      if (dark) {
        document.documentElement.classList.add("dark");
      }
    });
  }, [user?._id]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    config.toggleColorMode();
  };

  return (
    <div className={styles.container}>
      <Link href={"/app"} passHref>
        <div className={styles.title}>
          Memory <span className={styles.title_gray}>cards</span>
        </div>
      </Link>
      <button className={styles.modeButton} onClick={toggleTheme}>
        <Brightness4 sx={{ fontSize: 34 }} />
      </button>
    </div>
  );
};
