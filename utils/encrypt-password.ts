import { encryptString } from "./cookies";

export const encryptPassword = async (password: string): Promise<string> => {
  const secretKey = process.env.NEXT_PUBLIC_SECRET as string;
  return encryptString(password, secretKey);
};
