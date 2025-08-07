import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import { Form, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/views/ui-components/forms/Input/Textarea";
import Button from "@/components/ui/Button";
import { useAuth } from "@/auth";
import { SelectOption } from "@/@types/selectOption";
import { ProfessionalInfoData } from "@/schemas/ProfessionalInfoSchema";
import journalistService from "@/services/journalistService";

interface ProfessionalInfoProps {
  educationLevelList: SelectOption[];
  expertiseList: SelectOption[];
  onNext: () => void;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  educationLevelList,
  expertiseList,
  onNext,
}) => {
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext<ProfessionalInfoData>();

  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (values: ProfessionalInfoData) => {
  
    const payload = {
      uuid: user.uuid ?? "",
      bio: values.bio || "", 
      experience: Number(values.experience) || 0,
      expertise: values.expertise || [], // 
    
      eduSchool: values.eduSchool || "", 
      eduCompletionYear: values.eduCompletionYear || "", 
      educationLevelUuid:  values.educationLevel?.uuid,
  
    };

        journalistService.update(payload, `/expertise`)
        .then((res)=>{
            setIsSaving(false);
            onNext();
    
        }).catch((error)=>{
            setIsSaving(false);
            console.log(error)
        });
    
    
    setIsSaving(true);
  };

  return (
    <div>
      <h4 className="mb-4">Professional Information</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Bio */}
          <FormItem label="Bio (Short Introduction)">
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Describe your expertise" rows={4} />
              )}
            />
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message as string}</p>}
          </FormItem>

          {/* Expertise (Multi-select) */}
          <FormItem label="Expertise">
            <Controller
              name="expertise"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  options={expertiseList}
                  value={expertiseList.filter(option => field.value?.includes(option.value))}
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions.map(option => option.value);
                    setValue("expertise", selectedValues);
                    field.onChange(selectedValues);
                  }}
                />
              )}
            />
            {errors.expertise && <p className="text-red-500 text-sm">{errors.expertise.message as string}</p>}
          </FormItem>

          {/* Experience (Years) */}
          <FormItem label="Years of Experience">
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min="0"
                  placeholder="Enter years of experience"
                  onChange={(e) => {
                    const value = e.target.value;
                    const numericValue = value ? Number(value) : 0;
                    field.onChange(numericValue);
                  }}
                />
              )}
            />
            {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message as string}</p>}
          </FormItem>

          {/* Education Level */}
          <FormItem label="Education Level">
            <Controller
              name="educationLevel"
              control={control}
              render={({ field }) => (
                <Select
                  options={educationLevelList}
                  value={
                    educationLevelList.find(option => option.value === field.value?.uuid) || null
                  }
                  onChange={(selectedOption) => {
                    const selectedValue = selectedOption
                      ? { uuid: selectedOption.value, name: selectedOption.label }
                      : null;
                    setValue("educationLevel", selectedValue);
                    field.onChange(selectedValue);
                  }}
                />
              )}
            />
            {errors.educationLevel && <p className="text-red-500 text-sm">{errors.educationLevel.message as string}</p>}
          </FormItem>

          {/* School Name */}
          <FormItem label="School / Institution">
            <Controller
              name="eduSchool"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter school name" />}
            />
            {errors.eduSchool && <p className="text-red-500 text-sm">{errors.eduSchool.message as string}</p>}
          </FormItem>

          {/* Completion Year */}
          <FormItem label="Year of Completion">
            <Controller
              name="eduCompletionYear"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Enter year"
                />
              )}
            />
            {errors.eduCompletionYear && <p className="text-red-500 text-sm">{errors.eduCompletionYear.message as string}</p>}
          </FormItem>
        </div>

        {/* Save & Next Button */}
        <div className="flex justify-end mt-6">
          <Button type="submit" variant="solid" loading={isSaving}>
            {isSaving ? "Saving..." : "Save & Next"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfessionalInfo;
