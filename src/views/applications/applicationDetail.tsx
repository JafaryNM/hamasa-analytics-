import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CanceledError } from "axios";
import applicationService from "@/services/applicationService";
import Card from "@/components/ui/Card";
import Loading from "@/components/shared/Loading";
import Dialog from "@/components/ui/Dialog";
import { Avatar, Tag } from "antd";
import { CiTrophy } from "react-icons/ci";
import Drawer from "@/components/ui/Drawer";
import CustomIndicator from "../ui-components/feedback/Spinner/CustomIndicator";
import {
  HiOutlineInformationCircle,
  HiPresentationChartBar,
  HiUsers,
} from "react-icons/hi";
import { TbFileDownload, TbMail, TbPhone } from "react-icons/tb";
import { Application } from "@/@types/application";
import { Document, Page, pdfjs } from "react-pdf";
import { HiVideoCameraSlash } from "react-icons/hi2";
import { useAuth } from "@/auth";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const determineFileType = (url: string): string => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (!extension) return "file";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension))
    return "image";
  if (["mp4", "avi", "mov", "mkv", "wmv"].includes(extension)) return "video";
  if (["pdf"].includes(extension)) return "pdf";
  if (["mp3", "wav", "ogg", "m4a"].includes(extension)) return "audio";
  return "file";
};

const AudioWaveform = ({ url }: { url: string }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    waveSurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#37AFE3", // brand color
      height: 60,
      responsive: true,
    });

    waveSurferRef.current.load(url);

    return () => {
      waveSurferRef.current?.destroy();
    };
  }, [url]);

  return <div ref={waveformRef} className="w-full my-2" />;
};

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
        <img
          src={attachment.url}
          alt="Attachment"
          className="w-full h-auto object-cover rounded-md cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
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

const ApplicationDetail = () => {
  const { uuid } = useParams();
  const [record, setRecord] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  useEffect(() => {
    getRecordDetails();
  }, []);

  console.log(user.uuid);

  const getRecordDetails = () => {
    setIsLoading(true);
    const { request, cancel } = applicationService.show(uuid ?? "");
    request
      .then((res) => {
        if (res.data.data) {
          setRecord(res.data.data as Application);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.error("Error fetching application:", error);
        setIsLoading(false);
      });
    return () => cancel();
  };

  if (!record) return <p className="text-center">Not found</p>;

  const fileAttachments =
    record.attachments?.filter((att) =>
      ["image", "video", "pdf"].includes(determineFileType(att.url))
    ) || [];

  const onlineLinks =
    record.attachments?.filter(
      (att) => !["image", "video", "pdf"].includes(determineFileType(att.url))
    ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CustomIndicator />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          className="p-2 px-4 text-white rounded-md bg-green-500 hover:bg-green-600 transition"
          onClick={handleDrawerOpen}
        >
          View Applicants
        </button>
      </div>

      <div className="gap-4 flex flex-col flex-auto">
        <Card>
          <h4 className="mb-4 font-semibold text-lg">Award Information</h4>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700 p-4">
            <div className="flex items-center gap-2">
              <CiTrophy className="text-4xl text-white bg-blue-400 p-2 rounded-full" />
              <div>
                <div className="font-bold">Title</div>
                <div>{record?.award?.title || "N/A"}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="mb-4 font-semibold text-lg">
            Application Information
          </h4>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <HiOutlineInformationCircle className="text-4xl text-white bg-blue-400 p-2 rounded-full" />
                <div>
                  <div className="font-bold">Application Title</div>
                  <div className="mt-1">{record?.title || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiPresentationChartBar className="text-4xl text-white bg-blue-400 p-2 rounded-full" />
                <div>
                  <div className="font-bold">Status</div>
                  <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
                    {record?.status || "N/A"}
                  </Tag>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 border rounded-md">
              <div className="font-bold">Application Description</div>
              {record?.description || "N/A"}
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="mb-4 font-semibold text-lg">Media Information</h4>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <HiUsers className="text-4xl text-white bg-blue-400 p-2 rounded-full" />
                <div>
                  <div className="font-bold">Is group</div>
                  <div className="mt-1">
                    {record?.isGroup
                      ? "Group Application"
                      : "Single Application"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <HiVideoCameraSlash className="text-4xl text-white bg-blue-400 p-2 rounded-full" />
                <div>
                  <div className="font-bold">
                    {record.awardCategory?.category.name}
                  </div>
                  <div className="mt-1">Award Category</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <HiVideoCameraSlash className="text-4xl text-white bg-blue-400 p-2 rounded-full" />
                <div>
                  <div className="font-bold">{record.mediaChannel.name}</div>
                  <div className="mt-1">media channel</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {record?.awardCategory?.category && (
          <Card>
            <h4 className="mb-4 font-semibold text-lg">Award Category</h4>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-700 p-4">
              <div className="font-bold mb-2 text-gray-800 dark:text-white">
                {record.awardCategory.category.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {record.awardCategory.category.description}
              </div>
            </div>
          </Card>
        )}

        {fileAttachments.length > 0 && (
          <Card>
            <h4 className="mb-4 font-semibold text-lg">File Attachments</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {fileAttachments.map((attachment) => (
                <div
                  key={attachment.uuid}
                  className="border rounded-lg p-3 shadow-sm bg-white dark:bg-gray-800"
                >
                  <FileViewer attachment={attachment} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {onlineLinks.length > 0 && (
          <Card>
            <h4 className="mb-4 font-semibold text-lg">Online Links Support</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {onlineLinks.map((attachment) => (
                <div
                  key={attachment.uuid}
                  className="flex flex-col justify-between border rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-800"
                >
                  <div className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                    {attachment.title || "Untitled File"}
                  </div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm break-words"
                  >
                    {attachment.url}
                  </a>
                </div>
              ))}
            </div>
          </Card>
        )}

        {record?.attachedLinks?.length > 0 && (
          <Card>
            <h4 className="mb-4 font-semibold text-lg">Attached Links</h4>
            <div className="grid grid-cols-1 gap-4 p-4">
              {record.attachedLinks.map((linkItem, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-800"
                >
                  <div className="font-semibold text-gray-800 dark:text-white mb-1">
                    {linkItem.title || "Untitled Link"}
                  </div>
                  <a
                    href={linkItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-words text-sm"
                  >
                    {linkItem.link}
                  </a>
                </div>
              ))}
            </div>
          </Card>
        )}

        {record?.editorReferenceUrl && (
          <Card>
            <h4 className="mb-4 font-semibold text-lg">
              Editor Reference Letter
            </h4>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <TbFileDownload className="text-3xl text-blue-500" />
                <a
                  href={record.editorReferenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View or Download Editor Reference Letter
                </a>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Drawer
        title="Applicants Information"
        isOpen={isDrawerOpen}
        placement="right"
        width={500}
        onClose={handleDrawerClose}
        onRequestClose={handleDrawerClose}
      >
        <div className="space-y-6">
          {record.members.map((member) => (
            <Card key={member.uuid}>
              <div className="flex items-center gap-4">
                <Avatar />
                <div>
                  <div className="font-bold text-gray-900">
                    {member.member.firstName} {member.member.lastName}
                  </div>
                  {member.member.phone && (
                    <div className="text-sm text-gray-600">
                      {member.member.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-gray-700">
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
            </Card>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default ApplicationDetail;
