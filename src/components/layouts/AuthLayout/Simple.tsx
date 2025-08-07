import { cloneElement } from "react";
import Container from "@/components/shared/Container";
import type { ReactNode, ReactElement } from "react";
import type { CommonProps } from "@/@types/common";

interface SimpleProps extends CommonProps {
  content?: ReactNode;
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
  return (
    <div className="h-full bg-gray-300 dark:bg-gray-800 relative">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/images/journalist.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Foreground Content */}
      <Container className="relative z-10 flex flex-col flex-auto items-center justify-center min-w-0 h-full">
        <div className="min-w-[320px] md:min-w-[800px] max-w-[400px]">
          <div>
            {content}
            {children
              ? cloneElement(children as ReactElement, {
                  contentClassName: "text-center",
                  ...rest,
                })
              : null}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Simple;
