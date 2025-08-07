import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { AdaptiveCard, Container } from "@/components/shared";
import TextArea from "antd/es/input/TextArea";
import { BasicApplicationInfoData } from "@/schemas/BasicApplicationInfoSchema";
import { DatePicker, Notification, toast } from "@/components/ui";
import { SelectOption } from "@/@types/selectOption";
import { Award } from "@/@types/award";
import awardService from "@/services/awardService";
import applicationService from "@/services/applicationService";
import Upload from "@/components/ui/Upload";
import { useFieldArray } from "react-hook-form";
import { TbTrash, TbPlus } from "react-icons/tb";
import { useWatch } from "react-hook-form";

import { CanceledError } from "axios";
import DynamicPublishedWork from "./DynamicPublishWork";

interface BasicApplicationFormInfoProps {
  onNext: () => void;
  onPrev: () => void;
  onIsGroupChange: (isGroup: boolean) => void;
  selectAward: Award | null;
  prefilledAward?: Award | null;
  updateFormData: (newData: Record<string, any>) => void;
  isGroup: boolean;
  prefilledData?: Partial<BasicApplicationInfoData>;
  formData: Record<string, any>;
}

const BasicApplicationFormInfo = ({
  onNext,
  onPrev,
  onIsGroupChange,
  selectAward,
  updateFormData,
  isGroup,
  prefilledData,
  prefilledAward,
  formData,
}: BasicApplicationFormInfoProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useFormContext<BasicApplicationInfoData>();

  const [isSaving, setIsSaving] = useState(false);
  const [categoryList, setCategoryList] = useState<SelectOption[]>([]);
  const [localIsGroup, setLocalIsGroup] = useState<string>(
    isGroup ? "true" : "false"
  );
  useEffect(() => {
    if (prefilledData) {
      let isGroupValue = "false";

      // Normalize all possible types
      const isGroupRaw = prefilledData.isGroup;

      if (typeof isGroupRaw === "boolean") {
        isGroupValue = isGroupRaw ? "true" : "false";
      } else if (typeof isGroupRaw === "string") {
        isGroupValue = isGroupRaw === "true" ? "true" : "false";
      } else if (
        typeof isGroupRaw === "object" &&
        isGroupRaw?.value === "true"
      ) {
        isGroupValue = "true";
      }

      const mappedData: Partial<BasicApplicationInfoData> = {
        ...prefilledData,
        isGroup: {
          value: isGroupValue,
          label: isGroupValue === "true" ? "Yes" : "No",
        },
      };

      reset(mappedData);
      setLocalIsGroup(isGroupValue);
    }
  }, [prefilledData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "publishedWorks",
  });

  // WATCH all submissionTypes safely (outside loop)
  const submissionMethods = useWatch({
    control,
    name: "publishedWorks",
  });

  useEffect(() => {
    const activeAward = selectAward || prefilledAward;
    if (!activeAward) return;

    const endpoint = `/categories/${activeAward.uuid}`;
    const { request, cancel } = awardService.list<Award>(
      { page: 1, perPage: 100000 },
      endpoint
    );

    request
      .then((res) => {
        const options = res.data.data.map((item: any) => ({
          label: item.category.name,
          value: item.uuid,
        }));
        setCategoryList(options);

        const prefilledValue = prefilledData?.awardCategoryUuid;
        if (prefilledValue && !getValues("awardCategoryUuid")) {
          setValue("awardCategoryUuid", prefilledValue);
        }
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) {
          console.error("Error fetching categories:", error);
        }
      });

    return () => cancel();
  }, [selectAward, prefilledAward, prefilledData, setValue, getValues]);

  const handleIsGroupChange = (selected: { value: string; label: string }) => {
    setLocalIsGroup(selected.value);
    onIsGroupChange(selected.value === "true");
  };

  const onSubmit = (values: BasicApplicationInfoData) => {
    setIsSaving(true);

    // Prepare data for submission
    const formInfoData = {
      ...values,
      isGroup: localIsGroup === "true",
    };

    // Decide whether to create or update
    const request = formData?.uuid
      ? applicationService.update(
          { ...formInfoData, uuid: formData.uuid },
          "/basic-info"
        )
      : applicationService.create(formInfoData);

    request
      .then((response) => {
        const res = response.data;

        // If backend returns error but no throw
        if (!res.success) {
          toast.push(
            <Notification type="danger" title="Submission Failed">
              {res.message || "Something went wrong, please try again."}
            </Notification>
          );
          setIsSaving(false);
          return;
        }

        // Fallback in case res.data is missing
        const updatedOrCreatedData = res.data || { uuid: formData?.uuid };

        // Update shared formData state
        updateFormData({
          ...formInfoData,
          uuid: updatedOrCreatedData.uuid,
          status: updatedOrCreatedData.status ?? "draft",
          currentStage: localIsGroup === "true" ? "collaborator" : "mediaInfo",
        });

        toast.push(
          <Notification type="success" title="Application Submitted">
            Your basic information has been{" "}
            {formData?.uuid ? "updated" : "submitted"} successfully.
          </Notification>
        );

        setIsSaving(false);
        onNext(); // move to next step
      })
      .catch((error) => {
        x;
        toast.push(
          <Notification type="danger" title="Submission Failed">
            {error.response?.data?.message ||
              "Something went wrong, please try again."}
          </Notification>
        );
        setIsSaving(false);
      });
  };

  return (
    <Container>
      <AdaptiveCard>
        <h4 className="mb-4 text-lg font-semibold">Application Submittion</h4>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormItem label="Please Upload Concept Note">
              <Controller
                name="conceptNote"
                control={control}
                render={({ field }) => <Upload {...field} />}
              />
              {errors.conceptNote && (
                <p className="text-red-500 text-sm">
                  {errors.conceptNote.message}
                </p>
              )}
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormItem label="Please Upload Statement Motivation">
              <Controller
                name="motivationStatement"
                control={control}
                render={({ field }) => <Upload {...field} />}
              />
              {errors.motivationStatement && (
                <p className="text-red-500 text-sm">
                  {errors.motivationStatement.message}
                </p>
              )}
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormItem label="How will you use this experience to strengthen public interest reporting in your newsroom">
              <Controller
                name="newsroomExperience"
                control={control}
                render={({ field }) => <Upload {...field} />}
              />
              {errors.newsroomExperience && (
                <p className="text-red-500 text-sm">
                  {errors.newsroomExperience.message}
                </p>
              )}
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormItem label="Why do you want to be part of this fellowship?">
              <Controller
                name="description"
                control={control}
                render={({ field }) => <TextArea {...field} rows={4} />}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </FormItem>
          </div>

          <h4 className="text-lg font-semibold mt-10">
            Published Work Samples
          </h4>

          {fields.map((_, index) => (
            <DynamicPublishedWork
              key={index}
              index={index}
              control={control}
              remove={remove}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            className="mb-6"
            onClick={() =>
              append({ title: "", submissionType: "", link: "", file: null })
            }
            icon={<TbPlus />}
          >
            Add Work Sample
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormItem label="Please Upload Curriculum Vitae (CV)">
              <Controller
                name="cv"
                control={control}
                render={({ field }) => <Upload {...field} />}
              />
              {errors.cv && (
                <p className="text-red-500 text-sm">{errors.cv.message}</p>
              )}
            </FormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormItem label="Upload Recommendation Letter (Optional)">
              <Controller
                name="recommendationLetter"
                control={control}
                render={({ field }) => <Upload {...field} />}
              />
            </FormItem>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormItem>
              <Controller
                name="declaration"
                control={control}
                render={({ field }) => (
                  <label className="flex items-start gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <span>
                      I hereby declare that the information provided is accurate
                      and true to the best of my knowledge.
                    </span>
                  </label>
                )}
              />
              {errors.declaration && (
                <p className="text-red-500 text-sm">
                  {errors.declaration.message}
                </p>
              )}
            </FormItem>
          </div>

          <div className="flex justify-between mt-6">
            <Button type="button" onClick={onPrev}>
              Previous
            </Button>
            <Button type="submit" variant="solid" loading={isSaving}>
              {isSaving ? "Saving..." : "Submit Your Application"}
            </Button>
          </div>
        </Form>
      </AdaptiveCard>
    </Container>
  );
};

export default BasicApplicationFormInfo;
