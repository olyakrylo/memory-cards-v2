import { useState } from "react";

import styles from "./AppImage.module.css";
import { getImageSrc } from "../../utils/get-image-src";
import SkeletonLoader from "../skeletonLoader";

type CardImageProps = {
  src: string | File;
  alt: string;
  classes?: string;
  maxHeight?: string;
};

export const AppImage = ({ src, classes, alt, maxHeight }: CardImageProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const handleLoad = () => {
    setLoading(false);
  };

  const imageSrc = () => {
    if (typeof src === "string") {
      return getImageSrc(src);
    }
    return URL.createObjectURL(src);
  };

  return (
    <div className={`${styles.container} ${classes ?? ""}`}>
      {loading && <SkeletonLoader height={"100%"} width={"100%"} />}
      <img
        className={styles.image}
        src={imageSrc()}
        alt={alt}
        style={{ maxHeight: maxHeight ?? "100%" }}
        loading={"lazy"}
        onLoad={handleLoad}
      />
    </div>
  );
};
