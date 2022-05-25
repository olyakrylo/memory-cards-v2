import { useState } from "react";
import Image from "next/image";

import SkeletonLoader from "../skeletonLoader";

type CardImageProps = {
  src: string | File;
  alt: string;
  alignStart?: boolean;
};

export const AppImage = ({ src, alt, alignStart }: CardImageProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const handleLoad = () => {
    setLoading(false);
  };

  const imageSrc = () => {
    if (typeof src === "string") {
      const url = process.env.NEXT_PUBLIC_IMG_URL as string;
      return `${url}/${src}`;
    }
    return URL.createObjectURL(src);
  };

  return (
    <>
      {loading && <SkeletonLoader height={"100%"} width={"100%"} />}
      <Image
        src={imageSrc()}
        loading={"lazy"}
        alt={alt}
        layout={"fill"}
        objectFit={"contain"}
        objectPosition={alignStart ? "left" : "center"}
        onLoadingComplete={handleLoad}
      />
    </>
  );
};
