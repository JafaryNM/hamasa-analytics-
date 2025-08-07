import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import { TbFileDownload } from "react-icons/tb";
import applicationService from "@/services/applicationService";
import awardApplicationScoreService from "@/services/awardApplicationScoreService";

import { ApplicationAward } from "@/@types/applicationAward";
import { FormRecord } from "@/@types/formRecord";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loading from "@/components/shared/Loading";
import Card from "@/components/ui/Card";
import Dialog from "@/components/ui/Dialog";
import { Input, Button, Tag } from "@/components/ui";
import { Form, FormItem } from "@/components/ui/Form";
import awardService from "@/services/awardService";
import { AwardCriteria } from "@/@types/award";
import { CanceledError } from "axios";
import { JudgeScore } from "../../@types/juidgeScore";
import {
  JudgeApplicationReviewSchema,
  JudgeApplicationReviewForm,
} from "@/schemas/JudgeScoreSchema";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";

// Helper function to handle file types
const determineFileType = (url: string): string => {
  const ext = url.split(".").pop()?.toLowerCase();
  if (!ext) return "file";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
    return "image";
  if (["mp4", "avi", "mov", "mkv", "wmv"].includes(ext)) return "video";
  if (["pdf"].includes(ext)) return "pdf";
  return "file";
};

