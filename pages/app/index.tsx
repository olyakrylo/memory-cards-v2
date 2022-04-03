import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

import { request } from "../../utils/request";
import { setUser } from "../../redux/actions/main";
import { State, User } from "../../utils/types";
import styles from "./App.module.css";
import Header from "../../components/header";
import Topics from "../../components/topics";
import Cards from "../../components/cards";

type AppProps = {
  user?: User;
  setUser: (user?: User) => void;
};

const App = ({ user, setUser }: AppProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }
    request("users", "", "get").then(({ user }) => {
      if (user) {
        setUser(user);
      } else {
        router.push({ pathname: "/auth" });
        return;
      }
      setLoading(false);
    });
  }, [user, setUser, router, setLoading]);

  if (loading || !user) {
    return <CircularProgress size={50} />;
  }

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

const mapStateToProps = (state: { main: State }) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = {
  setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
