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
import { FormRecord } from "@/@types/formRecord";
import {
  AwardJudgeForm,
  AwardJudgeSchema,
} from "../../../schemas/AwardJudgeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CanceledError } from "axios";
import { AwardJudge } from "@/@types/awardJudge";
import awardService from "@/services/awardService";
import { SelectOption } from "@/@types/selectOption";
import { Judge } from "@/@types/judge";
import userService from "@/services/userService";

interface Props {
  uuid: string;
}

const AwardJudgesSection = ({ uuid }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [awardJudges, setAwardJudges] = useState<AwardJudge[]>([]);
  const [judges, setJudges] = useState<SelectOption[]>([]);

  const [formRecord, setFormRecord] = useState<FormRecord<AwardJudge>>({
    record: null,
    isCreate: true,
    loading: false,
    showModal: false,
  });

  const [deleteRecord, setDeleteRecord] = useState<DeleteRecord<AwardJudge>>({
    record: null,
    loading: false,
    showModal: false,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardJudgeForm>({
    resolver: zodResolver(AwardJudgeSchema),
  });

  useEffect(() => {
    getAwardJudges();
    getJudges();
  }, []);

  const getAwardJudges = () => {
    setIsLoading(true);
    const { request } = awardService.list(
      {
        page: 1,
        perPage: 100000,
      },
      `/judges/${uuid}`
    );

    request
      .then((res) => {
        const results = res.data.data as AwardJudge[];
        setAwardJudges(results);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
        setIsLoading(false);
      });
  };

  const getJudges = () => {
    const { request } = userService.list<Judge>(
      {
        page: 1,
        perPage: 100000,
      },
      "/judges"
    );

    request
      .then((res) => {
        const results = res.data.data;
        setJudges(
          results != null
            ? results.map((judge: Judge) => {
                return {
                  label: `${judge.firstName} ${judge.lastName}`,
                  value: judge.uuid,
                };
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
    reset({ judge: {} });
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

  const handleEditRecord = (values: AwardJudge) => {
    reset({
      judge: {
        label: `${values.judge.firstName} ${values.judge.lastName}`,
        value: values.judge.uuid,
      },
    });
    setFormRecord({
      ...formRecord,
      record: values,
      isCreate: false,
      showModal: true,
    });
  };

  const onSubmit = (values: AwardJudgeForm) => {
    setFormRecord({ ...formRecord, loading: true });

    if (formRecord.isCreate) {
      const payload = {
        awardUuid: uuid,
        judgeUuid: values.judge.value,
      };
      awardService
        .create(payload, "/judge")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          getAwardJudges();
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    } else {
      const payload = {
        uuid: formRecord.record != null ? formRecord.record.uuid : "",
        judgeUuid: values.judge.value,
      };
      awardService
        .update(payload, "/judge")
        .then((res) => {
          reset();
          setFormRecord({
            record: null,
            loading: false,
            isCreate: true,
            showModal: false,
          });
          getAwardJudges();
        })
        .catch((error) => {
          setFormRecord({ ...formRecord, loading: false });
        });
    }
  };

  const handleConfirmDelete = () => {
    setDeleteRecord({ ...deleteRecord, loading: true });
    awardService
      .delete(deleteRecord.record?.uuid ?? "", "/judge")
      .then((res) => {
        setDeleteRecord({ record: null, loading: false, showModal: false });
        getAwardJudges();
      })
      .catch((error) => {
        setDeleteRecord({ ...deleteRecord, loading: false });
      });
  };

  const handleCancelDelete = () => {
    setDeleteRecord({ ...deleteRecord, record: null, showModal: false });
  };

  const handleDelete = (record: AwardJudge) => {
    setDeleteRecord({ ...deleteRecord, record, showModal: true });
  };

  const columns = [
    {
      title: "S/n",
      dataIndex: "s_no",
      key: "s_no",
      render: (value: string, record: AwardJudge, index: number) => {
        return index + 1;
      },
    },
    {
      title: "Judge",
      dataIndex: "judge",
      key: "judge",
      render: (value?: Judge) =>
        `${value?.firstName ?? "-"} ${value?.lastName ?? ""}`,
    },
    {
      title: "Phone Number",
      dataIndex: "judge",
      key: "phone",
      render: (judge: Judge) => judge?.phone || "N/A",
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
      render: (value: string, record: AwardJudge) => {
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
          <h4>Award Judges</h4>
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
              dataSource={awardJudges}
              columns={columns}
              rowKey="uuid"
              loading={isLoading}
              pagination={false}
            />
          </Col>
        </Row>

        <Dialog isOpen={formRecord.showModal} onClose={handleCloseForm}>
          <h4 className="mb-4 text-center">
            {formRecord.isCreate ? "Add Award Judge" : "Update Award Judge"}
          </h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              label="Judge"
              invalid={Boolean(errors.judge)}
              errorMessage={errors.judge?.message}
            >
              <Controller
                name="judge"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Select Judge"
                    options={judges}
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

export default AwardJudgesSection;
