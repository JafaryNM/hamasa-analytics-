import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Col, Row, Table, Tag, Pagination } from "antd";
import { TbPlus, TbSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import { Button, Select, DatePicker, Input } from "@/components/ui";
import { Space, Tooltip } from "antd";
import { TbEye, TbEdit, TbTrash } from "react-icons/tb";
import moment from "moment";

// Dummy project data
const projectData = [
  {
    uuid: "1",
    title: "Empowering Journalists For Informed Communities",
    category: "Jounalism",
    status: "active",
    media: 3004,
    createdAt: "2025-08-01",
  },
  {
    uuid: "2",
    title: "Zanzibar 2025- Election",
    category: "Election",
    media: 848585,
    status: "in_review",
    createdAt: "2025-07-25",
  },
  {
    uuid: "3",
    title: "Non Communicable Diseases",
    category: "Health",
    status: "archived",
    media: 488448,
    createdAt: "2025-07-20",
  },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "completed", label: "Completed" },
];

const categoryOptions = [
  { value: "Election", label: "Election" },
  { value: "Health", label: "Health" },
  { value: "Journalism", label: "Journalism" },
];

const typeOptions = [
  { value: "tv", label: "TV" },
  { value: "radio", label: "Radio" },
  { value: "newspaper", label: "Newspaper" },
  { value: "online", label: "Online" },
];

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      search: "",
      startDate: null,
      endDate: null,
      status: "",
      category: "",
      type: "",
    },
  });

  const filters = watch();

  const filteredData = useMemo(() => {
    let result = projectData;

    if (filters.search) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.category) {
      result = result.filter(
        (item) => item.category.toLowerCase() === filters.category
      );
    }

    return result;
  }, [filters]);

  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.perPage;
    return filteredData.slice(start, start + pagination.perPage);
  }, [filteredData, pagination]);

  const columns = [
    {
      title: "S/N",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Project Title",
      dataIndex: "title",
    },
    {
      title: "Media Items",
      dataIndex: "media",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (date: string) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (date: string) => moment(date).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "active"
              ? "green"
              : status === "archived"
                ? "red"
                : "orange"
          }
        >
          {status.replace(/_/g, " ")}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="View">
            <TbEye
              className="cursor-pointer text-blue-500"
              onClick={() => navigate(`/projects/details/${record.uuid}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <TbEdit
              className="cursor-pointer text-yellow-500"
              onClick={() => navigate(`/projects/edit/${record.uuid}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <TbTrash
              className="cursor-pointer text-red-500"
              onClick={() => handleDelete(record.uuid)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4 m-12">
          {/* Filter Form */}
          <form onSubmit={handleSubmit(() => {})}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Controller
                  name="search"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Search by title"
                      suffix={<TbSearch />}
                    />
                  )}
                />
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker {...field} placeholder="Start Date" />
                  )}
                />
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker {...field} placeholder="End Date" />
                  )}
                />
              </Col>

              <Col xs={24} sm={12} md={4}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={statusOptions}
                      placeholder="Status"
                    />
                  )}
                />
              </Col>

              <Col xs={24} sm={12} md={3}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categoryOptions}
                      placeholder="Category"
                    />
                  )}
                />
              </Col>

              <Col xs={24} sm={12} md={3}>
                <div className="flex gap-2">
                  <Button type="submit">Filter</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
          </form>
          <hr className="border border-gray-100 dark:border-gray-700 my-4" />
          <div className="flex items-center justify-between">
            <h3 className=" font-semibold text-2xl">
              Media Monitoring Projects Overview
            </h3>

            <Button
              icon={<TbPlus />}
              onClick={() => navigate("/projects/add")}
              className="bg-primary text-white px-4 py-2 hover:bg-primary hover:text-white"
            >
              Add Project
            </Button>
          </div>

          {/* Table */}
          <Row className="mt-5">
            <Col span={24}>
              <Table
                dataSource={paginatedData}
                columns={columns}
                rowKey="uuid"
                pagination={false}
              />
            </Col>
          </Row>

          {/* Pagination Footer */}
          <Row justify="space-between" className="mt-4">
            <Col>
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.perPage + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.perPage,
                  filteredData.length
                )}{" "}
                of {filteredData.length} entries
              </p>
            </Col>
            <Col>
              <Pagination
                current={pagination.page}
                total={filteredData.length}
                pageSize={pagination.perPage}
                onChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
              />
            </Col>
          </Row>
        </div>
      </AdaptiveCard>
    </Container>
  );
};

export default ProjectsPage;
