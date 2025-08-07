import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpVerificationForm from "./components/OtpVerificationForm";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import { useAuth } from "@/auth";
import AuthService from "@/services/AuthService";

export const OtpVerificationBase = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const phone: string = location.state?.phone || "";
  const [loading, setLoading] = useState(false);

  console.log(user);

  const handleResendOtp = async () => {
    if (!phone) {
      toast.push(
        <Notification title="Missing Phone" type="danger">
          Phone number is missing.
        </Notification>
      );
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.resendOtp({ username: phone });

      if (response.data?.success === true) {
        toast.push(
          <Notification title="OTP Sent" type="success">
            {response.data.message || "A new OTP has been sent to your phone."}
          </Notification>
        );
      } else {
        toast.push(
          <Notification title="Resend Failed" type="danger">
            {response.data?.message || "Failed to resend OTP."}
          </Notification>
        );
      }
    } catch (error: any) {
      toast.push(
        <Notification title="Error" type="danger">
          {error?.response?.data?.message || "Error resending OTP. Try again."}
        </Notification>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="mb-2">OTP Verification</h3>
        <p className="font-semibold heading-text">
          A One Time OTP token has been sent to your phone number:{" "}
          <strong>{phone}</strong>
        </p>
      </div>

      <OtpVerificationForm phone={phone} />

      <div className="mt-4 text-center">
        <span className="font-semibold">Didn't receive OTP? </span>
        <button
          className="heading-text font-bold underline"
          onClick={handleResendOtp}
          disabled={loading}
        >
          {loading ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

const OtpVerification = () => {
  return <OtpVerificationBase />;
};

export default OtpVerification;
