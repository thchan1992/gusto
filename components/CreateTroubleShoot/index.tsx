"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "../Button";

const CreateTroubleShoot = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [troubleshootList, setTroubleshootList] = useState([]);
  const [troubleshootTitle, setTroubleShootTitle] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetch("/api/troubleshoot/get_all");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        setTroubleshootList(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTroubleShoots();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <section
        id="createQuiz"
        className="overflow-hidden py-16 md:py-20 lg:py-28 "
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-7/12 xl:w-8/12 ">
              <div className="flex flex-row justify-between ">
                <input
                  type="text"
                  name="questionText"
                  placeholder="Title for troubleshoot"
                  value={troubleshootTitle}
                  onChange={(e) => {
                    setTroubleShootTitle(e.target.value);
                  }}
                  className="input input-bordered input-primary w-full mb-8 mr-1"
                />
                <button
                  className="btn btn-primary w-1/4 mb-8"
                  // title="Create a new troubleshoot"
                  onClick={async () => {
                    const response = await fetch("/api/troubleshoot/create", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        title: troubleshootTitle,
                      }),
                    });
                    if (response.ok) {
                      const result = await response.json();

                      router.push("/create_troubleshoot/" + result.data._id);
                    }
                  }}
                >
                  Create a new troubleshoot
                </button>

                {/* <input
                  type="text"
                  name="questionText"
                  placeholder="Title for troubleshoot"
                  className="mt-5 w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                  value={troubleshootTitle}
                  onChange={(e) => {
                    setTroubleShootTitle(e.target.value);
                  }}
                /> */}
              </div>
              <div
                className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] px-8 py-11 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                data-wow-delay=".15s
              "
              >
                {troubleshootList.length > 0 &&
                  troubleshootList.map((troubleshoot, i) => (
                    <div
                      key={i}
                      className="card w-96 bg-base-100 shadow-xl mt-2"
                    >
                      <Link href={"/create_troubleshoot/" + troubleshoot._id}>
                        <div className="card-body">
                          {/* <h2 className="card-title">Shoes!</h2> */}
                          {troubleshoot.title}
                        </div>
                      </Link>
                    </div>
                    // <div key={i}>
                    //   <Link href={"/create_troubleshoot/" + troubleshoot._id}>
                    //     {troubleshoot.title}
                    //   </Link>
                    // </div>
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
