"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "../Button";

import { useUser, useAuth } from "@clerk/nextjs";
import { fetchTroubleShootsApi } from "@/lib/api";
import useHandleApiErrors from "@/lib/hook/useHandlerApiErrors";
import { LoadingSpinner } from "../LoadingSpinner";
import { createTroubleShootApi } from "@/lib/api";

const CreateTroubleShoot = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [troubleshootList, setTroubleshootList] = useState([]);
  const [troubleshootTitle, setTroubleShootTitle] = useState<string>("");
  const router = useRouter();
  const { signOut } = useAuth();
  const { isSignedIn } = useUser();
  const { handleApiErrors } = useHandleApiErrors();
  useEffect(() => {
    if (isSignedIn === false) {
      signOut().then(() => router.push("/"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        // const response = await fetch("/api/troubleshoot/get_all");
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

  const onCreateTroubleShoot = async () => {
    const response = await createTroubleShootApi(troubleshootTitle);
    const isSuccess = await handleApiErrors(response);
    if (!isSuccess) return;
    if (isSuccess) {
      const result = await response.json();
      router.push("/create_troubleshoot/" + result.data._id);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <section
        id="createQuiz"
        className="overflow-hidden py-16 md:py-20 lg:py-28 bg-gradient-to-b from-primaryColor to-fifthColor"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12 ">
              <div className="flex flex-row justify-between ">
                <input
                  type="text"
                  name="questionText"
                  placeholder="Insert title"
                  value={troubleshootTitle}
                  onChange={(e) => {
                    setTroubleShootTitle(e.target.value);
                  }}
                  className="input input-bordered input-info w-full mb-8 mr-1"
                />
                <button
                  className="btn btn-info w-1/4 mb-8"
                  // title="Create a new troubleshoot"
                  onClick={
                    onCreateTroubleShoot
                    //   async () => {
                    //   const response = await fetch("/api/troubleshoot/create", {
                    //     method: "POST",
                    //     headers: {
                    //       "Content-Type": "application/json",
                    //     },
                    //     body: JSON.stringify({
                    //       title: troubleshootTitle,
                    //     }),
                    //   });

                    //   if (!response.ok) {
                    //     router.push("/error/" + response.status);
                    //     throw new Error(`Error: ${response.statusText}`);
                    //   }
                    //   if (response.ok) {
                    //     const result = await response.json();
                    //     router.push("/create_troubleshoot/" + result.data._id);
                    //   }
                    // }
                  }
                >
                  New trouble-shush
                </button>
              </div>
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
                      <Link href={"/create_troubleshoot/" + troubleshoot._id}>
                        <div className="card-body">
                          {/* <h2 className="card-title">Shoes!</h2> */}
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

export default CreateTroubleShoot;
