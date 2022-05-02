import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

import { setUser } from "../../redux/actions/main";
import { State } from "../../shared/redux";
import { User } from "../../shared/models";
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

      <Topics />

      <div className={styles.content}>
        {loading && <CircularProgress className={styles.loader} size={40} />}

        {!loading && <Cards />}
      </div>
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
