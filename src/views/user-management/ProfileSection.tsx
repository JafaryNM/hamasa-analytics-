import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar/Avatar";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { HiPencil, HiOutlineTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Admin } from "@/@types/Results";
import UserImage from "../../assets/images/user.png";
import moment from "moment";
import { FormRecord } from "@/@types/formRecord";
import { DeleteRecord } from "@/@types/deleteRecord";
import { AdminForm, AdminSchema } from "@/schemas/AdminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import userService from "@/services/userService";
import { Form, FormItem } from "@/components/ui/Form";
import { Dialog, Input, Select, Tag } from "@/components/ui";
import { GiPadlock } from "react-icons/gi";
import AuthService from "@/services/AuthService";

type CustomerInfoFieldProps = {
  title?: string;
  value?: string | boolean;
};

type ProfileSectionProps = {
  data: Admin | null;
  reloadFunc: () => void;
};

const genders = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
  return (
    <div>
      <span className="font-semibold block">{title}</span>
      {title != "Status" && <p className="heading-text font-bold">{value}</p>}
      {title == "Status" ? (
        value == true ? (
          <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded mt-1">
            Active
          </Tag>
        ) : (
          <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0 mt-1">
            Inactive
          </Tag>
        )
      ) : (
        ""
      )}
    </div>
  );
};

