import {  z } from "zod";

const OTP_LEGNTH= 6;

const OtpFormSchema = z.object(
    {
        otp:z.string().length(OTP_LEGNTH,{message:"Please enter valid otp"})

    }
);

export type OtpFormSchemaType = z.infer<typeof OtpFormSchema>
export {OtpFormSchema, OTP_LEGNTH}