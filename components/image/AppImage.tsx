import { CircularProgress } from "@mui/material";

import styles from "./AppImage.module.css";
import { getImageSrc } from "../../utils/images";

type CardImageProps = {
  src: string;
  alt: string;
  simpleSrc?: boolean;
  classes?: string;
  rounded?: boolean;
  maxHeight?: string;
  absolute?: boolean;
};

export const AppImage = ({
  src,
  classes,
  alt,
  simpleSrc,
  maxHeight,
  rounded,
  absolute,
}: CardImageProps) => {
  return (
    <div
      className={`${styles.container} ${classes ?? ""}`}
      style={{
        position: absolute ? "absolute" : "relative",
      }}
    >
      <CircularProgress size={30} className={styles.loader} />
      <img
        className={styles.image}
        src={simpleSrc ? src : getImageSrc(src)}
        alt={alt}
        style={{
          maxHeight: maxHeight ?? "100%",
          borderRadius: rounded ? "8px" : "none",
        }}
        loading={"lazy"}
      />
    </div>
  );
};
