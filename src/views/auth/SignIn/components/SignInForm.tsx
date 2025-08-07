import { useRef, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FormItem, Form } from "@/components/ui/Form";
import PasswordInput from "@/components/shared/PasswordInput";
import classNames from "@/utils/classNames";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ZodType } from "zod";
import type { CommonProps } from "@/@types/common";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import { IsolatedNavigatorRef } from "@/auth/AuthProvider";
import appConfig from "@/configs/app.config";
import { User } from "@/@types/auth";
import AuthService from "@/services/AuthService";

interface LoginFormProps extends CommonProps {
  disableSubmit?: boolean;
  passwordHint?: string | ReactNode;
  setMessage?: (message: string) => void;
}

type LoginFormSchema = {
  username: string;
  password: string;
};

const validationSchema: ZodType<LoginFormSchema> = z.object({
  username: z
    .string({ required_error: "Please enter your email or phone number" })
    .min(1, { message: "Please enter your email or phone number" })
    .refine((val) => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10,15}$/.test(val), {
      message: "Enter a valid email or phone number",
    }),
  password: z
    .string({ required_error: "Please enter your password" })
    .min(1, { message: "Please enter your password" }),
});

const LoginForm = (props: LoginFormProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navigatorRef = useRef<IsolatedNavigatorRef>(null);

  const { disableSubmit = false, className, setMessage, passwordHint } = props;
  const { loginSuccessfully } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginFormSchema>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(validationSchema),
  });

  const redirect = () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const redirectUrl = params.get(REDIRECT_URL_KEY);

    navigatorRef.current?.navigate(
      redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
    );
  };
  const onLogin = async (values: LoginFormSchema) => {
    const { username, password } = values;

    if (disableSubmit) return;

    setSubmitting(true);

    try {
      console.log(username, password);

      const response = await AuthService.login({ username, password });
      const resData = response.data;
      console.log(resData);

      // ✅ If user is not verified, redirect to OTP with phone/email
      if (resData.success === false && resData.codeName === "not-verified") {
        const phone = resData?.phone || username;
        const email = resData?.email || null;

        navigate("/otp-verification", {
          state: {
            phone,
            email,
          },
        });
        return;
      }

      // ✅ If login is successful
      if (resData.success === true && resData.token) {
        setMessage?.("Login successful");

        const userInfo = {
          ...resData.user,
          authority: [resData.user?.type],
        } as User;

        await loginSuccessfully({ token: resData.token, user: userInfo });
        redirect();
      } else {
        // ✅ General failure
        setMessage?.(resData.message || "Login failed");
      }
    } catch (error: any) {
      const resData = error?.response?.data;

      if (error.response?.status === 401) {
        if (resData?.codeName === "not-verified") {
          const phone = resData?.phone || username;
          const email = resData?.email || null;

          navigate("/otp-verification", {
            state: {
              phone,
              email,
            },
          });
        } else {
          setMessage?.("Wrong username or password.");
        }
      } else {
        // ✅ Other server/client errors
        setMessage?.(resData?.message || "Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit(onLogin)}>
        <FormItem
          label="Email or Phone"
          invalid={Boolean(errors.username)}
          errorMessage={errors.username?.message}
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Email or Phone"
                autoComplete="off"
                {...field}
              />
            )}
          />
        </FormItem>

        <FormItem
          label="Password"
          invalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          className={classNames(
            passwordHint && "mb-0",
            errors.password?.message && "mb-8"
          )}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                type="password"
                placeholder="Password"
                autoComplete="off"
                {...field}
              />
            )}
          />
        </FormItem>

        {passwordHint}

        <Button
          className="block"
          loading={isSubmitting}
          variant="solid"
          type="submit"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