const FileViewer = ({
  attachment,
}: {
  attachment: { url: string; type: string; title?: string };
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [judgeScoreFi]

  const fileType = determineFileType(attachment.url);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) =>
    setNumPages(numPages);

  if (fileType === "image") {
    return (
      <>
        <img
          src={attachment.url}
          alt="Attachment"
          className="w-full h-auto object-cover rounded-md cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-4 flex justify-center">
            <img
              src={attachment.url}
              alt="Preview"
              className="max-w-md rounded-lg"
            />
          </div>
        </Dialog>
      </>
    );
  }

  if (fileType === "video") {
    return (
      <video controls className="w-full h-40 rounded-md">
        <source src={attachment.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (fileType === "pdf") {
    return (
      <div className="border rounded-lg p-3 shadow-md bg-gray-50 dark:bg-gray-800">
        {/* <Document file={attachment.url} onLoadSuccess={onDocumentLoadSuccess}>/\
          <Page pageNumber={pageNumber} width={250} />
        </Document> */}
        <div className="text-center mt-2">
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
            className="text-blue-500 px-2"
          >
            Prev
          </button>
          <button
            disabled={pageNumber >= (numPages ?? 1)}
            onClick={() => setPageNumber((prev) => prev + 1)}
            className="text-blue-500 px-2"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <TbFileDownload className="text-4xl text-blue-500 mb-2" />
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {attachment.title || "Download File"}
      </a>
    </div>
  );
};

// Main component
const JudgeEvaluationsApplication = () => {
  const { uuid, applicationUuid } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState<ApplicationAward>();
  const [formRecord, setFormRecord] = useState<FormRecord<string>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const awardRoundUuid = query.get("round") || "";
  const [awardCriterias, setAwardCriterias] = useState<AwardCriteria[]>([]);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<JudgeApplicationReviewForm>({
    resolver: zodResolver(JudgeApplicationReviewSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: "judgeReviews",
  });

  useEffect(() => {
    fetchApplicationDetails();
    getAwardCriterias();
  }, []);

  const fetchApplicationDetails = async () => {
    setIsLoading(true);
    try {
      const res = await applicationService.show(applicationUuid!).request;
      const data = res.data?.data;
      if (data) {
        setApplication({
          ...data,
          awardUuid: data.award?.uuid ?? "",
          awardRoundUuid: data.awardRoundUuid ?? "",
        });
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAwardCriterias = () => {
    setIsLoading(true);
    const { request, cancel } = awardService.list(
      {
        page: 1,
        perPage: 100000,
      },
      `/criterias/${uuid}`
    );

    request
      .then((res) => {
        const results = res.data.data as AwardCriteria[];

        const formValues = results.map((result) => {
          return {
            label: result.criteria.name,
            awardCriteriaUuid: result.uuid,
            score: 0,
            comments: "",
          };
        });

        reset({ judgeReviews: formValues });
        setAwardCriterias(results);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error instanceof CanceledError) return;
        console.log(error);
      });
  };

  const handleCreateEvaluation = () => {
    // reset({
    //   score: undefined,
    //   comments: "",
    //   awardUuid: application?.award?.uuid ?? "",
    //   awardRoundUuid: awardRoundUuid,
    //   applicationUuid: applicationUuid ?? "",
    // });

    setFormRecord({
      record: "review",
      isCreate: true,
      loading: false,
      showModal: true,
    });
  };

  const handleCloseForm = () => {
    reset();
    setFormRecord({
      record: null,
      isCreate: true,
      loading: false,
      showModal: false,
    });
  };

  const onSubmit = async (values: JudgeApplicationReviewForm) => {
    setFormRecord({ ...formRecord, loading: true });
    console.log(values);
    // setFormRecord((prev) => ({ ...prev, loading: true }));
    const payload = {
      awardUuid: uuid,
      applicationUuid: applicationUuid,
      awardRoundUuid: awardRoundUuid,
      ...values,
    };
    await awardApplicationScoreService
      .create(payload, "/criteria")
      .then((res) => {
        fetchApplicationDetails();

        reset();

        setFormRecord({ ...formRecord, loading: false });
        toast.push(
          <Notification title={"Success"} type="success">
            Evaluation has been submitted successfully
          </Notification>
        );
      })
      .catch((error) => {
        toast.push(
          <Notification title={"Failed"} type="danger">
            {error.response?.data?.message || "Something went wrong, try again"}
          </Notification>
        );
        setFormRecord({ ...formRecord, loading: false });
      });
    //
    //   reset();
    //   fetchApplicationDetails();
    //   handleCloseForm();
    // } catch (error) {
    //   console.error("Review submission failed:", error);
    //   setFormRecord((prev) => ({ ...prev, loading: false }));
    // }
  };

  return (
    <Loading loading={isLoading}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Application Info */}
        <div className="flex-auto flex flex-col gap-4">
          <Card>
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-lg">Application Details</h4>
              <Tag
                className={`capitalize ${
                  application?.status === "approved"
                    ? "bg-emerald-100 text-emerald-600"
                    : application?.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-200 text-gray-700"
                }`}
              >
                {application?.status}
              </Tag>
            </div>
            <div className="mt-4 space-y-6">
              <div>
                <div className="font-bold">Title</div>
                <div>{application?.title}</div>
              </div>
              <div>
                <div className="font-bold">Description</div>
                <div>{application?.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-bold">Published Date</div>
                  <div>
                    {moment(application?.publishedDate).format("DD MMM YYYY")}
                  </div>
                </div>
                <div>
                  <div className="font-bold">Category</div>
                  <div>{application?.awardCategory?.category?.name}</div>
                </div>
                <div>
                  <div className="font-bold">Media Channel</div>
                  <div>{application?.mediaChannel?.name}</div>
                </div>
                <div>
                  <div className="font-bold">Type</div>
                  <div>
                    {application?.isGroup
                      ? "Group Application"
                      : "Single Application"}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Attachments */}
          <Card>
            <h4 className="mb-4 font-semibold text-lg">Attachment Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {application?.attachments?.length ? (
                application.attachments.map((att) => (
                  <div key={att.uuid} className="w-[160px]">
                    <FileViewer attachment={att} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">
                  No attachments found
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Applicant Info */}
        {/* <div className="lg:w-[320px] xl:w-[400px] flex flex-col gap-4">
          <Card>
            <h4 className="mb-3 font-semibold">Applicants</h4>
            {application?.members.map((member) => (
              <div key={member.uuid} className="mb-4">
                <div className="flex items-center gap-2">
                  <Avatar />
                  <div>
                    <div className="font-bold">
                      {member.member.firstName} {member.member.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.member.phone}
                    </div>
                    {member.member.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <TbMail /> {member.member.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div> */}
      </div>

      {/* Review Modal */}
      <Card className="mt-10">
        <div className="">
          {/* Right: Evaluation Inputs */}
          <h4>Application Evaluations</h4>

          <div className="mt-8">
            <Form className="" onSubmit={handleSubmit(onSubmit)}>
              {/* Hidden input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                  <div key={field.awardCriteriaUuid} className="mt-3">
                    <FormItem
                      label={field.label}
                      invalid={Boolean(errors.judgeReviews?.[index]?.score)}
                      errorMessage={errors.judgeReviews?.[index]?.message}
                    >
                      <Controller
                        name={`judgeReviews.${index}.score`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            placeholder="Score"
                            autoComplete="off"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            // {...field}
                          />
                        )}
                      />
                    </FormItem>

                    <FormItem
                      label="Comments"
                      invalid={Boolean(errors.judgeReviews?.[index]?.comments)}
                      errorMessage={errors.judgeReviews?.[index]?.message}
                    >
                      <Controller
                        name={`judgeReviews.${index}.comments`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Comments"
                            autoComplete="off"
                            textArea={true}
                            {...field}
                          />
                        )}
                      />
                    </FormItem>
                  </div>
                ))}
              </div>

              <Button
                loading={formRecord.loading}
                type="submit"
                variant="solid"
                className="bg-primary text-white ml-auto col-span-2 mt-10"
              >
                Submit Review
              </Button>
            </Form>
          </div>
        </div>
      </Card>
    </Loading>
  );
};

export default JudgeEvaluationsApplication;
