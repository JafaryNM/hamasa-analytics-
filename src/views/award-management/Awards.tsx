import { useState } from "react";
// import Progress from "@/components/ui/Progress";
import Tooltip from "@/components/ui/Tooltip";
import { TbBriefcase2, TbEye, TbPlus, TbSearch } from "react-icons/tb";

import useAwards from "@/hooks/useAwards";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import moment from "moment";
import { Col, Pagination, Row, Table } from "antd";
import { DebouceInput } from "@/components/shared";
import {
  Button,
  DatePicker,
  Dialog,
  Input,
  Select,
  Tag,
} from "@/components/ui";
import { Form, FormItem } from "@/components/ui/Form";
import { DeleteRecord } from "@/@types/deleteRecord";
import { useAuth } from "@/auth";
import { FormRecord } from "@/@types/formRecord";
import { AwardForm, AwardSchema } from "../../schemas/AwardSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Award } from "@/@types/award";
import { useNavigate } from "react-router-dom";
import awardService from "@/services/awardService";

const genders = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const Awards = () => {
  const { signOut } = useAuth();

  const navigate = useNavigate();

  const { data, total, isLoading, pagination, setPagination, authenticated } =
    useAwards();

  const [search, setSearch] = useState("");

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

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardForm>({
    resolver: zodResolver(AwardSchema),
  });

  const resetField = () => {
    reset({
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      judgeAccessStartDate: undefined,
      judgeAccessEndDate: undefined,
    });
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

  const onSubmit = (values: AwardForm) => {
    setFormRecord({ ...formRecord, loading: true });

    console.log(values);

    if (formRecord.isCreate) {
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
        resultsReleaseDate: moment(values.resultsReleaseDate).format(
          "YYYY-MM-DD"
        ),
      };
      awardService
        .create(payload)
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
    } else {
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
      render: (value: string, record: Award, index: number) => {
        return (pagination.page - 1) * pagination.perPage + index + 1;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Duration",
      dataIndex: "startDate",
      key: "startDate",
      render: (value: string, record: Award) => {
        return `${moment(record.startDate).format("DD MMM YYYY")} - ${moment(record.endDate).format("DD MMM YYYY")}`;
      },
    },
    {
      title: "Judge Access",
      dataIndex: "judgeAccessStartDate",
      key: "judgeAccessStartDate",
      render: (value: string, record: Award) => {
        return `${moment(record.judgeAccessStartDate).format("DD MMM YYYY")} - ${moment(record.judgeAccessStartDate).format("DD MMM YYYY")}`;
      },
    },
    {
      title: "Result Date",
      dataIndex: "resultsReleaseDate",
      key: "resultsReleaseDate",
      render: (value: string, record: Award) => {
        return `${moment(record.judgeAccessStartDate).format("DD MMM YYYY")} - ${moment(record.judgeAccessStartDate).format("DD MMM YYYY")}`;
      },
    },
    {
      title: "Published",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (value: boolean) => {
        return value ? (
          <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded">
            Yes
          </Tag>
        ) : (
          <Tag className="text-gray-700 bg-gray-200 dark:text-gray-100 dark:bg-gray-500/20 border-0">
            No
          </Tag>
        );
      },
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
      title: "Created",
      dataIndex: "createdAt",
      key: "created",
      render: (value: string) => moment(value).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value: string, record: Award) => {
        return (
          <div className="flex gap-3">
            <Tooltip wrapperClass="flex" title="View">
              <span
                className={`cursor-pointer p-2 text-primary`}
                onClick={() =>
                  navigate(`/award-management/awards/details/${record.uuid}`)
                }
              >
                <TbEye size={20} />
              </span>
            </Tooltip>
            <Tooltip wrapperClass="flex" title="Evaluation">
              <span
                className={`cursor-pointer p-2 text-warning`}
                onClick={() =>
                  navigate(
                    `/award-management/awards/evaluations/${record.uuid}`
                  )
                }
              >
                <TbBriefcase2 size={20} />
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
            <h3>Cohorts</h3>
            <Button
              variant="solid"
              icon={<TbPlus className="text-xl" />}
              onClick={handleCreateRecord}
            >
              Add Cohort
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
              {formRecord.isCreate ? "Created Award" : "Update Award"}
            </h4>
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

              <FormItem
                label="Results Date"
                invalid={Boolean(errors.judgeAccessEndDate)}
                errorMessage={errors.judgeAccessEndDate?.message}
              >
                <Controller
                  name="resultsReleaseDate"
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

export default Awards;
