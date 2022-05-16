import { useApi } from "../index";
import { UpdatedResult } from "../../shared/api";

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

  const deleteByKeys = (keys: string[]): Promise<UpdatedResult> => {
    return api.request("admin", "images", "delete", { body: { keys } });
  };

  return { upload, deleteByKeys };
};
