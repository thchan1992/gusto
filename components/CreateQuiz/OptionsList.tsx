import React from "react";
import Image from "next/image";
import arrow from "@/assets/arrow.png";
export const OptionsList = ({
  optionList,
  convertQuestionId,
}: {
  optionList: {
    text: string;
    nextQuizId: string;
  }[];
  convertQuestionId: (nextQuizId: string) => string;
}) => {
  return (
    <div>
      {optionList.map((item, i) => {
        return (
          <div
            key={i}
            className="mt-3 rounded-lg border-2 border-primaryColor bg-primaryColor p-5 shadow-xl  hover:border-fourthColor"
          >
            <div className="mb-1 mt-1 text-pretty rounded-lg border-2 border-secondaryColor text-center">
              <div className="rounded-t-lg bg-secondaryColor">
                <h1 className="text-center font-bold text-primaryColor">
                  Answer {i + 1}
                </h1>
              </div>
              <div className="p-1">{item.text}</div>
            </div>
            {convertQuestionId(item.nextQuizId) !== "" && (
              <>
                <div className="flex items-center justify-center">
                  <div className="m-1 flex items-center justify-center rounded-lg border-2 bg-secondaryColor p-1">
                    <h2 className=" font-bold text-black">is linked to</h2>
                    <Image
                      src={arrow}
                      width={50}
                      height={50}
                      alt="Question Media"
                    />
                  </div>
                </div>
                <div className="mb-1 mt-1 text-pretty rounded-lg border-2 border-secondaryColor text-center">
                  <div className="rounded-t-lg bg-secondaryColor">
                    <h1 className="text-center font-bold text-primaryColor">
                      Question
                    </h1>
                  </div>
                  {convertQuestionId(item.nextQuizId)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
