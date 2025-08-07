import { useEffect, useState } from "react";
// import Progress from "@/components/ui/Progress";
import Tooltip from "@/components/ui/Tooltip";
import { TbPencil, TbPlus, TbTrash } from "react-icons/tb";

import Container from "@/components/shared/Container";
import moment from "moment";
import { Col, Row, Table } from "antd";
import { ConfirmDialog } from "@/components/shared";
import { Button, Dialog, Input, Select, Tag } from "@/components/ui";
import { Form, FormItem } from "@/components/ui/Form";
import { DeleteRecord } from "@/@types/deleteRecord";
import { FormRecord } from "@/@types/formRecord";
import {
  AwardInstructionForm,
  AwardInstructionSchema,
} from "../../../schemas/AwardInstructionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CanceledError } from "axios";
import awardService from "@/services/awardService";
import { AwardInstruction } from "@/@types/awardInstruction";

interface Props {
  uuid: string;
}

const AwardInstructionsSection = ({ uuid }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [awardInstructions, setAwardInstruction] = useState<AwardInstruction[]>(
    []
  );

  const [formRecord, setFormRecord] = useState<FormRecord<AwardInstruction>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });

  const [deleteRecord, setDeleteRecord] = useState<
    DeleteRecord<AwardInstruction>
  >({
    record: null,
    loading: false,
    showModal: false,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardInstructionForm>({
    resolver: zodResolver(AwardInstructionSchema),
  });

  useEffect(() => {
    getAwardInstructions();
  }, []);

  const getAwardInstructions = () => {
    setIsLoading(true);
    const { request, cancel } = awardService.list(
      {
        page: 1,
        perPage: 100000,
      },
      `/instructions/${uuid}`
    );

    request
      .then((res) => {
        const results = res.data.data as AwardInstruction[];
        setAwardInstruction(results);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error instanceof CanceledError) return;
        console.log(error);
      });
  };

  const resetField = () => {
    reset({ number: "", instruction: "" });
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

  const handleEditRecord = (values: AwardInstruction) => {
    reset({
      ...values,
      number: values.number.toString(),
    });
    setFormRecord({
      ...formRecord,
      record: values,
      isCreate: false,
      showModal: true,
    });
  };

  const onSubmit = (values: AwardInstructionForm) => {
    setFormRecord({ ...formRecord, loading: true });

    if (formRecord.isCreate) {
      const payload = {
        ...values,
        awardUuid: uuid,
      };
      awardService
        .create(payload, "/instruction")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          getAwardInstructions();
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    } else {
      const payload = {
        ...values,
        uuid: formRecord.record != null ? formRecord.record.uuid : "",
      };
      awardService
        .update(payload, "/instruction")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          getAwardInstructions();
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    }
  };

  const handleConfirmDelete = () => {
    setDeleteRecord({ ...deleteRecord, loading: true });
    awardService
      .delete(deleteRecord.record?.uuid ?? "", "/instruction")
      .then((res) => {
        setDeleteRecord({ record: null, loading: false, showModal: false });
        getAwardInstructions();
      })
      .catch((error) => {
        setDeleteRecord({ ...deleteRecord, loading: false });
      });
  };

  const handleCancelDelete = () => {
    setDeleteRecord({ ...deleteRecord, record: null, showModal: false });
  };

  const handleDelete = (record: AwardInstruction) => {
    setDeleteRecord({ ...deleteRecord, record, showModal: true });
  };

  const columns = [
    {
      title: "S/n",
      dataIndex: "s_no",
      key: "s_no",
      render: (value: string, record: AwardInstruction, index: number) => {
        return index + 1;
      },
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Instruction",
      dataIndex: "instruction",
      key: "instruction",
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
      render: (value: string, record: AwardInstruction) => {
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
      {/* <AdaptiveCard> */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h4>Award Instructions</h4>
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
              dataSource={awardInstructions}
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
              ? "Add Award Instruction"
              : "Update Award Instruction"}
          </h4>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              label="Number"
              invalid={Boolean(errors.number)}
              errorMessage={errors.number?.message}
            >
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Number"
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem
              label="Instruction"
              invalid={Boolean(errors.instruction)}
              errorMessage={errors.instruction?.message}
            >
              <Controller
                name="instruction"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Instruction"
                    autoComplete="off"
                    textArea={true}
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

export default AwardInstructionsSection;
