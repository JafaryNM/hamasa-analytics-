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
  AwardRoundForm,
  AwardRoundSchema,
} from "../../../schemas/AwardRoundSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CanceledError } from "axios";
import { AwardRound } from "@/@types/awardRound";
import awardService from "@/services/awardService";
import { SelectOption } from "@/@types/selectOption";

const booleanValues: SelectOption[] = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

interface Props {
  uuid: string;
}

const AwardRoundsSection = ({ uuid }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [awardRounds, setAwardRounds] = useState<AwardRound[]>([]);

  const [formRecord, setFormRecord] = useState<FormRecord<AwardRound>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });

  const [deleteRecord, setDeleteRecord] = useState<DeleteRecord<AwardRound>>({
    record: null,
    loading: false,
    showModal: false,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardRoundForm>({
    resolver: zodResolver(AwardRoundSchema),
  });

  useEffect(() => {
    getAwardRounds();
  }, []);

  const getAwardRounds = () => {
    setIsLoading(true);
    const { request, cancel } = awardService.list(
      {
        page: 1,
        perPage: 100000,
      },
      `/rounds/${uuid}`
    );

    request
      .then((res) => {
        const results = res.data.data as AwardRound[];
        setAwardRounds(results);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error instanceof CanceledError) return;
        console.log(error);
      });
  };

  const resetField = () => {
    reset({ name: "", number: "", score: "", isFinal: {} });
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

  const handleEditRecord = (values: AwardRound) => {
    reset({
      ...values,
      number: values.number.toString(),
      score: values.score.toString(),
      isFinal: {
        label: values.isFinal ? "Yes" : "No",
        value: values.isFinal ? "true" : "false",
      },
    });
    setFormRecord({
      ...formRecord,
      record: values,
      isCreate: false,
      showModal: true,
    });
  };

  const onSubmit = (values: AwardRoundForm) => {
    setFormRecord({ ...formRecord, loading: true });

    if (formRecord.isCreate) {
      const payload = {
        ...values,
        awardUuid: uuid,
        isFinal: values.isFinal.value == "true" ? true : false,
      };
      awardService
        .create(payload, "/round")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          getAwardRounds();
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    } else {
      const payload = {
        ...values,
        uuid: formRecord.record != null ? formRecord.record.uuid : "",
        isFinal: values.isFinal.value == "true" ? true : false,
      };
      awardService
        .update(payload, "/round")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          getAwardRounds();
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    }
  };

  const handleConfirmDelete = () => {
    setDeleteRecord({ ...deleteRecord, loading: true });
    awardService
      .delete(deleteRecord.record?.uuid ?? "", "/round")
      .then((res) => {
        setDeleteRecord({ record: null, loading: false, showModal: false });
        getAwardRounds();
      })
      .catch((error) => {
        setDeleteRecord({ ...deleteRecord, loading: false });
      });
  };

  const handleCancelDelete = () => {
    setDeleteRecord({ ...deleteRecord, record: null, showModal: false });
  };

  const handleDelete = (record: AwardRound) => {
    setDeleteRecord({ ...deleteRecord, record, showModal: true });
  };

  const columns = [
    {
      title: "S/n",
      dataIndex: "s_no",
      key: "s_no",
      render: (value: string, record: AwardRound, index: number) => {
        return index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Is Final",
      dataIndex: "isFinal",
      key: "isFinal",
      render: (value: boolean) => {
        return value ? (
          <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded">
            Yes
          </Tag>
        ) : (
          <Tag className="text-gray-600 bg-gray-200 dark:text-red-100 dark:bg-gray-500/20 border-0">
            No
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
      render: (value: string, record: AwardRound) => {
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
          <h4>Award Rounds</h4>
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
              dataSource={awardRounds}
              columns={columns}
              rowKey="uuid"
              loading={isLoading}
              pagination={false}
            />
          </Col>
        </Row>

        <Dialog isOpen={formRecord.showModal} onClose={handleCloseForm}>
          <h4 className="mb-4 text-center">
            {formRecord.isCreate ? "Add Award Round" : "Update Award Round"}
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
              label="Score"
              invalid={Boolean(errors.score)}
              errorMessage={errors.score?.message}
            >
              <Controller
                name="score"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Minimum score to be in this round"
                    autoComplete="off"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem
              label="Is this Round final"
              invalid={Boolean(errors.isFinal)}
              errorMessage={errors.isFinal?.message}
            >
              <Controller
                name="isFinal"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select Option"
                    options={booleanValues}
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

export default AwardRoundsSection;
