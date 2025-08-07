import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OtpInput from "@/components/shared/OtpInput";
import { FormItem, Form } from "@/components/ui/Form";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthService from "@/services/authService";
import ActionLink from "@/components/shared/ActionLink";
import Steps from "@/components/ui/Steps";
import { HiCheckCircle } from "react-icons/hi"; // ✅ Import success icon

const OTP_LENGTH = 6;

// ✅ Validation Schema
const validationSchema = z
  .object({
    otp: z.string().length(OTP_LENGTH, { message: "Enter a valid OTP" }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

const ResetPasswordForm = () => {
  const location = useLocation();
  const phone = location.state?.phone;
  const [isSubmitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // ✅ Success message state
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const validateOTP = () => {
    const otp = getValues("otp");
    if (!otp || otp.length !== OTP_LENGTH) {
      setErrorMessage("Please enter a valid OTP.");
      return;
    }
    setErrorMessage(null);
    setStep(1);
  };

  const onSubmit = async (values: { otp: string; password: string; passwordConfirmation: string }) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      // ✅ API call to verify OTP & Reset Password
      await AuthService.resendForgotPasswordToken({
        token: values.otp,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      });

      setSuccessMessage("Password reset successful! Redirecting to sign-in..."); // ✅ Success message
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000); // ✅ Redirect after 3 seconds
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mx-auto mt-6 bg-white p-6">
      {/* ✅ Error Message */}
      {errorMessage && (
        <div className="mb-4">
          <Alert type="danger">{errorMessage}</Alert>
        </div>
      )}

      {/* ✅ Success Message */}
      {successMessage && (
        <div className="mb-4">
         <Alert type="success">{successMessage}</Alert>
        </div>
      )}
      
      <h2 className="text-center text-lg font-semibold mb-4">Reset Password</h2>

      {/* ✅ Steps Navigation */}
      <Steps current={step}>
        <Steps.Item title="Enter OTP" />
        <Steps.Item title="Reset Password" />
      </Steps>

      

      <Form  className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <>
            {/* ✅ OTP Field */}
            <FormItem invalid={Boolean(errors.otp)} errorMessage={errors.otp?.message}>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <OtpInput  length={OTP_LENGTH} {...field} />
                )}
              />
            </FormItem>

            {/* ✅ Next Button */}
            <Button  variant="solid" type="button" onClick={validateOTP}>
              Next
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            {/* ✅ New Password Field */}
            <FormItem
              label="New Password"
              invalid={Boolean(errors.password)}
              errorMessage={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => <Input type="password" placeholder="Enter new password" {...field} />}
              />
            </FormItem>

            {/* ✅ Confirm Password Field */}
            <FormItem
              label="Confirm Password"
              invalid={Boolean(errors.passwordConfirmation)}
              errorMessage={errors.passwordConfirmation?.message}
            >
              <Controller
                name="passwordConfirmation"
                control={control}
                render={({ field }) => <Input type="password" placeholder="Confirm password" {...field} />}
              />
            </FormItem>

            {/* ✅ Submit Button */}
            <Button  loading={isSubmitting} variant="solid" type="submit">
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </Button>
          </>
        )}
      </Form>

      {/* ✅ Back to Sign-in Link */}
      <div className="mt-4 text-center">
        <span>Back to </span>
        <ActionLink to="/sign-in" className="heading-text font-bold" themeColor={false}>
          Sign in
        </ActionLink>
      </div>
    </div>
  );
};

export default ResetPasswordForm;