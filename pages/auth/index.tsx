import { NextApiRequest, NextApiResponse } from "next";

import { getUser } from "../../middleware";
import { Auth } from "./Auth";

export async function getServerSideProps(ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user = await getUser(ctx.req, ctx.res);
  if (user) {
    return {
      redirect: {
        destination: "/app",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default Auth;
