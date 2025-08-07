import { useEffect, useState } from "react";
// import Progress from "@/components/ui/Progress";
import Tooltip from "@/components/ui/Tooltip";
import { TbPlus, TbTrash } from "react-icons/tb";

import Container from "@/components/shared/Container";
import moment from "moment";
import { Col, Row, Table } from "antd";
import { ConfirmDialog } from "@/components/shared";
import { Button, Dialog, Select } from "@/components/ui";
import { Form, FormItem } from "@/components/ui/Form";
import { DeleteRecord } from "@/@types/deleteRecord";
import categoryService from "@/services/categoryService";
import { FormRecord } from "@/@types/formRecord";
import {
  AwardCategoryForm,
  AwardCategorySchema,
} from "../../../schemas/AwardCategorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Category } from "@/@types/category";
import { CanceledError } from "axios";
import { AwardCategory } from "@/@types/awardCategory";
import awardService from "@/services/awardService";
import { SelectOption } from "@/@types/selectOption";

interface Props {
  uuid: string;
}

const AwardCategoriesSection = ({ uuid }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [awardCategories, setAwardCategories] = useState<AwardCategory[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);

  const [formRecord, setFormRecord] = useState<FormRecord<AwardCategory>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });

  const [deleteRecord, setDeleteRecord] = useState<DeleteRecord<AwardCategory>>(
    {
      record: null,
      loading: false,
      showModal: false,
    }
  );

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardCategoryForm>({
    resolver: zodResolver(AwardCategorySchema),
  });

  useEffect(() => {
    getAwardCategories();
    getCategories();
  }, []);

  const getAwardCategories = () => {
    setIsLoading(true);
    const { request, cancel } = awardService.list(
      {
        page: 1,
        perPage: 100000,
      },
      `/categories/${uuid}`
    );

    request
      .then((res) => {
        const results = res.data.data as AwardCategory[];
        setAwardCategories(results);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error instanceof CanceledError) return;
        console.log(error);
      });
  };

  const getCategories = () => {
    const { request, cancel } = categoryService.list<Category>({
      page: 1,
      perPage: 100000,
    });

    request
      .then((res) => {
        const results = res.data.data;
        setCategories(
          results != null
            ? results.map((cat: Category) => {
                return { label: cat.name, value: cat.uuid };
              })
            : []
        );
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
      });
  };

  const resetField = () => {
    reset({ category: {} });
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

  const handleEditRecord = (values: AwardCategory) => {
    reset({
      category: { label: values.category.name, value: values.category.uuid },
    });
    setFormRecord({
      ...formRecord,
      record: values,
      isCreate: false,
      showModal: true,
    });
  };

  const onSubmit = (values: AwardCategoryForm) => {
    setFormRecord({ ...formRecord, loading: true });

    if (formRecord.isCreate) {
      const payload = {
        awardUuid: uuid,
        categoryUuid: values.category.value,
      };
      awardService
        .create(payload, "/category")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          getAwardCategories();
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    } else {
      const payload = {
        uuid: formRecord.record != null ? formRecord.record.uuid : "",
        categoryUuid: values.category.value,
      };
      awardService
        .update(payload, "/category")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          getAwardCategories();
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    }
  };

  const handleConfirmDelete = () => {
    setDeleteRecord({ ...deleteRecord, loading: true });
    awardService
      .delete(deleteRecord.record?.uuid ?? "", "/category")
      .then((res) => {
        setDeleteRecord({ record: null, loading: false, showModal: false });
        getAwardCategories();
      })
      .catch((error) => {
        setDeleteRecord({ ...deleteRecord, loading: false });
      });
  };

  const handleCancelDelete = () => {
    setDeleteRecord({ ...deleteRecord, record: null, showModal: false });
  };

  const handleDelete = (record: AwardCategory) => {
    setDeleteRecord({ ...deleteRecord, record, showModal: true });
  };

  const columns = [
    {
      title: "S/n",
      dataIndex: "s_no",
      key: "s_no",
      render: (value: string, record: AwardCategory, index: number) => {
        return index + 1;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (value: Category) => value.name,
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
      render: (value: string, record: AwardCategory) => {
        return (
          <div className="flex gap-3">
            {/* <Tooltip wrapperClass="flex" title="View">
              <span
                className={`cursor-pointer p-2 text-warning`}
                onClick={() => handleEditRecord(record)}
              >
                <TbPencil size={20} />
              </span>
            </Tooltip> */}
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
      {/* <AdaptiveCard> */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h4>Award Categories</h4>
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
            <Table
              dataSource={awardCategories}
              columns={columns}
              rowKey="uuid"
              loading={isLoading}
              pagination={false}
            />
          </Col>
        </Row>

        <Dialog isOpen={formRecord.showModal} onClose={handleCloseForm}>
          <h4 className="mb-4 text-center">
            {formRecord.isCreate
              ? "Add Award Category"
              : "Update Award Category"}
          </h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              label="Category"
              invalid={Boolean(errors.category)}
              errorMessage={errors.category?.message}
            >
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select Category"
                    options={categories}
                    {...field}
                  />
                )}
              />
            </FormItem>

            <Button loading={formRecord.loading} variant="solid" type="submit">
              {formRecord.isCreate ? "Add" : "Update"}
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
            This action is irreversible! Deleting this record will permanently
            remove it from the system. Are you sure you want to proceed?
          </p>
        </ConfirmDialog>
      </div>
      {/* </AdaptiveCard> */}
    </Container>
  );
};

export default AwardCategoriesSection;
