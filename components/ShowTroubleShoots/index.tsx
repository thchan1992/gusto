"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "../Button";

const ShowTroubleShoots = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [troubleshootList, setTroubleshootList] = useState([]);

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
                      <Link href={"/show_troubleshoot/" + troubleshoot._id}>
                        <div className="card-body">{troubleshoot.title}</div>
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
