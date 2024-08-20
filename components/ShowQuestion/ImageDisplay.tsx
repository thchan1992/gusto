import React from "react";
import Image from "next/image";

export const ImageDisplay = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <>
      {imageUrl !== "" && (
        <div className="m-1 border-2 border-thirdColor rounded-xl">
          <Image
            className="rounded-xl shadow-xl"
            src={imageUrl}
            layout="responsive"
            width={500}
            height={500}
            alt="Question Media"
          />
        </div>
      )}
    </>
  );
};
