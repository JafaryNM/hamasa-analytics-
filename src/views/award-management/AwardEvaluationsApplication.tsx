import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import applicationService from "@/services/applicationService";
import Card from "@/components/ui/Card";
import Dialog from "@/components/ui/Dialog";
import { Avatar } from "antd";
import { TbFileDownload, TbMail, TbPhone } from "react-icons/tb";
import { Input, Button, Tag } from "@/components/ui";
import { Document, Page, pdfjs } from "react-pdf";
import { ApplicationAward } from "@/@types/applicationAward";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/Form";
import {
  ApplicationCommentForm,
  ApplicationCommentSchema,
} from "@/schemas/ApplicationCommentSchema";
import Loading from "@/components/shared/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormRecord } from "@/@types/formRecord";
import awardApplicationScoreService from "@/services/awardApplicationScoreService";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const determineFileType = (url: string): string => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (!extension) return "file";

  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension))
    return "image";
  if (["mp4", "avi", "mov", "mkv", "wmv"].includes(extension)) return "video";
  if (["pdf"].includes(extension)) return "pdf";
  return "file";
};

// **File Viewer Component**
const FileViewer = ({
  attachment,
}: {
  attachment: { url: string; type: string; title?: string };
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (determineFileType(attachment.url) === "image") {
    return (
      <>
        {/* ✅ Clickable Image */}
        <img
          src={attachment.url}
          alt="Attachment"
          className="w-full h-auto  object-cover rounded-md cursor-pointer"
          onClick={() => setIsModalOpen(true)} // ✅ Opens modal
        />

        {/* ✅ Image Preview Modal */}
        {isModalOpen && (
          <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="flex flex-col items-center p-4">
              <img
                src={attachment.url}
                alt="Preview"
                className="w-full max-w-md rounded-lg"
              />
            </div>
          </Dialog>
        )}
      </>
    );
  }

  if (determineFileType(attachment.url) === "video") {
    return (
      <video controls className="w-full h-40 rounded-md">
        <source src={attachment.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (determineFileType(attachment.url) === "pdf") {
    return (
      <div className="border rounded-lg p-3 shadow-md bg-gray-50 dark:bg-gray-800">
        <Document file={attachment.url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} width={250} />
        </Document>
        <div className="text-center mt-2">
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="text-blue-500 px-2"
          >
            Prev
          </button>
          <button
            disabled={pageNumber >= (numPages ?? 1)}
            onClick={() => setPageNumber(pageNumber + 1)}
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

const AwardEvaluationsApplication = () => {
  const { uuid, applicationUuid } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  // const [award, setAward] = useState<Award>();
  //   const [rounds, setRounds] = useState<AwardRound[]>([]);
  const [application, setApplication] = useState<ApplicationAward>();
  const [formRecord, setFormRecord] = useState<FormRecord<string>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationCommentForm>({
    resolver: zodResolver(ApplicationCommentSchema),
  });

  const navigate = useNavigate();
  useEffect(() => {
    getApplicationDetails();
  }, []);

  const getApplicationDetails = () => {
    setIsLoading(true);
    const { request } = applicationService.show(applicationUuid ?? "");

    request
      .then((res) => {
        if (res.data.data != null) {
          const result = res.data.data as ApplicationAward;
          setApplication(result);

          //   setRounds(result.rounds);

          //   setAwardCategories(result.awardCategories);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        // if (error instanceof CanceledError) return;
        console.log(error);
        setIsLoading(false);
      });
  };

  const resetField = () => {
    reset({ comments: "" });
  };

  const handleCreateEvaluation = (status: string) => {
    resetField();
    setFormRecord({
      ...formRecord,
      record: status,
      isCreate: true,
      showModal: true,
    });
  };

  const handleCloseForm = () => {
    resetField();
    setFormRecord({
      ...formRecord,
      record: null,
      isCreate: true,
      showModal: false,
    });
  };

  const onSubmit = (values: ApplicationCommentForm) => {
    setFormRecord({ ...formRecord, loading: true });

    const payload = {
      awardUuid: uuid,
      applicationUuid: applicationUuid,
      comments: values.comments,
    };

    awardApplicationScoreService
      .create(
        payload,
        `${formRecord.record == "approved" ? "/approve" : "/reject"}`
      )
      .then((res) => {
        reset();
        setFormRecord({
          record: null,
          loading: false,
          isCreate: true,
          showModal: false,
        });
        navigate(`/judge-management/awards/evaluations/${uuid}`);
      })
      .catch((error) => {
        setFormRecord({ ...formRecord, loading: false });
      });
  };

  return (
    <Loading loading={isLoading}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="gap-4 flex flex-col flex-auto">
          {/* <Card>
            <h4 className="mb-4 font-semibold text-lg">Award Information</h4>
            <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-4">
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-bold">Title</div>
                  <div>{application?.award?.title || "N/A"}</div>
                </div>
              </div>
            </div>
          </Card> */}
          {/* Application Details */}
          <Card>
            <div className="flex justify-between">
              <h4 className="mb-4 font-semibold text-lg">
                Application Details
              </h4>
              <div>
                {application?.status == "approved" ? (
                  <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded">
                    {application?.status}
                  </Tag>
                ) : application?.status == "pending" ? (
                  <Tag className="text-gray-600 bg-gray-200 dark:text-red-100 dark:bg-gray-500/20 border-0">
                    {application?.status}
                  </Tag>
                ) : (
                  <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
                    {application?.status}
                  </Tag>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-4">
              <div className="font-bold">Title</div>
              <div className="mt-1">{application?.title}</div>
            </div>
            <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-4 mt-8">
              <div className="font-bold">Description</div>
              <div className="mt-1">{application?.description}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-4 mt-8">
                <div className="font-bold">Published Date</div>
                <div className="mt-1">
                  {moment(application?.publishedDate).format("DD MMM YYYY")}
                </div>
              </div>

              <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-4 mt-8">
                <div className="font-bold">Category</div>
                <div className="mt-1">
                  {application?.awardCategory.category.name}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-4 mt-8">
                <div className="font-bold">Media Channel</div>
                <div className="mt-1">
                  {application?.mediaChannel
                    ? application.mediaChannel.name
                    : "N/A"}
                </div>
              </div>

              <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-4 mt-8">
                <div className="font-bold">Type</div>
                <div className="mt-1">
                  {application?.isGroup
                    ? "Group Application"
                    : "Single Application"}
                </div>
              </div>
            </div>
          </Card>

          {/* Attachments Section */}
          <Card>
            <h4 className="mb-4 font-semibold text-lg">Attachment Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {application?.attachments &&
              application.attachments.length > 0 ? (
                application.attachments.map((attachment) => (
                  <div
                    key={attachment.uuid}
                    className="border rounded-lg p-3 shadow-md w-[160px]"
                  >
                    <FileViewer attachment={attachment} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-2 md:col-span-3">
                  No attachments found
                </p>
              )}
            </div>
          </Card>

          {application?.status == "pending" && (
            <div className="p-4">
              {/* <h4 className="mb-4 font-semibold text-lg">Action</h4> */}
              <div className="flex justify-between">
                <Button
                  variant="solid"
                  type="button"
                  className="bg-red-600 text-white hover:!bg-red-600"
                  onClick={() => handleCreateEvaluation("rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="solid"
                  type="button"
                  className="bg-success text-white hover:!bg-success"
                  onClick={() => handleCreateEvaluation("approved")}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="lg:w-[320px] xl:w-[420px] gap-4 flex flex-col">
          <Card>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar />
                <div>
                  {application?.members.map((member) => (
                    <div key={member.uuid}>
                      <div className="font-bold heading-text">
                        {member.member.firstName} {member.member.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.member.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <hr className="my-5" />

            {application?.members.map((member) => (
              <div
                key={member.uuid}
                className="flex flex-col gap-2 text-gray-600"
              >
                {member.member.email && (
                  <div className="flex items-center gap-2">
                    <TbMail className="text-xl opacity-70" />
                    <span>{member.member.email}</span>
                  </div>
                )}
                {member.member.phone && (
                  <div className="flex items-center gap-2">
                    <TbPhone className="text-xl opacity-70" />
                    <span>{member.member.phone}</span>
                  </div>
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Dialog isOpen={formRecord.showModal} onClose={handleCloseForm}>
        <h4 className="mb-4 text-center">
          {formRecord.record == "approved"
            ? "Approve Application"
            : "Reject Evaluation"}
        </h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormItem
            label="Comments"
            invalid={Boolean(errors.comments)}
            errorMessage={errors.comments?.message}
          >
            <Controller
              name="comments"
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
          <Button
            loading={formRecord.loading}
            variant="solid"
            type="submit"
            className={
              formRecord.record == "approved"
                ? `bg-success text-white hover:!bg-success`
                : `bg-red-600 text-white hover:!bg-red-600`
            }
          >
            {formRecord.record == "approved" ? "Approve" : "Reject"}
          </Button>
        </Form>
      </Dialog>
    </Loading>
  );
};

export default AwardEvaluationsApplication;
