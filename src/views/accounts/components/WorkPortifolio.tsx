import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import Button from "@/components/ui/Button";
import { useAuth } from "@/auth";
import { SelectOption } from "@/@types/selectOption";
import journalistService from "@/services/journalistService";
import { WorkingPortfolioData } from "@/schemas/WorkingPortifolioSchema";
import { BiPlus, BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DASHBOARDS_PREFIX_PATH } from "@/constants/route.constant";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";

interface WorkingInfoProps {
  organisationList: SelectOption[];
  occupationList: SelectOption[];
  onNext: () => void;
}

const WorkingPortfolio: React.FC<WorkingInfoProps> = ({
  organisationList,
  occupationList,
  onNext,
}) => {
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext<WorkingPortfolioData>();

  // ✅ Manage multiple articles dynamically
  const { fields, append, remove } = useFieldArray({
    control,
    name: "publishedArticles",
  });

  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: WorkingPortfolioData) => {
    console.log("🚀 Submitted Values:", values);

    const payload = {
      uuid: user.uuid ?? "",
      organizationUuid: values.organization?.value ?? "",
      occupationUuid: values.occupation?.value ?? "",
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      publishedArticles: values.publishedArticles || [],
      linkedinLink: values.linkedinLink?.trim() || null,
      twitterLink: values.twitterLink?.trim() || null,
      facebookLink: values.facebookLink?.trim() || null,
      websiteLink: values.websiteLink?.trim() || null,
    };

    setIsSaving(true);

    journalistService
      .update(payload, `/work-portfolio`)
      .then(() => {
        toast.push(
          <Notification title="Success" type="success">
            Your Registration has been updated successfully.
          </Notification>
        );
        setIsSaving(false);
        navigate(`${DASHBOARDS_PREFIX_PATH}/journalist`);
      })
      .catch((error) => {
        toast.push(
          <Notification title="Error" type="danger">
            Failed To Register
          </Notification>
        );
        setIsSaving(false);
      });
  };

  return (
    <div>
      <h4 className="mb-4 font-semibold text-lg">Working Portfolio</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem label="Media outlet">
            <Controller
              name="organization"
              control={control}
              render={({ field }) => (
                <Select
                  options={organisationList}
                  value={
                    organisationList.find(
                      (opt) => opt.value === field.value?.value
                    ) || field.value
                  }
                  onChange={(selectedOption) => field.onChange(selectedOption)}
                />
              )}
            />
            {errors.organization && (
              <p className="text-red-500 text-sm">
                {errors.organization.message}
              </p>
            )}
          </FormItem>

          <FormItem label="Title">
            <Controller
              name="occupation"
              control={control}
              render={({ field }) => (
                <Select
                  options={occupationList}
                  value={
                    occupationList.find(
                      (opt) => opt.value === field.value?.value
                    ) || field.value
                  }
                  onChange={(selectedOption) => field.onChange(selectedOption)}
                />
              )}
            />
            {errors.occupation && (
              <p className="text-red-500 text-sm">
                {errors.occupation.message}
              </p>
            )}
          </FormItem>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem
            label="Start Date"
            invalid={Boolean(errors.startDate)}
            errorMessage={errors.startDate?.message}
          >
            <Controller
              name="startDate"
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
            label="End Date"
            invalid={Boolean(errors.endDate)}
            errorMessage={errors.endDate?.message}
          >
            <Controller
              name="endDate"
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
        </div>

        <h5 className="mt-4 font-semibold">
          Published Articles (Optional if you have )
        </h5>
        {fields.map((article, index) => (
          <div
            key={article.id}
            className="grid grid-cols-12 gap-4 items-center border-b pb-2"
          >
            {/* Title Input */}
            <div className="col-span-5">
              <FormItem label="Title">
                <Controller
                  name={`publishedArticles.${index}.title`}
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter article title" />
                  )}
                />
              </FormItem>
            </div>

            {/* Link Input */}
            <div className="col-span-5">
              <FormItem label="Link">
                <Controller
                  name={`publishedArticles.${index}.link`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="url"
                      placeholder="Enter article link"
                    />
                  )}
                />
              </FormItem>
            </div>

            {/* Action Buttons - Edit & Delete Icons */}
            <div className="col-span-2 flex justify-center items-center space-x-3">
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-500 hover:text-red-600"
              >
                <BiTrash size={20} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Article Button - Positioned Right */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => append({ title: "", link: "" })}
            className="flex items-center px-4 py-2 text-white bg-green-500 rounded-md"
          >
            <BiPlus size={20} className="mr-2" />
            Add Article
          </button>
        </div>

        {/* Social Media Links */}
        <h5 className="mt-4 font-semibold">
          Social Media Links (Optional if you have)
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem label="LinkedIn Profile">
            <Controller
              name="linkedinLink"
              control={control}
              render={({ field }) => <Input {...field} type="url" />}
            />
          </FormItem>

          <FormItem label="Twitter Profile">
            <Controller
              name="twitterLink"
              control={control}
              render={({ field }) => <Input {...field} type="url" />}
            />
          </FormItem>

          <FormItem label="Facebook Profile">
            <Controller
              name="facebookLink"
              control={control}
              render={({ field }) => <Input {...field} type="url" />}
            />
          </FormItem>

          <FormItem label="Personal Website">
            <Controller
              name="websiteLink"
              control={control}
              render={({ field }) => <Input {...field} type="url" />}
            />
          </FormItem>
        </div>

        {/* Save & Next Button */}
        <div className="flex justify-end mt-6">
          <Button type="submit" variant="solid" loading={isSaving}>
            {isSaving ? "Saving..." : "Submit"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default WorkingPortfolio;
