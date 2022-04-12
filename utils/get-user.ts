import { GetServerSidePropsContext } from "next";
import { User } from "./types";
import Cookies from "cookies";
import { getCookie } from "./cookies";
import { connect } from "./connection";

export async function getUser(
  context: GetServerSidePropsContext
): Promise<User | undefined> {
  const cookies = new Cookies(context.req, context.res);
  const { SECRET } = process.env;
  const id = getCookie(cookies, "id_token", SECRET as string);

  if (!id) {
    return undefined;
  }

  const { User } = await connect();
  const user = await User.findById(id);

  if (!user) {
    return undefined;
  }

  return {
    ...user._doc,
    _id: user._id.toString(),
  };
}
