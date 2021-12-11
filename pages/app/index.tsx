import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "react-redux";

import { getUser } from "../../middleware";
import { setUser } from "../../redux/actions/main";
import { User } from "../../utils/types";
import styles from "./App.module.css";
import Header from "../../components/header";
import Topics from "../../components/topics";
import Cards from "../../components/cards";

type AppProps = {
  user: User;
  setUser: (user?: User) => void;
};

const App = ({ user, setUser }: AppProps) => {
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

export async function getServerSideProps(ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user = await getUser(ctx.req, ctx.res);

  if (user) {
    return { props: { user } };
  }

  return {
    redirect: {
      destination: "/auth",
      permanent: false,
    },
  };
}

const mapDispatchToProps = {
  setUser,
};

export default connect(undefined, mapDispatchToProps)(App);
