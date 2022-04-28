import { useState } from "react";

import styles from "./AppImage.module.css";
import { getImageSrc } from "../../utils/images";
import SkeletonLoader from "../skeletonLoader";

type CardImageProps = {
  src: string | File;
  alt: string;
  classes?: string;
  rounded?: boolean;
  maxHeight?: string;
};

export const AppImage = ({
  src,
  classes,
  alt,
  maxHeight,
  rounded,
}: CardImageProps) => {
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
        style={{
          maxHeight: maxHeight ?? "100%",
          borderRadius: rounded ? "8px" : "none",
        }}
        loading={"lazy"}
        onLoad={handleLoad}
      />
    </div>
  );
};
