import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/ui/Button";
import { FormItem, Form } from "@/components/ui/Form";
import OtpInput from "@/components/shared/OtpInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface OtpResetFormProps {
    setOtpToken: (token: string) => void;
}

type OtpFormSchema = {
    otp: string;
};

const OTP_LENGTH = 6;

const validationSchema = z.object({
    otp: z.string().length(OTP_LENGTH, { message: "Enter a valid OTP" }),
});

const OtpResetForm = ({ setOtpToken }: OtpResetFormProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const phone = location.state?.phone;
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const { handleSubmit, formState: { errors }, control } = useForm<OtpFormSchema>({
        resolver: zodResolver(validationSchema),
    });

    const onOtpSubmit = async (values: OtpFormSchema) => {
        setSubmitting(true);

        try {
            setOtpToken(values.otp); // ✅ Store OTP for password reset step
            navigate("/reset-password", { state: { phone, otpToken: values.otp } }) // ✅ Move to password reset step
        } catch (error: any) {
            alert(error.response?.data?.message || "Invalid OTP.")
        }

        setSubmitting(false);
    };

    return (
        <div className="max-w-md mx-auto mt-6 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-center text-lg font-semibold">Enter OTP</h2>

            <Form onSubmit={handleSubmit(onOtpSubmit)}>
                <FormItem invalid={Boolean(errors.otp)} errorMessage={errors.otp?.message}>
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field }) => (
                            <OtpInput placeholder="Enter OTP" length={OTP_LENGTH} {...field} />
                        )}
                    />
                </FormItem>
                <Button block loading={isSubmitting} variant="solid" type="submit">
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                </Button>
            </Form>
        </div>
    );
};

export default OtpResetForm;
