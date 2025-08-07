import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Upload from "@/components/ui/Upload";
import Button from "@/components/ui/Button";
import { TbTrash } from "react-icons/tb";

interface DynamicPublishedWorkProps {
  index: number;
  remove: (index: number) => void;
  control: any;
}

const DynamicPublishedWork = ({
  index,
  remove,
  control,
}: DynamicPublishedWorkProps) => {
  const { setValue } = useFormContext();
  const fieldName = `publishedWorks.${index}`;
  const [submissionType, setSubmissionType] = useState<string>("");
  const [linkInputs, setLinkInputs] = useState<string[]>([""]);

  const handleSubmissionTypeChange = (value: string) => {
    setSubmissionType(value);
    if (value === "file") {
      setLinkInputs([""]);
      setValue(`${fieldName}.links`, []);
    } else {
      setValue(`${fieldName}.file`, null);
    }
  };

  const addAnotherLink = () => {
    setLinkInputs((prev) => [...prev, ""]);
  };

  const updateLink = (value: string, i: number) => {
    const newLinks = [...linkInputs];
    newLinks[i] = value;
    setLinkInputs(newLinks);
    setValue(`${fieldName}.links`, newLinks);
  };

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 border p-4 rounded-md bg-gray-50">
      <FormItem label={`Title ${index + 1}`}>
        <Controller
          name={`${fieldName}.title`}
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="e.g. Investigative Story" />
          )}
        />
      </FormItem>

      <div className="flex gap-4">
        <Button
          type="button"
          variant={submissionType === "link" ? "default" : "outline"}
          onClick={() => handleSubmissionTypeChange("link")}
        >
          Provide Attached Link(s)
        </Button>
        <Button
          type="button"
          variant={submissionType === "file" ? "default" : "outline"}
          onClick={() => handleSubmissionTypeChange("file")}
        >
          Upload File
        </Button>
      </div>

      {submissionType === "link" && (
        <>
          {linkInputs.map((link, i) => (
            <FormItem key={i} label={`Attached Link ${i + 1}`}>
              <Input
                value={link ?? ""}
                onChange={(e) => updateLink(e.target.value, i)}
                placeholder="https://example.com/story-link"
              />
            </FormItem>
          ))}
          <div>
            <Button
              type="button"
              variant="outline"
              className="mb-2"
              onClick={addAnotherLink}
            >
              Add Another Link
            </Button>
          </div>
        </>
      )}

      {submissionType === "file" && (
        <FormItem label="Upload Work File">
          <Controller
            name={`${fieldName}.file`}
            control={control}
            render={({ field: { value, onChange } }) => {
              const uploadProps: any = { onChange };
              if (value instanceof File) {
                uploadProps.value = value;
              }
              return <Upload {...uploadProps} />;
            }}
          />
        </FormItem>
      )}

      <div className="text-right">
        <Button
          type="button"
          variant="outline"
          className="text-red-600 border-red-300 hover:bg-red-50"
          onClick={() => remove(index)}
          icon={<TbTrash />}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default DynamicPublishedWork;
