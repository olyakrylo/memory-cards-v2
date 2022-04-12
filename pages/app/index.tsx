import { connect } from "react-redux";
import { useEffect } from "react";
import { GetServerSideProps } from "next";

import { setUser } from "../../redux/actions/main";
import { User } from "../../utils/types";
import styles from "./App.module.css";
import Header from "../../components/header";
import Topics from "../../components/topics";
import Cards from "../../components/cards";

import { getUser } from "../../utils/get-user";

type AppProps = {
  user: User;
  setUser: (user?: User) => void;
};

const App = ({ user, setUser }: AppProps) => {
  useEffect(() => {
    setUser(user);
  }, []);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUser(context);
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return { props: { user } };
};

const mapDispatchToProps = {
  setUser,
};

export default connect(undefined, mapDispatchToProps)(App);
