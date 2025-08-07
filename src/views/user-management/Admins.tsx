import { useState } from "react";
// import Progress from "@/components/ui/Progress";
import Tooltip from "@/components/ui/Tooltip";
import { TbEye, TbPlus, TbSearch } from "react-icons/tb";

import useAdmins from "@/hooks/useAdmins";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import moment from "moment";
import { Col, Pagination, Row, Table, message } from "antd";
import { DebouceInput } from "@/components/shared";
import { Button, Dialog, Input, Select, Tag } from "@/components/ui";
import { Form, FormItem } from "@/components/ui/Form";
import { DeleteRecord } from "@/@types/deleteRecord";
import { useAuth } from "@/auth";
import { FormRecord } from "@/@types/formRecord";
import { AdminForm, AdminSchema } from "../../schemas/AdminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Admin } from "@/@types/Results";
import userService from "@/services/userService";
import { useNavigate } from "react-router-dom";
import authuserService from "@/services/authUserService";

const genders = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const Admins = () => {
  const { signOut } = useAuth();

  const navigate = useNavigate();

  const { data, total, isLoading, pagination, setPagination, authenticated } =
    useAdmins();

  const [search, setSearch] = useState("");

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

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminForm>({
    resolver: zodResolver(AdminSchema),
  });

  const resetField = () => {
    reset({ firstName: "", lastName: "", gender: {}, email: "", phone: "" });
  };

  const handleCreateRecord = () => {
    resetField();
    setFormRecord({
      ...formRecord,
      record: null,
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

  const onSubmit = (values: AdminForm) => {
    setFormRecord({ ...formRecord, loading: true });

    if (formRecord.isCreate) {
      const payload = {
        ...values,
        gender: values.gender.value,
        password: "12345678",
        passwordConfirmation: "12345678",
      };
      authuserService
        .create(payload, "/register/admin")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          setPagination({ ...pagination, page: 1 });
          toast.push(
            <Notification title={"Success"} type="success">
              Admin has been created successfully
            </Notification>
          );
        })
        .catch((error) => {
          toast.push(
            <Notification title={"Failed"} type="danger">
              {error.response?.data?.message ||
                "Something went wrong, try again"}
            </Notification>
          );
          setFormRecord({ ...formRecord, loading: false });
        });
    } else {
      const payload = {
        ...values,
        gender: values.gender.value,
        uuid: formRecord.record != null ? formRecord.record.uuid : "",
      };
      userService
        .update(payload)
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          setPagination({ ...pagination, page: 1 });
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    }
  };

  if (!authenticated) {
    signOut();
  }

  const handleCancelDelete = () => {
    setDeleteRecord({ ...deleteRecord, record: null, showModal: false });
  };

  const getLowBound = () => {
    const lowBound = pagination.perPage * (pagination.page - 1);

    return lowBound;
  };

  const getHighBound = () => {
    let highBound = getLowBound() + pagination.perPage;
    if (total < highBound) {
      highBound = total;
    }
    return highBound;
  };

  const handleChangePagination = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1, search: search });
  };

  const handleClear = () => {
    setPagination({ ...pagination, search: "" });
  };

  const columns = [
    {
      title: "S/n",
      dataIndex: "s_no",
      key: "s_no",
      render: (value: string, record: Admin, index: number) => {
        return (pagination.page - 1) * pagination.perPage + index + 1;
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (value: string, record: Admin) =>
        `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean) => {
        return value ? (
          <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded">
            Active
          </Tag>
        ) : (
          <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
            Inactive
          </Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => moment(value).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value: string, record: Admin) => {
        return (
          <div className="flex gap-3">
            <Tooltip wrapperClass="flex" title="View">
              <span
                className={`cursor-pointer p-2 text-primary`}
                onClick={() =>
                  navigate(`/user-management/admins/details/${record.uuid}`)
                }
              >
                <TbEye size={20} />
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Admins</h3>
            <Button
              variant="solid"
              icon={<TbPlus className="text-xl" />}
              onClick={handleCreateRecord}
            >
              Add new
            </Button>
            {/* <OrderListActionTools /> */}
          </div>

          <Row className="mt-5">
            <Col span={24}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <DebouceInput
                  placeholder="Search"
                  suffix={<TbSearch className="text-lg" />}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button icon={<TbSearch />} onClick={() => handleSearch()}>
                  Search
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col span={24}>
              <Table
                dataSource={data}
                columns={columns}
                rowKey="uuid"
                loading={isLoading}
                pagination={false}
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col sm={24} md={12}>
              <p className="category">
                Showing {getLowBound() + 1} to {getHighBound()} of {total}{" "}
                entries
              </p>
            </Col>

            <Col sm={24} md={12}>
              <Pagination
                align="end"
                current={pagination.page}
                total={total}
                pageSize={pagination.perPage}
                onChange={handleChangePagination}
              />
            </Col>
          </Row>

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

              <Button
                loading={formRecord.loading}
                variant="solid"
                type="submit"
              >
                {formRecord.isCreate ? "Create" : "Update"}
              </Button>
            </Form>
          </Dialog>
        </div>
      </AdaptiveCard>
    </Container>
  );
};

export default Admins;
