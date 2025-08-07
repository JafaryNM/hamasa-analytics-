import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormItem } from "@/components/ui/Form";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import TextArea from "antd/es/input/TextArea";
import { Card } from "@/components/ui";
import {
  EjatFeedbackFormData,
  EjatFeedbackSchema,
} from "@/schemas/EjatFeedback";

const options = (values: string[]) =>
  values.map((v) => ({ value: v, label: v }));

const JudgeReviewAdd = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EjatFeedbackFormData>({
    resolver: zodResolver(EjatFeedbackSchema),
    defaultValues: {
      experienceRating: "Good",
      criteriaClarity: "Very clear",
      supportReceived: "Yes",
      submissionQuality: "Satisfactory",
      willingToJudge: "Yes",
    },
  });

  const willingToJudge = watch("willingToJudge");
  const journalismState = watch("journalismState");

  const onSubmit = (data: EjatFeedbackFormData) => {
    console.log("Submitted:", data);
  };

  return (
    <Card>
      <Form layout="vertical" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-lg font-semibold mb-4">
          Section A: General Experience
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "experienceRating",
              label:
                "1. Overall, how would you rate your experience serving as a judge in EJAT this year?",
              options: ["Excellent", "Good", "Fair", "Poor"],
            },
            {
              name: "criteriaClarity",
              label: "2. How clear were the judging criteria provided to you?",
              options: [
                "Very clear",
                "Somewhat clear",
                "Not clear",
                "Not applicable",
              ],
            },
            {
              name: "supportReceived",
              label:
                "3. Did you receive sufficient support and guidance from the organizing team?",
              options: ["Yes", "Partially", "No"],
            },
            {
              name: "submissionQuality",
              label:
                "4. How would you rate the quality of submissions you reviewed?",
              options: ["Very high", "Satisfactory", "Mixed", "Generally low"],
            },
          ].map(({ name, label, options }) => (
            <FormItem
              key={name}
              label={label}
              errorMessage={errors[name as keyof typeof errors]?.message}
              invalid={!!errors[name as keyof typeof errors]}
            >
              <Controller
                name={name as keyof EjatFeedbackFormData}
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select"
                    options={options.map((v) => ({ value: v, label: v }))}
                    value={{ value: field.value, label: field.value }}
                    onChange={(option) => field.onChange(option.value)}
                  />
                )}
              />
            </FormItem>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Section B: Judging Process
        </h3>

        <FormItem
          label="5. Were there any challenges or gaps in the judging process you'd like to highlight?"
          errorMessage={errors.challenges?.message}
          invalid={!!errors.challenges}
        >
          <Controller
            name="challenges"
            control={control}
            render={({ field }) => (
              <TextArea
                placeholder="Describe any challenges..."
                rows={4}
                {...field}
              />
            )}
          />
        </FormItem>

        <FormItem
          label="6. Were there any categories you found particularly difficult to evaluate? Why?"
          errorMessage={errors.difficultCategories?.message}
          invalid={!!errors.difficultCategories}
        >
          <Controller
            name="difficultCategories"
            control={control}
            render={({ field }) => (
              <TextArea
                placeholder="Explain your answer..."
                rows={4}
                {...field}
              />
            )}
          />
        </FormItem>

        <h3 className="text-lg font-semibold mt-6 mb-2">
          Section C: Recommendations
        </h3>

        <FormItem
          label="7. What improvements would you suggest for the judging process in future editions?"
          errorMessage={errors.improvements?.message}
          invalid={!!errors.improvements}
        >
          <Controller
            name="improvements"
            control={control}
            render={({ field }) => (
              <TextArea
                placeholder="Your recommendations..."
                rows={4}
                {...field}
              />
            )}
          />
        </FormItem>

        <FormItem
          label="8. Would you be willing to serve as a judge again in future EJAT editions?"
          errorMessage={errors.willingToJudge?.message}
          invalid={!!errors.willingToJudge}
        >
          <Controller
            name="willingToJudge"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Select"
                options={options(["Yes", "No", "Maybe"])}
                value={{ value: field.value, label: field.value }}
                onChange={(option) => field.onChange(option.value)}
              />
            )}
          />
        </FormItem>

        {willingToJudge === "Maybe" && (
          <FormItem
            label="Please explain why you selected 'Maybe'"
            errorMessage={errors.maybeReason?.message}
            invalid={!!errors.maybeReason}
          >
            <Controller
              name="maybeReason"
              control={control}
              render={({ field }) => (
                <TextArea
                  placeholder="Explain your answer..."
                  rows={4}
                  {...field}
                />
              )}
            />
          </FormItem>
        )}

        <FormItem
          label="9. Do you believe journalism is thriving or declining in Tanzania?"
          errorMessage={errors.journalismState?.message}
          invalid={!!errors.journalismState}
        >
          <Controller
            name="journalismState"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Select"
                options={options(["Thriving", "Declining"])}
                value={{ value: field.value, label: field.value }}
                onChange={(option) => field.onChange(option.value)}
              />
            )}
          />
        </FormItem>

        {journalismState === "Declining" && (
          <FormItem
            label="Please explain why you believe journalism is declining"
            errorMessage={errors.reasonForDeclining?.message}
            invalid={!!errors.reasonForDeclining}
          >
            <Controller
              name="reasonForDeclining"
              control={control}
              render={({ field }) => (
                <TextArea placeholder="Your reason..." rows={4} {...field} />
              )}
            />
          </FormItem>
        )}

        {journalismState === "Thriving" && (
          <FormItem
            label="Please explain why you believe journalism is thriving"
            errorMessage={errors.reasonForThriving?.message}
            invalid={!!errors.reasonForThriving}
          >
            <Controller
              name="reasonForThriving"
              control={control}
              render={({ field }) => (
                <TextArea placeholder="Your reason..." rows={4} {...field} />
              )}
            />
          </FormItem>
        )}

        <FormItem>
          <Button variant="solid" type="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
};

export default JudgeReviewAdd;
