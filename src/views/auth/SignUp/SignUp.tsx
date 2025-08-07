import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/template/Logo";
import SignUpForm from "./components/SignUpForm";
import ActionLink from "@/components/shared/ActionLink";
import { useThemeStore } from "@/store/themeStore";
import { useAuth } from "@/auth";
import { Card } from "@/components/ui";

type SignUpProps = {
  disableSubmit?: boolean;
  signInUrl?: string;
};

export const SignUpBase = ({
  signInUrl = "/sign-in",
  disableSubmit,
}: SignUpProps) => {
  const mode = useThemeStore((state) => state.mode);
  const { user, authenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      authenticated &&
      user?.type === "journalist" &&
      user?.verifiedAt === null
    ) {
      navigate("/otp-verification", {
        state: { phone: user.phone, autoResend: true },
      });
    }
  }, [authenticated, user, navigate]);

  return (
    <Card className="w-full  mx-auto text-center">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Logo
          type="streamline"
          mode={mode}
          imgClass="w-[60px]"
          logoWidth={60}
        />
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h3 className="mb-1 text-xl font-semibold">Sign Up</h3>
        <p className="font-medium heading-text">
          Step Into the Future of Journalism with UTPC
        </p>
      </div>

      {/* Form */}
      <SignUpForm disableSubmit={disableSubmit} />

      {/* Footer Link */}
      <div className="mt-6">
        <span>Already have an account? </span>
        <ActionLink
          to={signInUrl}
          className="heading-text font-bold"
          themeColor={false}
        >
          Sign in
        </ActionLink>
      </div>
    </Card>
  );
};

const SignUp = () => {
  return <SignUpBase />;
};

export default SignUp;
