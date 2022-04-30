import { request } from "./request";

export const getImageSrc = (filename: string): string => {
  return `/api/files/${filename}`;
};

export const uploadImage = async (
  image?: File
): Promise<string | undefined> => {
  if (!image) {
    return undefined;
  }

  const body = new FormData();
  body.append("file", image);

  const { filename } = await request("files", "upload", "post", {
    body,
    formData: true,
  });
  return filename;
};
