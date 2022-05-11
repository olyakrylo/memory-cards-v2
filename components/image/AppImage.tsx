import { useState } from "react";
import classNames from "classnames";

import styles from "./AppImage.module.css";
import { getImageSrc } from "../../utils/get-image-src";
import SkeletonLoader from "../skeletonLoader";

type CardImageProps = {
  src: string | File;
  alt: string;
  classes?: string;
  maxHeight?: string;
  alignStart?: boolean;
};

export const AppImage = ({
  src,
  classes,
  alt,
  maxHeight,
  alignStart,
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
        className={classNames(styles.image, {
          [styles.image_centered]: !alignStart,
        })}
        src={imageSrc()}
        alt={alt}
        style={{ maxHeight: maxHeight ?? "100%" }}
        loading={"lazy"}
        onLoad={handleLoad}
      />
    </div>
  );
};
