import { connect } from "react-redux";
import { CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";

import { State } from "../../shared/redux";
import { User } from "../../shared/models";
import styles from "./App.module.css";

const CardsLoaderComponent = (
  <CircularProgress className={styles.loader} size={40} />
);

const Topics = dynamic(() => import("../../components/topics"));
const Cards = dynamic(() => import("../../components/cards"), {
  loading: () => CardsLoaderComponent,
});

type AppProps = {
  user?: User | null;
};

const App = ({ user }: AppProps) => {
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

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
  };
};

export default connect(mapStateToProps)(App);
