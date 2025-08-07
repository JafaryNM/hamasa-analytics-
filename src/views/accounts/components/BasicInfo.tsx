import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Form, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import districtService from "@/services/districtService";
import journalistService from "@/services/journalistService";
import { CanceledError } from "axios";
import Button from "@/components/ui/Button";
import { BasicInfoData } from "@/schemas/BasicInfoSchema";
import { SelectOption } from "@/@types/selectOption";
import { useAuth } from "@/auth";
import { District } from "@/@types/district";
import { FcImageFile } from "react-icons/fc";
import Avatar from "@/components/ui/Avatar";
import Upload from "@/components/ui/Upload";
import { HiOutlinePlus } from "react-icons/hi";

const BasicInfo = ({
  regions,
  onNext,
}: {
  regions: SelectOption[];
  onNext: () => void;
}) => {
  const { user } = useAuth();
  const {
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext<BasicInfoData>();
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [region, setRegion] = useState("");

  useEffect(() => {
    console.log(region);
    if (region) {
      setDistricts([]); // Clear previous districts
      const { request, cancel } = districtService.listByItem(
        region,
        { page: 1, perPage: 1000 },
        "/region"
      );

      request
        .then((res) => {
          setDistricts(
            res.data.data.map((dist: District) => ({
              label: dist.name,
              value: dist.uuid,
            }))
          );
        })
        .catch((error) => {
          if (error instanceof CanceledError) return;
          console.error("Error fetching districts:", error);
        });

      return () => cancel();
    }
  }, [region]);

  const onSubmit = async (values: BasicInfoData) => {
    console.log(values);
    setIsSaving(true);
    const payload = {
      uuid: user.uuid ?? "",
      firstName: values.firstName,

      middleName: values.middleName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      gender: values.gender,
      birthDate: values.dateOfBirth,
      regionUuid: values.region?.value ?? "",
      districtUuid: values.district?.value ?? "",
      profilePicture: values.profilePicture,
    };

    journalistService
      .updateFile(payload, `/${payload.uuid}`)
      .then((res) => {
        setIsSaving(false);
        onNext();
      })
      .catch((error) => {
        setIsSaving(false);
        console.log(error);
      });
  };

  return (
    <div>
      <h4 className="mb-4">Basic Information</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Profile Picture Upload */}
        <div className="mb-6">
          <FormItem label="Profile Picture">
            <Controller
              name="profilePicture"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
                  className="cursor-pointer"
                  showList={false}
                  uploadLimit={1}
                  beforeUpload={(files: FileList | null) => {
                    let valid: string | boolean = true;
                    const allowedFileType = ["image/jpeg", "image/png"];
                    if (files) {
                      for (const file of files) {
                        if (!allowedFileType.includes(file.type)) {
                          valid = "Please upload a .jpeg or .png file!";
                        }
                      }
                    }
                    return valid;
                  }}
                  onChange={(files: File[]) => {
                    if (files.length > 0) {
                      const file = files[0];
                      onChange(file); // update the react-hook-form field directly
                    }
                  }}
                >
                  <Avatar
                    size={80}
                    src={
                      value
                        ? typeof value === "string"
                          ? value // Already an uploaded URL
                          : value instanceof File
                            ? URL.createObjectURL(value) // New selected File
                            : undefined
                        : undefined
                    }
                    icon={<HiOutlinePlus />}
                  />
                </Upload>
              )}
            />
          </FormItem>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <FormItem label="First Name">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </FormItem>

          {/* Middle Name */}
          <FormItem label="Middle Name">
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </FormItem>

          {/* Last Name */}
          <FormItem label="Last Name">
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </FormItem>

          {/* Email */}
          <FormItem label="Email">
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input type="email" {...field} />}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </FormItem>

          <FormItem
            label="Date of Birth"
            invalid={Boolean(errors.dateOfBirth)}
            errorMessage={errors.dateOfBirth?.message}
          >
            <Controller
              name="dateOfBirth"
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

          {/* Phone */}
          <FormItem label="Phone">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => <Input type="tel" {...field} />}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </FormItem>

          {/* Gender */}
          <FormItem label="Gender">
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
                  value={
                    field.value
                      ? { value: field.value, label: field.value }
                      : null
                  }
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value)
                  }
                />
              )}
            />
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </FormItem>

          {/* Region Selection */}
          <FormItem label="Region">
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <Select
                  options={regions}
                  {...field}
                  onChange={(selectedOption) => {
                    setRegion(selectedOption?.value ?? "");
                    // setValue('district', ''); // Reset district when region changes
                    field.onChange(selectedOption);
                  }}
                />
              )}
            />
            {errors.region && (
              <p className="text-red-500 text-sm">{errors.region.message}</p>
            )}
          </FormItem>

          {/* District Selection */}
          <FormItem label="District">
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <Select
                  options={districts}
                  // value={districts.find((option) => option.value === field.value) || null}
                  // onChange={(selectedOption) => field.onChange(selectedOption?.value || '')}
                  isDisabled={!region}
                  {...field}
                />
              )}
            />
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district.message}</p>
            )}
          </FormItem>
        </div>

        {/* Save & Next Button */}
        <div className="flex justify-end mt-6">
          <Button type="submit" variant="solid" loading={isLoading}>
            {isSaving || isLoading ? "Saving..." : "Save & Next"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BasicInfo;
