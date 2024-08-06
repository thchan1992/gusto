"use client";
import { useState } from "react";
import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendEmail = async () => {
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          name: name,
          email: email,
        }),
      });
      if (res.status === 200) {
        setSent(true);
      }
    } catch (e) {
      alert(e);
    }
  };
  return (
    <section
      id="contact"
      className="overflow-hidden bg-primaryColor py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        {/* <div className="-mx-4 flex flex-wrap"> */}
        <div className="w-full px-4  xl:w-10/12">
          <div
            className="wow fadeInUp mb-12 rounded-md bg-thirdColor px-8 py-11 dark:bg-thirdColor sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
            data-wow-delay=".15s
              "
          >
            <h2 className="mb-3 text-2xl font-bold text-primaryColor dark:text-primaryColor sm:text-3xl lg:text-2xl xl:text-3xl">
              Need Help? Open a Ticket
            </h2>
            <p className="mb-12 text-base font-medium text-primaryColor">
              Our support team will get back to you ASAP via email.
            </p>
            <form>
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-sm font-medium text-primaryColor dark:text-primaryColor"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-primaryColor dark:shadow-signUp"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm font-medium text-primaryColor dark:text-primaryColor"
                    >
                      Your Email
                    </label>
                    <input
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-primaryColor dark:shadow-signUp"
                    />
                  </div>
                </div>
                <div className="w-full px-4">
                  <div className="mb-8">
                    <label
                      htmlFor="message"
                      className="mb-3 block text-sm font-medium text-primaryColor dark:text-primaryColor"
                    >
                      Your Message
                    </label>
                    <textarea
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      name="message"
                      rows={5}
                      placeholder="Enter your Message"
                      className="w-full resize-none rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-primaryColor dark:shadow-signUp"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full px-4">
                  {!sent && (
                    <button
                      className="rounded-md bg-fifthColor px-9 py-4 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      onClick={() => {
                        sendEmail();
                      }}
                    >
                      Submit Ticket
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div> */}
        {/* </div> */}
      </div>
    </section>
  );
};

export default Contact;
