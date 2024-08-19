"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { LoadingSpinner } from "../LoadingSpinner";
import { fetchTroubleShootsApi } from "@/lib/api";

import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";

const ShowTroubleShoots = () => {
  const [troubleshootList, setTroubleshootList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleApiErrors } = useHandleApiErrors();

  const router = useRouter();
  const { signOut } = useAuth();
  const { isSignedIn } = useUser();
  useEffect(() => {
    if (isSignedIn === false) {
      signOut().then(() => router.push("/"));
    }
  }, [isSignedIn, router, signOut]);

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetchTroubleShootsApi();
        const isSuccess = await handleApiErrors(response);
        if (!isSuccess) return;
        const data = await response.json();
        setTroubleshootList(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTroubleShoots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <section
        id="createQuiz"
        className="overflow-hidden py-16 md:py-20 lg:py-28 bg-gradient-to-b from-primaryColor to-fifthColor"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12 ">
              <div
                className=" mb-12 rounded-md bg-primary/[3%] px-8 py-11 dark:bg-gradient-to-b from-thirdColor via-white to-thirdColor sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                data-wow-delay=".15s
              "
              >
                {troubleshootList.length > 0 &&
                  troubleshootList.map((troubleshoot, i) => (
                    <div
                      key={i}
                      className="card w-full bg-base-100 shadow-xl mt-2"
                    >
                      <Link href={"/show_troubleshoot/" + troubleshoot._id}>
                        <div className="card-body">
                          <h1 className="font-extrabold">Title:</h1>{" "}
                          <div className="card-body">{troubleshoot.title}</div>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShowTroubleShoots;
