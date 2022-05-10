import { CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";

import styles from "./App.module.css";
import { useUser, useUserService } from "../../hooks";

const CardsLoaderComponent = (
  <CircularProgress className={styles.loader} size={40} />
);

const Topics = dynamic(() => import("../../components/topics"));
const Cards = dynamic(() => import("../../components/cards"), {
  loading: () => CardsLoaderComponent,
});

const App = () => {
  useUserService();

  const { info: user } = useUser();

  return (
    <div className={`${styles.container}`}>
      <Topics />

      {user && (
        <div className={styles.content}>
          <Cards />
        </div>
      )}
    </div>
  );
};

export default App;
