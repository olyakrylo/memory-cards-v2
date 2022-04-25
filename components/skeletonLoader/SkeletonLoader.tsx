import { Skeleton } from "@mui/material";

import styles from "./SkeletonLoader.module.css";

type SkeletonLoaderProps = {
  height: number;
  count: number;
  classes?: string;
};

export const SkeletonLoader = ({
  height,
  classes,
  count,
}: SkeletonLoaderProps) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            variant={"rectangular"}
            height={height}
            className={`${styles.skeleton} ${classes}`}
          />
        ))}
    </>
  );
};
