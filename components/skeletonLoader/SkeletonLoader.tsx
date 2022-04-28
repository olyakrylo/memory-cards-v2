import { Skeleton } from "@mui/material";

import styles from "./SkeletonLoader.module.css";

type SkeletonLoaderProps = {
  height?: number | string;
  width?: number | string;
  count?: number;
  classes?: string;
};

export const SkeletonLoader = ({
  height,
  width,
  classes,
  count,
}: SkeletonLoaderProps) => {
  return (
    <>
      {Array(count ?? 1)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            variant={"rectangular"}
            height={height}
            width={width}
            className={`${styles.skeleton} ${classes}`}
          />
        ))}
    </>
  );
};
