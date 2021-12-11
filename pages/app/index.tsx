import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "react-redux";

import { getUser } from "../../middleware";
import { setUser } from "../../redux/actions/main";
import { App } from "./App";

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
