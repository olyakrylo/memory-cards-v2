import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { User } from "./types";
import { getUserId } from "./get-user-id";
import { connect as connectDB } from "./connection";

class SSRUser {
  private users: Record<string, User> = {};

  async getUser({
    req,
    res,
  }: GetServerSidePropsContext): Promise<User | undefined> {
    const userId = getUserId(req as NextApiRequest, res as NextApiResponse);

    if (!userId) return undefined;

    if (this.users[userId]) return this.users[userId];

    const { User } = await connectDB();
    const userData = await User.findById(userId);

    if (!userData) return undefined;

    this.users[userId] = {
      login: userData.login,
      email: userData.email,
      _id: userData._id.toString(),
    };

    return this.users[userId];
  }

  removeUser(id: string): void {
    delete this.users[id];
  }
}

export default new SSRUser();
