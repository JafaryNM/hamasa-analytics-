import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { FormItem, Form } from "@/components/ui/Form";
import OtpInput from "@/components/shared/OtpInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OTP_LEGNTH, OtpFormSchema, OtpFormSchemaType } from "@/schemas/OTPFormSchema";
import authService from "@/services/authService";

// ✅ Toast & Notification
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";

interface OtpVerificationFormProps {
  phone: string;
}

const OtpVerificationForm = ({ phone }: OtpVerificationFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<OtpFormSchemaType>({
    resolver: zodResolver(OtpFormSchema),
  });

  const onOtpSubmit = async (values: OtpFormSchemaType) => {
    if (!phone) {
      toast.push(
        <Notification title="Missing Phone Number" type="danger">
          Phone number is missing.
        </Notification>
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await authService.verifyAccount({
        phone,
        token: values.otp,
      });

      if (response.data.success) {
        toast.push(
          <Notification title="OTP Verified" type="success">
            ✅ OTP Verified Successfully! Redirecting to sign-in...
          </Notification>
        );

        // ✅ Store redirect URL
        localStorage.setItem("redirectAfterLogin", "/dashboards/applicants");

        // ✅ Redirect to sign-in page after 2 seconds
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      } else {
        toast.push(
          <Notification title="Verification Failed" type="danger">
            {response.data.message || "❌ OTP verification failed."}
          </Notification>
        );
      }
    } catch (error: any) {
      toast.push(
        <Notification title="Error" type="danger">
          {error?.response?.data?.message || "❌ Invalid OTP. Try again."}
        </Notification>
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-left text-lg font-semibold">Enter OTP</h2>

      <Form onSubmit={handleSubmit(onOtpSubmit)}>
        <FormItem
          invalid={Boolean(errors.otp)}
          errorMessage={errors.otp?.message}
        >
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <OtpInput
                placeholder=""
                inputClass="h-[58px]"
                length={OTP_LEGNTH}
                {...field}
              />
            )}
          />
        </FormItem>

        <Button loading={isSubmitting} variant="solid" type="submit">
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>
      </Form>
    </div>
  );
};

export default OtpVerificationForm;
