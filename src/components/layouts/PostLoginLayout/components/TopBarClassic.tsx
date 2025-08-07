import LayoutBase from "@/components//template/LayoutBase";
import useResponsive from "@/utils/hooks/useResponsive";
import { LAYOUT_TOP_BAR_CLASSIC } from "@/constants/theme.constant";
import type { CommonProps } from "@/@types/common";

const TopBarClassic = ({ children }: CommonProps) => {
  const { larger, smaller } = useResponsive();

  return (
    <LayoutBase
      type={LAYOUT_TOP_BAR_CLASSIC}
      className="app-layout-top-bar-classic flex flex-auto flex-col min-h-screen"
    >
      <div className="flex flex-auto min-w-0">
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
          {children}
        </div>
      </div>
    </LayoutBase>
  );
};

export default TopBarClassic;
