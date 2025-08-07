import { useState } from "react";
// import Progress from "@/components/ui/Progress";
import Tooltip from "@/components/ui/Tooltip";
import { TbPencil, TbPlus, TbSearch, TbTrash } from "react-icons/tb";

import useCategories from "@/hooks/useCategories";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import moment from "moment";
import { Col, Pagination, Row, Table } from "antd";
import { ConfirmDialog, DebouceInput } from "@/components/shared";
import { Button, Dialog, Input } from "@/components/ui";
import { Form, FormItem } from "@/components/ui/Form";
import { DeleteRecord } from "@/@types/deleteRecord";
import { useAuth } from "@/auth";
import categoryService from "@/services/categoryService";
import { FormRecord } from "@/@types/formRecord";
import { CategoryForm, CategorySchema } from "../../schemas/CategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Category } from "@/@types/category";

const Categories = () => {
  const { signOut } = useAuth();

  const { data, total, isLoading, pagination, setPagination, authenticated } =
    useCategories();

  const [search, setSearch] = useState("");

  const [formRecord, setFormRecord] = useState<FormRecord<Category>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });

  const [deleteRecord, setDeleteRecord] = useState<DeleteRecord<Category>>({
    record: null,
    loading: false,
    showModal: false,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(CategorySchema),
  });

  const resetField = () => {
    reset({ name: "", description: "" });
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

  const handleEditRecord = (values: Category) => {
    reset({ name: values.name, description: values.description ?? "" });
    setFormRecord({
      ...formRecord,
      record: values,
      isCreate: false,
      showModal: true,
    });
  };

  const onSubmit = (values: CategoryForm) => {
    setFormRecord({ ...formRecord, loading: true });

    if (formRecord.isCreate) {
      categoryService
        .create(values)
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
              Record has been created successfully
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
        uuid: formRecord.record != null ? formRecord.record.uuid : "",
      };
      categoryService
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
          toast.push(
            <Notification title={"Success"} type="success">
              Record has been updated successfully
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
    }
  };

  const handleConfirmDelete = () => {
    setDeleteRecord({ ...deleteRecord, loading: true });
    categoryService
      .delete(deleteRecord.record?.uuid ?? "")
      .then((res) => {
        setDeleteRecord({ record: null, loading: false, showModal: false });
        setPagination({ ...pagination, page: 1 });
      })
      .catch((error) => {
        setDeleteRecord({ ...deleteRecord, loading: false });
      });
  };

  if (!authenticated) {
    signOut();
  }

  const handleCancelDelete = () => {
    setDeleteRecord({ ...deleteRecord, record: null, showModal: false });
  };

  const handleDelete = (record: Category) => {
    setDeleteRecord({ ...deleteRecord, record, showModal: true });
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
      render: (value: string, record: Category, index: number) => {
        return (pagination.page - 1) * pagination.perPage + index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      render: (value: string, record: Category) => {
        return (
          <div className="flex gap-3">
            <Tooltip wrapperClass="flex" title="View">
              <span
                className={`cursor-pointer p-2 text-warning`}
                onClick={() => handleEditRecord(record)}
              >
                <TbPencil size={20} />
              </span>
            </Tooltip>
            <Tooltip wrapperClass="flex" title="Delete">
              <span
                className="cursor-pointer p-2 text-red-500 hover:text-red-500"
                onClick={() => handleDelete(record)}
              >
                <TbTrash size={20} />
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
            <h3>Categories</h3>
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
              {formRecord.isCreate ? "Create Categories" : "Update Categories"}
            </h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormItem
                label="Name"
                invalid={Boolean(errors.name)}
                errorMessage={errors.name?.message}
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Name"
                      autoComplete="off"
                      {...field}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                label="Description"
                invalid={Boolean(errors.description)}
                errorMessage={errors.description?.message}
              >
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Description"
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
              >
                {formRecord.isCreate ? "Create" : "Update"}
              </Button>
            </Form>
          </Dialog>

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
            onConfirm={handleConfirmDelete}
          >
            <p>
              {" "}
              This action is irreversible! Deleting{" "}
              <span className="font-semibold">
                {deleteRecord.record?.name}{" "}
              </span>
              will permanently remove it from the system. Are you sure you want
              to proceed?
            </p>
          </ConfirmDialog>
        </div>
      </AdaptiveCard>
    </Container>
  );
};

export default Categories;
