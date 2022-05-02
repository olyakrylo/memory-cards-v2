import AppImage from "../../image";
import { AdminData } from "../AdminData";
import { AdminTabData } from "../../../shared/admin";

type AllImagesProps = AdminTabData<string>;

export const AdminImages = ({ data, count }: AllImagesProps) => {
  const imageTitle = (key: string): string => key;

  const imageContent = (key: string): JSX.Element => {
    return <AppImage src={key} alt={""} maxHeight={"200px"} />;
  };

  return (
    <AdminData
      count={count}
      data={data}
      itemTitle={imageTitle}
      itemContent={imageContent}
    />
  );
};
