"use client";

import { getQuiz } from "@/services/getQuiz";
import { useState } from "react";

function DownloadButton() {
  const handleClick = async () => {
    await getQuiz();
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-md bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
    >
      Test Database
    </button>
  );
}

export default DownloadButton;
