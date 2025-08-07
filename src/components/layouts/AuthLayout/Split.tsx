import { cloneElement } from "react";
import type { ReactNode } from "react";
import type { CommonProps } from "@/@types/common";

interface SplitProps extends CommonProps {
  content?: ReactNode;
}

const Split = ({ children, content, ...rest }: SplitProps) => {
  return (
    <div className="grid lg:grid-cols-5 h-full gap-10 bg-white dark:bg-gray-800">
      {/* Left Section */}
      <div
        className="col-span-2  flex-col justify-center items-center hidden lg:flex relative overflow-hidden"
        style={{
          backgroundImage: `url('/img/images/hamasa.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-primary opacity-60"></div>

        {/* Content on top */}
        <div className="relative z-10 flex flex-col items-center  gap-12 p-4 text-white">
          <div className="text-center max-w-[550px]">
            <h1 className="text-3xl font-bold text-white mt-7">
              Monitor, Analyze, Decide
            </h1>
            <p className="opacity-80 mx-auto mt- font-medium">
              Sign in to unlock powerful insights from over 100 media outlets;
              access real-time media insights, track trends, and turn data into
              strategies that drive decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-3 flex flex-col  justify-left items-left">
        <div className="w-full xl:max-w-full  px-8 max-w-[380px]">
          <div className="mb-8 ml-4">{content}</div>
          {children
            ? cloneElement(children as React.ReactElement, {
                ...rest,
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Split;