const ProfileSection = ({ data, reloadFunc }: ProfileSectionProps) => {
  const navigate = useNavigate();

  const [formRecord, setFormRecord] = useState<FormRecord<Admin>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });

  const [deleteRecord, setDeleteRecord] = useState<DeleteRecord<Admin>>({
    record: null,
    loading: false,
    showModal: false,
  });

  const [resetRecord, setResetRecord] = useState({
    loading: false,
    showModal: false,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminForm>({
    resolver: zodResolver(AdminSchema),
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSocialNavigate = (link: string = "") => {
    // window.open(`https://${link}`, "_blank", "rel=noopener noreferrer");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleCloseForm = () => {
    setFormRecord({
      ...formRecord,
      isCreate: false,
      showModal: false,
    });
  };

  const handleEditRecord = () => {
    reset({
      firstName: data?.firstName,
      lastName: data?.lastName,
      gender: { label: data?.gender, value: data?.gender },
      phone: data?.phone,
      email: data?.email,
    });
    setFormRecord({
      ...formRecord,
      record: data,
      isCreate: false,
      showModal: true,
    });
  };

  const onSubmit = (values: AdminForm) => {
    setFormRecord({ ...formRecord, loading: true });

    const payload = {
      ...values,
      gender: values.gender.value,
      uuid: formRecord.record != null ? formRecord.record.uuid : "",
    };
    userService
      .update(payload)
      .then((res) => {
        toast.push(
          <Notification title={"Successfully Updated"} type="success">
            Admin details has been successfully updated
          </Notification>
        );
        reset();
        setFormRecord({
          record: null,
          loading: false,
          isCreate: true,
          showModal: false,
        });
        reloadFunc();
        // setPagination({ ...pagination, page: 1 });
      })
      .catch((error) => {
        toast.push(
          <Notification title={"Error"} type="danger">
            {error.response != null &&
            error.response.data != null &&
            error.response.data.message != null
              ? error.response.data.message
              : "Something went wrong, try again please!!"}
          </Notification>
        );
        setFormRecord({ ...formRecord, loading: false });
      });
  };

  const handleShowResetModal = () => {
    setResetRecord({ loading: false, showModal: true });
  };

  const handleResetPassword = () => {
    setDeleteRecord({ ...deleteRecord, loading: true });
    AuthService.resetPassword(data?.uuid ?? "")
      .then((res) => {
        setResetRecord({ loading: false, showModal: false });
        toast.push(
          <Notification title={"Successfully Reset"} type="success">
            Password has been successfully resetted
          </Notification>
        );
        //   setPagination({ ...pagination, page: 1 });
      })
      .catch((error) => {
        setResetRecord({ ...resetRecord, loading: false });
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
    userService
      .delete(deleteRecord.record?.uuid ?? "")
      .then((res) => {
        setDeleteRecord({ record: null, loading: false, showModal: false });
        navigate("/user-management/admins");
        toast.push(
          <Notification title={"Successfully Deleted"} type="success">
            Admin has been successfully deleted
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
          <Avatar
            size={90}
            shape="circle"
            src={data?.profilePicUrl || UserImage}
            alt={`${data?.firstName} ${data?.lastName}`}
          />
          <h4 className="font-bold">
            {data?.firstName} {data?.lastName}
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
          <CustomerInfoField title="First Name" value={data?.firstName} />
          <CustomerInfoField title="Last Name" value={data?.lastName} />
          <CustomerInfoField title="Email" value={data?.email} />
          <CustomerInfoField title="Phone" value={data?.phone} />
          {/* <CustomerInfoField title="Date of birth" value={"N/A"} /> */}
          <CustomerInfoField
            title="Last Online"
            value={moment(data?.createdAt).format("DD MMM, YYYY hh:mm A")}
          />
          <CustomerInfoField title="Status" value={data?.isActive} />
          {/* <div className="mb-7">
                        <span>Social</span>
                        <div className="flex mt-4 gap-2">
                            <Button
                                size="sm"
                                icon={
                                    <FaFacebookF className="text-[#2259f2]" />
                                }
                                onClick={() =>
                                    handleSocialNavigate(
                                        data.personalInfo?.facebook,
                                    )
                                }
                            />
                            <Button
                                size="sm"
                                icon={
                                    <FaXTwitter className="text-black dark:text-white" />
                                }
                                onClick={() =>
                                    handleSocialNavigate(
                                        data.personalInfo?.twitter,
                                    )
                                }
                            />
                            <Button
                                size="sm"
                                icon={
                                    <FaLinkedinIn className="text-[#155fb8]" />
                                }
                                onClick={() =>
                                    handleSocialNavigate(
                                        data.personalInfo?.linkedIn,
                                    )
                                }
                            />
                            <Button
                                size="sm"
                                icon={
                                    <FaPinterestP className="text-[#df0018]" />
                                }
                                onClick={() =>
                                    handleSocialNavigate(
                                        data.personalInfo?.pinterest,
                                    )
                                }
                            />
                        </div>
                    </div> */}
        </div>
        <div className="flex flex-col gap-4 mt-7">
          {/* <Button block variant="solid" onClick={handleSendMessage}>
            Send Messsage
          </Button> */}
          <Button
            block
            customColorClass={() =>
              "text-default hover:border-default hover:ring-1 ring-default hover:text-default"
            }
            icon={<GiPadlock />}
            onClick={() => handleShowResetModal()}
          >
            Reset Password
          </Button>
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
          <h4 className="mb-4 text-center">
            {formRecord.isCreate ? "Create Admin" : "Update Admin"}
          </h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              label="First Name"
              invalid={Boolean(errors.firstName)}
              errorMessage={errors.firstName?.message}
            >
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="First Name"
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem
              label="Last Name"
              invalid={Boolean(errors.lastName)}
              errorMessage={errors.lastName?.message}
            >
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Last Name"
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem
              label="Gender"
              invalid={Boolean(errors.gender)}
              errorMessage={errors.gender?.message}
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select Gender"
                    options={genders}
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem
              label="Phone Number"
              invalid={Boolean(errors.phone)}
              errorMessage={errors.phone?.message}
            >
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem
              label="Email Address"
              invalid={Boolean(errors.email)}
              errorMessage={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Email Address"
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <Button loading={formRecord.loading} variant="solid" type="submit">
              {formRecord.isCreate ? "Create" : "Update"}
            </Button>
          </Form>
        </Dialog>
        {/* RESET PASSWORD MODAL */}
        <ConfirmDialog
          isOpen={resetRecord.showModal}
          type="warning"
          title="Warning"
          confirmText="Reset"
          cancelButtonProps={{
            variant: "solid",
            color: "default",
            customColorClass: () =>
              "text-dark bg-gray-200 hover:bg-default mr-3",
          }}
          confirmButtonProps={{
            variant: "solid",
            color: "warning",
            customColorClass: () => "text-white bg-warning hover:bg-warning",
            loading: resetRecord.loading,
          }}
          onClose={() => setResetRecord({ loading: false, showModal: false })}
          onCancel={() => setResetRecord({ loading: false, showModal: false })}
          onConfirm={handleResetPassword}
        >
          <p>
            {" "}
            This action is irreversible! Reseting{" "}
            <span className="font-semibold">
              {data?.firstName} {data?.lastName}
              {"'s"}{" "}
            </span>
            password will reset password to default{" "}
            <span className="font-semibold"> 12345678</span>. Are you sure you
            want to proceed?
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
            <span className="font-semibold">
              {deleteRecord.record?.firstName}{" "}
              {deleteRecord.record?.lastName}{" "}
            </span>
            will permanently be removed from the system. Are you sure you want
            to proceed?
          </p>
        </ConfirmDialog>
      </div>
    </Card>
  );
};

export default ProfileSection;
