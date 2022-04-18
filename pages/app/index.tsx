import { connect } from "react-redux";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

import { setUser } from "../../redux/actions/main";
import { State } from "../../utils/types";
import { User } from "../../utils/types";
import { request } from "../../utils/request";
import styles from "./App.module.css";
import Topics from "../../components/topics";
import Header from "../../components/header";
import Cards from "../../components/cards";

type AppProps = {
  user?: User | null;
  setUser: (user?: User | null) => void;
};

const App = ({ user, setUser }: AppProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user === null) {
      void router.push("/auth");
      return;
    }
    if (user) {
      setLoading(false);
      return;
    }
    request("users", "", "get").then(({ user }) => {
      if (user) {
        setUser(user);
      } else {
        void router.push("/auth");
        return;
      }
      setLoading(false);
    });
  }, [user, setUser, router, setLoading]);

  return (
    <div className={`${styles.container}`}>
      <Header />

      {loading && <CircularProgress className={styles.loader} size={50} />}

      {!loading && (
        <Fragment>
          <Topics />

          <div className={styles.content}>
            <Cards />
          </div>
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = {
  setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
