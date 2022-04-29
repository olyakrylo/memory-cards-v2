import { connect } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { GetServerSideProps } from "next";

import { setUser } from "../../redux/actions/main";
import { User } from "../../utils/types";
import styles from "./App.module.css";
import Topics from "../../components/topics";
import Header from "../../components/header";
import Cards from "../../components/cards";
import getSSRUser from "../../utils/ssr-user";

type AppProps = {
  user: User;
  setUser: (user?: User | null) => void;
};

const App = ({ user, setUser }: AppProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setUser(user);
    setLoading(false);
  }, [user]);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getSSRUser.getUser(context);
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: true,
      },
    };
  }

  return { props: { user } };
};

const mapDispatchToProps = {
  setUser,
};

export default connect(undefined, mapDispatchToProps)(App);
