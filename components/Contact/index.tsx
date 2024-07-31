import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  return (
    <section
      id="contact"
      className="bg-primaryColor overflow-hidden py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        {/* <div className="-mx-4 flex flex-wrap"> */}
        <div className="w-full px-4  xl:w-10/12">
          <div
            className="wow fadeInUp mb-12 rounded-md bg-thirdColor py-11 px-8 dark:bg-thirdColor sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
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
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-primaryColor dark:shadow-signUp"
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
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-primaryColor dark:shadow-signUp"
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
                      name="message"
                      rows={5}
                      placeholder="Enter your Message"
                      className="w-full resize-none rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-primaryColor dark:shadow-signUp"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full px-4">
                  <button className="rounded-md bg-fifthColor py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                    Submit Ticket
                  </button>
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
