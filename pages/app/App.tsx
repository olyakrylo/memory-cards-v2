import "@splidejs/splide/dist/css/splide.min.css";

import Header from "../../components/header";
import { User } from "../../utils/types";
import styles from "./app.module.css";
import Topics from "../../components/topics";
import Cards from "../../components/cards";

type AppProps = {
  user: User;
  setUser: (user?: User) => void;
};

export const App = ({ user, setUser }: AppProps) => {
  setUser(user);

  return (
    <div className={`${styles.container}`}>
      <Header />

      <Topics />

      <div className={styles.content}>
        <Cards />
      </div>
    </div>
  );
};
