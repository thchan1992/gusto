"use client";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import OfferList from "./OfferList";
import PricingBox from "./PricingBox";
import { useRouter } from "next/navigation";
const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const router = useRouter();
  return (
    <section
      id="pricing"
      className="relative z-10 bg-thirdColor py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Simple and Affordable Pricing"
          // paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          paragraph=""
          center
          width="665px"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-1 lg:grid-cols-3">
          <PricingBox
            buttonText="Start building"
            onPress={() => {
              router.push("/create_troubleshoot");
            }}
            packageName="Free"
            // price={isMonthly ? "40" : "120"}
            price="0"
            duration={"Manual"}
            subtitle="Great way to experience our services for free."
          >
            <OfferList
              text="Enojoys three free troubleshoot manuals"
              status="active"
            />
            <OfferList
              text="Each manual comes with 10 maximum steps"
              status="active"
            />
          </PricingBox>
          <PricingBox
            buttonText="Start building"
            onPress={() => {
              router.push("/create_troubleshoot");
            }}
            packageName="Premium"
            price={"1.99"}
            duration={"Manual"}
            subtitle="Get more stuffs done in your manual."
          >
            <OfferList
              text="Each manual comes with 100 maximum steps"
              status="active"
            />
            <OfferList text="Can be shared with other people" status="active" />
            {/* <OfferList text="Commercial Use" status="active" /> */}
            {/* <OfferList text="Email Support" status="active" />
            <OfferList text="Lifetime Access" status="active" />
            <OfferList text="Free Lifetime Updates" status="inactive" /> */}
          </PricingBox>
          <PricingBox
            buttonText="Contact us"
            onPress={() => {
              router.push("/#contact");
            }}
            packageName="Ultra"
            price={"100"}
            duration={"Manual"}
            subtitle="Total control on your manual."
          >
            <OfferList
              text="Unlimited steps with extra functionalities"
              status="active"
            />
            <OfferList text="Can be shared with other people" status="active" />
          </PricingBox>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-[-1]">
        <svg
          width="239"
          height="601"
          viewBox="0 0 239 601"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="-184.451"
            y="600.973"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -184.451 600.973)"
            fill="url(#paint0_linear_93:235)"
          />
          <rect
            opacity="0.3"
            x="-188.201"
            y="385.272"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(-128.7 -188.201 385.272)"
            fill="url(#paint1_linear_93:235)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_93:235"
              x1="-90.1184"
              y1="420.414"
              x2="-90.1184"
              y2="1131.65"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="thirdColor" />
              <stop offset="1" stopColor="primaryColor" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="thirdColor" />
              <stop offset="1" stopColor="primaryColor" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
