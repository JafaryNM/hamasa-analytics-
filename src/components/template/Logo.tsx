import classNames from "classnames";
import { APP_NAME } from "@/constants/app.constant";
import type { CommonProps } from "@/@types/common";

interface LogoProps extends CommonProps {
  type?: "full" | "streamline";
  mode?: "light" | "dark";
  imgClass?: string;
  logoWidth?: number | string;
}

const LOGO_SRC_PATH = "/img/logo/";

const Logo = (props: LogoProps) => {
  const {
    type = "full",
    mode = "light",
    className,
    imgClass,
    style,
    logoWidth = "auto",
  } = props;

  return (
    <div
      className={classNames("logo", className)}
      style={{
        ...style,
        ...{ width: logoWidth },
      }}
    >
      <div className="flex m-2">
        <img
          className={imgClass}
          src={`${LOGO_SRC_PATH}logo.jpeg`}
          alt={`${APP_NAME} logo`}
        />
        <div className="hidden lg:hidden text-sm font-bold p-2 mx-2">
          HAMASA ANALYTICS
        </div>
      </div>
    </div>
  );
};

export default Logo;
