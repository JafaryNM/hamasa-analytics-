import { useNavigate } from "react-router-dom";
import { Button, Select, Form, FormItem } from "@/components/ui";
import { AdaptiveCard, Container } from "@/components/shared";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MediaInfoSchema, MediaInfoData } from "@/schemas/MediaInfoSchema";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import applicationService from "@/services/applicationService";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import { useState } from "react";
import { BsTrash } from "react-icons/bs";

interface MediaInfoProps {
  MediaList: { label: string; value: string }[];
  formData: Record<string, any>;
  onUpdateFormData: (data: Record<string, any>) => void;
  onPrev: () => void;
  isGroup: boolean;
}

const MediaInfo = ({
  MediaList,
  formData,
  onUpdateFormData,
  onPrev,
  isGroup,
}: MediaInfoProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [submissionMethod, setSubmissionMethod] = useState<
    "file" | "link" | null
  >("file");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MediaInfoData>({
    resolver: zodResolver(MediaInfoSchema),
    defaultValues: {
      mediaChannelUuid: formData.mediaChannelUuid || "",
      fileMediaWork: "",
      attachedLinks: formData.attachedLinks || [{ title: "", link: "" }],
      editorReferences: formData.editorReferences || undefined,
    },
  });

  const onSubmit = (values: MediaInfoData) => {
    const isUpdating = !!formData?.uuid;
    const applicationUuid = formData?.uuid;

    const formDataToSend = new FormData();
    formDataToSend.append("mediaChannelUuid", values.mediaChannelUuid);
    formDataToSend.append("status", "pending");

    // Add editor reference (if it's a file)
    if (values.editorReferences instanceof File) {
      formDataToSend.append("editorReferences", values.editorReferences);
    }

    // Handle media file
    if (values.fileMediaWork instanceof File) {
      formDataToSend.append("attachments", values.fileMediaWork);
    }

    // Handle published articles
    if (
      Array.isArray(values.attachedLinks) &&
      values.attachedLinks.length > 0
    ) {
      formDataToSend.append(
        "attachedLinks",
        JSON.stringify(values.attachedLinks)
      );
    }

    setLoading(true);

    const request = isUpdating
      ? applicationService.updateFile(
          formDataToSend,
          `/media-info/${applicationUuid}`
        )
      : applicationService.createFile(formDataToSend);

    request
      .then(() => {
        toast.push(
          <Notification type="success" title="Media Submitted">
            Your media has been submitted successfully.
          </Notification>
        );

        onUpdateFormData({
          ...formData,
          mediaChannelUuid: values.mediaChannelUuid,
          fileMediaWork: values.fileMediaWork,
          attachedLinks: values.attachedLinks,
        });

        setTimeout(() => {
          navigate("/applications/all");
        }, 1000);
      })
      .catch((error) => {
        toast.push(
          <Notification type="danger" title="Submission Failed">
            {error.response?.data?.message || "Something went wrong."}
          </Notification>
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container>
      <AdaptiveCard>
        <h4 className="mb-4 text-lg font-semibold">
          Media Submission For Award Assessment
        </h4>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormItem label="Media Type">
            <Controller
              name="mediaChannelUuid"
              control={control}
              render={({ field }) => (
                <Select
                  options={MediaList}
                  value={
                    MediaList.find((opt) => opt.value === field.value) || null
                  }
                  onChange={(opt) => field.onChange(opt?.value || "")}
                />
              )}
            />
            {errors.mediaChannelUuid && (
              <p className="text-red-500 text-sm">
                {errors.mediaChannelUuid.message}
              </p>
            )}
          </FormItem>

          <FormItem label="Choose Submission Method">
            <div className="flex gap-4">
              <Button
                type="button"
                variant={submissionMethod === "file" ? "solid" : "outline"}
                onClick={() => {
                  setSubmissionMethod("file");
                  setValue("attachedLinks", undefined);
                }}
              >
                Upload File
              </Button>
              <Button
                type="button"
                variant={submissionMethod === "link" ? "solid" : "outline"}
                onClick={() => {
                  setSubmissionMethod("link");
                  setValue("fileMediaWork", undefined);
                }}
              >
                Online Media Work URL
              </Button>
            </div>
          </FormItem>

          {submissionMethod === "file" && (
            <FormItem label="Upload Your Work File">
              <Controller
                name="fileMediaWork"
                control={control}
                render={({ field }) => (
                  <Upload
                    beforeUpload={() => false}
                    fileList={
                      field.value && field.value instanceof File
                        ? [{ name: field.value.name, uid: "-1" }]
                        : []
                    }
                    onChange={({ fileList }) => {
                      const file = fileList[0]?.originFileObj || fileList[0];
                      if (file instanceof File) {
                        field.onChange(file);
                      }
                    }}
                    onRemove={() => field.onChange("")}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Upload File</Button>
                  </Upload>
                )}
              />
              {errors.fileMediaWork && (
                <p className="text-red-500 text-sm">
                  {errors.fileMediaWork.message}
                </p>
              )}
            </FormItem>
          )}

          {submissionMethod === "link" && (
            <FormItem label="Online Media Work URL">
              <Controller
                name="attachedLinks"
                control={control}
                render={({ field }) => (
                  <>
                    {(field.value || [{}]).map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-end border-b border-gray-200 pb-4 mb-4"
                      >
                        <div className="col-span-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Story Title
                          </label>
                          <input
                            className="w-full rounded border px-3 py-2"
                            placeholder="e.g. Investigative Story on Health"
                            value={item.title || ""}
                            onChange={(e) => {
                              const updated = [...(field.value || [])];
                              updated[index] = {
                                ...updated[index],
                                title: e.target.value,
                              };
                              field.onChange(updated);
                            }}
                          />
                        </div>

                        <div className="col-span-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Online Media Work URL
                          </label>
                          <input
                            className="w-full rounded border px-3 py-2"
                            placeholder="https://example.com/article"
                            value={item.link || ""}
                            onChange={(e) => {
                              const updated = [...(field.value || [])];
                              updated[index] = {
                                ...updated[index],
                                link: e.target.value,
                              };
                              field.onChange(updated);
                            }}
                          />
                        </div>

                        <div className="col-span-2 flex items-center justify-center mt-6">
                          <button
                            type="button"
                            className="text-red-300"
                            onClick={() => {
                              const updated = (field.value || []).filter(
                                (_, i) => i !== index
                              );
                              field.onChange(
                                updated.length
                                  ? updated
                                  : [{ title: "", link: "" }]
                              );
                            }}
                          >
                            <BsTrash />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="mt-2">
                      <button
                        className="bg-green-400 p-3 text-white rounded-md font-bold"
                        onClick={() =>
                          field.onChange([
                            ...(field.value || []),
                            { title: "", link: "" },
                          ])
                        }
                      >
                        + Add Another
                      </button>
                    </div>
                  </>
                )}
              />
              {errors.attachedLinks && (
                <p className="text-red-500 text-sm">
                  {(errors.attachedLinks as any)?.message}
                </p>
              )}
            </FormItem>
          )}

          <FormItem label="Editor Reference Letter (PDF)">
            <Controller
              name="editorReferences"
              control={control}
              render={({ field }) => (
                <Upload
                  beforeUpload={() => false}
                  fileList={
                    field.value ? [{ name: field.value.name, uid: "-1" }] : []
                  }
                  onChange={({ fileList }) => {
                    const file = fileList[0]?.originFileObj || fileList[0];
                    field.onChange(file);
                  }}
                  onRemove={() => field.onChange(null)}
                  maxCount={1}
                >
                  <Button type="button" icon={<UploadOutlined />}>
                    Upload Editor Reference
                  </Button>
                </Upload>
              )}
            />
            {errors.editorReferences && (
              <p className="text-red-500 text-sm">
                {errors.editorReferences.message}
              </p>
            )}
          </FormItem>

          <div className="mt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Previous
            </Button>
            <Button type="submit" variant="solid" loading={loading}>
              Submit
            </Button>
          </div>
        </Form>
      </AdaptiveCard>
    </Container>
  );
};

export default MediaInfo;
