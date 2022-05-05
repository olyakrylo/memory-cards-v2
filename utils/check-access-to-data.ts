import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "./connection";
import { getUserId } from "./get-user-id";

export const checkAccessToData = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> => {
  if (req.headers["user-agent"]?.includes("node-fetch")) {
    return true;
  }

  const { User } = await connect();

  const userId = await getUserId(req, res);
  const user = await User.findById(userId);

  return !!user?._doc.admin;
};
