import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { HiPencil, HiOutlineTrash, HiPaperAirplane } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FormRecord } from "@/@types/formRecord";
import { DeleteRecord } from "@/@types/deleteRecord";
import { AwardForm, AwardSchema } from "@/schemas/AwardSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/Form";
import { DatePicker, Dialog, Input, Tag } from "@/components/ui";
import { Award } from "@/@types/award";
import awardService from "@/services/awardService";

type DetailInfoFieldProps = {
  title?: string;
  value?: string | boolean;
};

type AwardInfoSectionProps = {
  uuid: string | undefined;
  data: Award | null;
  reloadFunc: () => void;
};

const DetailInfoField = ({ title, value }: DetailInfoFieldProps) => {
  return (
    <div>
      <span className="font-semibold block">{title}</span>
      {title != "Status" && <p className="heading-text font-bold">{value}</p>}
      {title == "Status" || title == "Published" ? (
        value == true ? (
          <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded mt-1">
            {title == "Status" ? "Active" : "Yes"}
          </Tag>
        ) : (
          <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0 mt-1">
            {title == "Status" ? "In-active" : "No"}
          </Tag>
        )
      ) : (
        ""
      )}
    </div>
  );
};

const AwardInfoSection = ({
  uuid,
  data,
  reloadFunc,
}: AwardInfoSectionProps) => {
  const navigate = useNavigate();

  const [formRecord, setFormRecord] = useState<FormRecord<Award>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });

  const [deleteRecord, setDeleteRecord] = useState<DeleteRecord<Award>>({
    record: null,
    loading: false,
    showModal: false,
  });

  const [resetRecord, setResetRecord] = useState({
    loading: false,
    showModal: false,
  });

  const [isLoadingCheckSetup, setIsLoadingCheckSetup] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardForm>({
    resolver: zodResolver(AwardSchema),
  });

  const handleCloseForm = () => {
    setFormRecord({
      ...formRecord,
      isCreate: false,
      showModal: false,
    });
  };

  const handleEditRecord = () => {
    reset({
      title: data?.title,
      description: data?.description,
      startDate: new Date(data?.startDate ?? ""),
      endDate: new Date(data?.endDate ?? ""),
      judgeAccessStartDate: new Date(data?.judgeAccessStartDate ?? ""),
      judgeAccessEndDate: new Date(data?.judgeAccessEndDate ?? ""),
    });
    setFormRecord({
      ...formRecord,
      record: data,
      isCreate: false,
      showModal: true,
    });
  };

  const onSubmit = (values: AwardForm) => {
    setFormRecord({ ...formRecord, loading: true });

    const payload = {
      ...values,
      startDate: moment(values.startDate).format("YYYY-MM-DD"),
      endDate: moment(values.endDate).format("YYYY-MM-DD"),
      judgeAccessStartDate: moment(values.judgeAccessStartDate).format(
        "YYYY-MM-DD"
      ),
      judgeAccessEndDate: moment(values.judgeAccessEndDate).format(
        "YYYY-MM-DD"
      ),
      uuid: formRecord.record != null ? formRecord.record.uuid : "",
    };
    awardService
      .update(payload)
      .then((res) => {
        reset();
        setFormRecord({
          record: null,
          loading: false,
          isCreate: true,
          showModal: false,
        });
        reloadFunc();
      })
      .catch((error) => {
        setFormRecord({ ...formRecord, loading: false });
      });
  };

  const handlePublish = () => {
    setResetRecord({ loading: true, showModal: true });
    const { request } = awardService.show(uuid ?? "", `/publish`);

    request
      .then((res) => {
        setResetRecord({ loading: false, showModal: false });
        toast.push(
          <Notification title={"Successfully Published"} type="success">
            Award has been successfully published to applicants/journalists
          </Notification>
        );
        reloadFunc();
      })
      .catch((error) => {
        setResetRecord({ loading: false, showModal: false });
        toast.push(
          <Notification title={"Failed to Publish"} type="danger">
            Award setup is incomplete, please finish setting up award and try
            again
          </Notification>
        );
        console.log(error);
      });
  };

  const handleShowDeleteModal = () => {
    setDeleteRecord({ ...deleteRecord, record: data, showModal: true });
  };

  const handleCancelDelete = () => {
    setDeleteRecord({ ...deleteRecord, record: null, showModal: false });
  };

  const handleDelete = () => {
    setDeleteRecord({ ...deleteRecord, loading: true });
    awardService
      .delete(deleteRecord.record?.uuid ?? "")
      .then((res) => {
        setDeleteRecord({ record: null, loading: false, showModal: false });
        navigate("/award-management/awards");
        toast.push(
          <Notification title={"Successfully Deleted"} type="success">
            Award has been successfully deleted
          </Notification>
        );
        //   setPagination({ ...pagination, page: 1 });
      })
      .catch((error) => {
        setDeleteRecord({ ...deleteRecord, loading: false });
      });
  };

  return (
    <Card className="w-full">
      <div className="flex justify-end">
        {/* <Tooltip title="Edit customer"> */}
        <Button
          variant="plain"
          className="flex items-center justify-center text-warning border-none hover:text-warning gap-2"
          onClick={handleEditRecord}
        >
          <HiPencil /> Edit
        </Button>
        {/* </Tooltip> */}
      </div>
      <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
        <div className="flex xl:flex-col items-center gap-4 mt-6">
          <h4 className="font-bold">Award Details</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
          <DetailInfoField title="Title" value={data?.title} />
          <DetailInfoField title="Description" value={data?.description} />
          <DetailInfoField
            title="Start Date"
            value={moment(data?.startDate).format("DD MMM YYYY")}
          />
          <DetailInfoField
            title="End Date"
            value={moment(data?.endDate).format("DD MMM YYYY")}
          />
          <DetailInfoField
            title="Judge Access Start Date"
            value={moment(data?.judgeAccessStartDate).format("DD MMM YYYY")}
          />
          <DetailInfoField
            title="Judge Access End Date"
            value={moment(data?.judgeAccessEndDate).format("DD MMM YYYY")}
          />
          {/* <DetailInfoField title="Date of birth" value={"N/A"} /> */}
          <DetailInfoField title="Published" value={data?.isPublished} />
          <DetailInfoField title="Status" value={data?.isActive} />
        </div>
        <div className="flex flex-col gap-4 mt-7">
          {data?.isPublished == false && (
            <Button
              block
              customColorClass={() =>
                "text-success hover:border-success hover:ring-1 ring-success hover:text-success"
              }
              icon={<HiPaperAirplane />}
              onClick={() =>
                setResetRecord({ loading: false, showModal: true })
              }
            >
              Publish
            </Button>
          )}

          <Button
            block
            customColorClass={() =>
              "text-error hover:border-error hover:ring-1 ring-error hover:text-error"
            }
            icon={<HiOutlineTrash />}
            onClick={() => handleShowDeleteModal()}
          >
            Delete
          </Button>
        </div>

        <Dialog isOpen={formRecord.showModal} onClose={handleCloseForm}>
          <h4 className="mb-4 text-center">{"Update Award"}</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              label="Title"
              invalid={Boolean(errors.title)}
              errorMessage={errors.title?.message}
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Title"
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem
              label="Description "
              invalid={Boolean(errors.description)}
              errorMessage={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    rows={4}
                    type="text"
                    placeholder="Description "
                    autoComplete="off"
                    {...field}
                    textArea
                  />
                )}
              />
            </FormItem>

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

            <FormItem
              label="Judge Access Start Date"
              invalid={Boolean(errors.judgeAccessStartDate)}
              errorMessage={errors.judgeAccessStartDate?.message}
            >
              <Controller
                name="judgeAccessStartDate"
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
              label="Judge Access End Date"
              invalid={Boolean(errors.judgeAccessEndDate)}
              errorMessage={errors.judgeAccessEndDate?.message}
            >
              <Controller
                name="judgeAccessEndDate"
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

            <Button loading={formRecord.loading} variant="solid" type="submit">
              Update
            </Button>
          </Form>
        </Dialog>

        {/* RESET PASSWORD MODAL */}
        <ConfirmDialog
          isOpen={resetRecord.showModal}
          type="success"
          title="Publish Award"
          confirmText="Publish"
          cancelButtonProps={{
            variant: "solid",
            color: "default",
            customColorClass: () =>
              "text-dark bg-gray-200 hover:bg-default mr-3",
          }}
          confirmButtonProps={{
            variant: "solid",
            color: "success",
            customColorClass: () => "text-white bg-success hover:bg-success",
            loading: resetRecord.loading,
          }}
          onClose={() => setResetRecord({ loading: false, showModal: false })}
          onCancel={() => setResetRecord({ loading: false, showModal: false })}
          onConfirm={handlePublish}
        >
          <p>
            {" "}
            This action is irreversible! Publishing{" "}
            <span className="font-semibold">{data?.title} </span>
            award password will be visible to journalists/applicants Are you
            sure you want to proceed?
          </p>
        </ConfirmDialog>

        {/* DELETE MODAL */}
        <ConfirmDialog
          isOpen={deleteRecord.showModal}
          type="danger"
          title="Warning"
          confirmText="Delete"
          cancelButtonProps={{
            variant: "solid",
            color: "default",
            customColorClass: () =>
              "text-dark bg-gray-200 hover:bg-default mr-3",
          }}
          confirmButtonProps={{
            variant: "solid",
            color: "danger",
            customColorClass: () => "text-white bg-error hover:bg-error",
            loading: deleteRecord.loading,
          }}
          onClose={handleCancelDelete}
          onCancel={handleCancelDelete}
          onConfirm={handleDelete}
        >
          <p>
            {" "}
            This action is irreversible! Deleting{" "}
            <span className="font-semibold">{deleteRecord.record?.title} </span>
            will permanently be removed from the system. Are you sure you want
            to proceed?
          </p>
        </ConfirmDialog>
      </div>
    </Card>
  );
};

export default AwardInfoSection;
