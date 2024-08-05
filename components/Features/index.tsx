import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section
        id="about"
        className="bg-gradient-to-b from-secondaryColor to-fourthColor py-16 md:py-20 lg:py-28"
      >
        <div className="container">
          <SectionTitle
            title="Features"
            paragraph="The ultimate tool for creating and sharing troubleshooting manuals. Our platform empowers you to design lightweight, step-by-step guides that simplify complex troubleshooting processes."
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
