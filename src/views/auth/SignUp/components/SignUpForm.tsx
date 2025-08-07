import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { FormItem, Form } from "@/components/ui/Form";
import { Select } from "@/components/ui";
import DatePicker from "@/components/ui/DatePicker/DatePicker";
import { SignUpSchema, SignUpSchemaType } from "@/schemas/SignUpSchema";
import { useNavigate } from "react-router-dom";

import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import { useAuth } from "@/auth";
import AuthService from "@/services/AuthService";

interface SignUpFormProps {
  disableSubmit?: boolean;
}

const SignUpForm = ({ disableSubmit = false }: SignUpFormProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log(user);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      termsAccepted: false,
    },
  });

  const onSubmit = (data: SignUpSchemaType) => {
    console.log(data);
    setLoading(true);

    AuthService.register(data)
      .then((res) => {
        const user = res.data?.user;

        if (res.data?.success) {
          if (!user?.verifiedAt) {
            toast.push(
              <Notification title="Verify Phone" type="success">
                You will receive a token on your phone number.
              </Notification>
            );

            setTimeout(() => {
              navigate("/otp-verification", {
                state: { phone: user.phone, autoResend: true },
              });
            }, 3000);
          } else {
            toast.push(
              <Notification title="Success" type="success">
                Registration complete. You may now sign in.
              </Notification>
            );

            setTimeout(() => {
              navigate("/login");
            }, 3000);
          }
        } else {
          toast.push(
            <Notification title="Signup Failed" type="danger">
              {res.data?.message || "Signup failed. Please try again."}
            </Notification>
          );
        }
      })
      .catch((error) => {
        toast.push(
          <Notification title="Error" type="danger">
            {error?.response?.data?.message || "An error occurred. Try again."}
          </Notification>
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormItem
          label="First Name"
          invalid={Boolean(errors.firstName)}
          errorMessage={errors.firstName?.message}
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => <Input type="text" {...field} />}
          />
        </FormItem>

        <FormItem
          label="Last Name"
          invalid={Boolean(errors.lastName)}
          errorMessage={errors.lastName?.message}
        >
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => <Input type="text" {...field} />}
          />
        </FormItem>

        <FormItem
          label="Gender"
          invalid={Boolean(errors.gender)}
          errorMessage={errors.gender?.message}
        >
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
                placeholder="Select Gender"
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value)
                }
                value={
                  field.value
                    ? { value: field.value, label: field.value }
                    : null
                }
              />
            )}
          />
        </FormItem>

        <FormItem
          label="Phone Number"
          invalid={Boolean(errors.phone)}
          errorMessage={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => <Input type="tel" {...field} />}
          />
        </FormItem>

        <FormItem
          label="Email"
          invalid={Boolean(errors.email)}
          errorMessage={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input type="email" {...field} />}
          />
        </FormItem>

        <FormItem
          label="Date of Birth"
          invalid={Boolean(errors.birthDate)}
          errorMessage={errors.birthDate?.message}
        >
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                inputFormat="MMM, DD YYYY"
                value={field.value ? new Date(field.value) : undefined}
              />
            )}
          />
        </FormItem>

        <FormItem
          label="Password"
          invalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input type="password" {...field} />}
          />
        </FormItem>

        <FormItem
          label="Confirm Password"
          invalid={Boolean(errors.passwordConfirmation)}
          errorMessage={errors.passwordConfirmation?.message}
        >
          <Controller
            name="passwordConfirmation"
            control={control}
            render={({ field }) => <Input type="password" {...field} />}
          />
        </FormItem>
      </div>

      <FormItem
        invalid={Boolean(errors.termsAccepted)}
        errorMessage={errors.termsAccepted?.message}
      >
        <Controller
          name="termsAccepted"
          control={control}
          render={({ field }) => (
            <div className="flex items-start gap-2 mt-4">
              <Checkbox {...field} checked={field.value} />
              <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  Terms and Conditions
                </a>
                .
              </label>
            </div>
          )}
        />
      </FormItem>

      <div className="flex justify-left mt-6">
        <Button
          type="submit"
          variant="solid"
          disabled={disableSubmit || loading}
        >
          {loading ? "Submitting..." : "Create Account"}
        </Button>
      </div>
    </Form>
  );
};

export default SignUpForm;
