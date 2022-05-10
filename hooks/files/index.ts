import { useApi } from "../index";

export const useFilesImpl = () => {
  const api = useApi();

  const upload = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append("file", file);

    const { filename } = await api.request("files", "upload", "post", {
      body,
      formData: true,
    });
    return filename;
  };

  return { upload };
};
