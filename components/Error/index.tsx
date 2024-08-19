"use client";

const ErrorMessage = ({
  title,
  message,
  code,
}: {
  title: string;
  message: string;
  code: string;
}) => {
  return (
    <>
      <h3 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
        {title} X {code}
      </h3>
      <p className="mb-10 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
        {message}
      </p>
    </>
  );
};

export default ErrorMessage;
