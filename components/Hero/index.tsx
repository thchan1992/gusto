"use client";

const Hero = () => {
  return (
    <>
      <div
        id="home"
        className="bg-gradient-to-b from-primaryColor to-fifthColor relative z-10  overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
      >
        <div className="container ">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 ">
              <div
                className="wow fadeInUp mx-auto max-w-[800px] text-center"
                data-wow-delay=".2s"
              >
                <div className="">
                  <h1 className="mb-5 text-3xl font-bold leading-tight text-thirdColor  sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                    trouble-shush
                  </h1>
                  <h1 className="mb-5 text-3xl font-bold leading-tight text-thirdColor  sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                    where creating custom and free troubleshooters is easier
                    than ever.
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <div className="h-14 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
        </div>
      </div>
    </>
  );
  // }
};

export default Hero;
