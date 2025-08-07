import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FormItem, Form } from "@/components/ui/Form";
import Alert from "@/components/ui/Alert";
import AuthService from "@/services/AuthService";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

type ForgotPasswordFormSchema = {
  phone: string;
};

const validationSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\d+$/, "Only numeric phone numbers are allowed"),
});

const ForgotPasswordForm = () => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
    setSubmitting(true);
    setErrorMessage(null);

    await AuthService.forgotPassword({
      username: values.phone,
    })
      .then((res) => {
        if (res.data.success) {
          navigate("/reset-password", { state: { phone: values.phone } });
        }
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
        setErrorMessage(
          error.response?.data?.message || "An error occurred. Try again."
        );
      });
  };

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-left text-lg font-semibold">Forgot Password</h2>

      {errorMessage && (
        <div className="mb-4">
          <Alert type="danger">{errorMessage}</Alert>
        </div>
      )}

      <Form onSubmit={handleSubmit(onForgotPassword)}>
        <FormItem
          label="Phone Number"
          invalid={Boolean(errors.phone)}
          errorMessage={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                type="tel"
                placeholder="Enter your phone number"
                {...field}
              />
            )}
          />
        </FormItem>
        <Button loading={isSubmitting} variant="solid" type="submit">
          {isSubmitting ? "Sending OTP..." : "Send OTP"}
        </Button>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
