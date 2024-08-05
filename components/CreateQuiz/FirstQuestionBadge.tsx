import React from "react";

export const FirstQuestionBadge = () => {
  return (
    <div className="flex justify-end">
      <div className="relative group">
        <div className="badge badge-warning gap-2 mt-3 hover:bg-yellow-600 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-4 w-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          First question cannot be removed.
        </div>
        {/* <div className="absolute right-full top-1/2 transform -translate-y-1/2 ml-1 hidden w-32 p-2 m-2 bg-gray-800 text-red text-sm rounded-md group-hover:block">
                                    First question cannot be removed.
                                  </div> */}
      </div>
    </div>
  );
};
