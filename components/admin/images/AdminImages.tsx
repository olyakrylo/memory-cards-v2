import AppImage from "../../image";
import { AdminView } from "../view/AdminView";
import { AdminTabData } from "../../../shared/admin";
import { UpdatedResult } from "../../../shared/api";
import { useFiles } from "../../../hooks";
import styles from "./AdminImages.module.css";

type AllImagesProps = AdminTabData<string>;

export const AdminImages = ({ data, count }: AllImagesProps) => {
  const files = useFiles();

  const deleteImages = (ids: string[]): Promise<UpdatedResult> => {
    return files.deleteByKeys(ids);
  };

  const imageTitle = ({ _id: key }: { _id: string }): string => key;

  const imageContent = ({ _id: key }: { _id: string }): JSX.Element => {
    return (
      <div className={styles.image}>
        <AppImage src={key} alt={""} />
      </div>
    );
  };

  return (
    <AdminView
      count={count}
      data={data.map((key) => ({ _id: key }))}
      itemTitle={imageTitle}
      itemContent={imageContent}
      deleteFunc={deleteImages}
    />
  );
};
