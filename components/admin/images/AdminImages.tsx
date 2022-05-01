import AppImage from "../../image";
import { AdminData } from "../AdminData";

type AllImagesProps = {
  images: string[];
};

export const AdminImages = ({ images }: AllImagesProps) => {
  const imageTitle = (image: string): string => image;

  const imageContent = (image: string): JSX.Element => {
    return <AppImage key={image} src={image} alt={""} maxHeight={"200px"} />;
  };

  return (
    <AdminData
      count={images.length}
      data={images}
      itemTitle={imageTitle}
      itemContent={imageContent}
    />
  );
};
