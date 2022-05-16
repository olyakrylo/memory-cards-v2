import AppImage from "../../image";
import { AdminView } from "../view/AdminView";
import { AdminTabData } from "../../../shared/admin";

type AllImagesProps = AdminTabData<string>;

export const AdminImages = ({ data, count }: AllImagesProps) => {
  const imageTitle = ({ _id: key }: { _id: string }): string => key;

  const imageContent = ({ _id: key }: { _id: string }): JSX.Element => {
    return <AppImage src={key} alt={""} maxHeight={"200px"} />;
  };

  return (
    <AdminView
      count={count}
      data={data.map((key) => ({ _id: key }))}
      itemTitle={imageTitle}
      itemContent={imageContent}
    />
  );
};
