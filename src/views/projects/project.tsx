// src/views/projects/project.tsx
import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Col, Row, Table, Tag, Pagination, Space, Tooltip } from "antd";
import { TbPlus, TbSearch, TbEye, TbEdit, TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import { Button, Select, DatePicker, Input } from "@/components/ui";
import moment from "moment";

type Project = {
  uuid: string;
  title: string;
  category: string;
  status: "active" | "archived" | "completed" | "in_review";
  media: number;
  startDate: string; // ISO
  endDate: string; // ISO
};

// ✅ Demo data
const projectData: Project[] = [
  {
    uuid: "1",
    title: "Empowering Journalists For Informed Communities",
    category: "Journalism",
    status: "active",
    media: 3004,
    startDate: "2025-08-01",
    endDate: "2025-10-31",
  },
  {
    uuid: "2",
    title: "Zanzibar 2025 - Election",
    category: "Election",
    status: "in_review",
    media: 848585,
    startDate: "2025-07-25",
    endDate: "2025-11-15",
  },
  {
    uuid: "3",
    title: "Non Communicable Diseases",
    category: "Health",
    status: "archived",
    media: 488448,
    startDate: "2025-07-20",
    endDate: "2026-01-10",
  },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "completed", label: "Completed" },
  { value: "in_review", label: "In Review" },
];

const categoryOptions = [
  { value: "Election", label: "Election" },
  { value: "Health", label: "Health" },
  { value: "Journalism", label: "Journalism" },
];

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      search: "",
      startDate: null as any,
      endDate: null as any,
      status: "",
      category: "",
      type: "",
    },
  });

  // 👀 Watch current filter values
  const filters = watch();

  // ✅ Define filteredData (this was missing)
  const filteredData = useMemo(() => {
    let result = [...projectData];

    // search by title
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      result = result.filter((item) => item.title.toLowerCase().includes(q));
    }

    // status
    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    // category
    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    // date range (optional)
    if (filters.startDate) {
      const start = moment(filters.startDate).startOf("day");
      result = result.filter((item) =>
        moment(item.startDate).isSameOrAfter(start)
      );
    }
    if (filters.endDate) {
      const end = moment(filters.endDate).endOf("day");
      result = result.filter((item) =>
        moment(item.endDate).isSameOrBefore(end)
      );
    }

    return result;
  }, [filters]);

  // ✅ Paginate filtered data
  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.perPage;
    return filteredData.slice(start, start + pagination.perPage);
  }, [filteredData, pagination]);

  const handleDelete = (uuid: string) => {
    // TODO: confirm + call API
    console.log("delete project", uuid);
  };

  const columns = [
    {
      title: "S/N",
      render: (_: any, __: any, index: number) =>
        (pagination.page - 1) * pagination.perPage + index + 1,
      width: 70,
    },
    { title: "Project Title", dataIndex: "title" },
    { title: "Media Items", dataIndex: "media", width: 140 },
    { title: "Category", dataIndex: "category", width: 140 },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (date: string) => moment(date).format("DD MMM YYYY"),
      width: 140,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (date: string) => moment(date).format("DD MMM YYYY"),
      width: 140,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: Project["status"]) => (
        <Tag
          color={
            status === "active"
              ? "green"
              : status === "archived"
                ? "red"
                : status === "completed"
                  ? "blue"
                  : "orange"
          }
        >
          {status.replace(/_/g, " ")}
        </Tag>
      ),
      width: 130,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Project) => (
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
      width: 140,
    },
  ];

  // Submit just resets page to 1 (you can add API call)
  const onFilter = () => setPagination((p) => ({ ...p, page: 1 }));

  const onReset = () => {
    reset();
    setPagination((p) => ({ ...p, page: 1 }));
  };

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4 m-12">
          {/* Filter Form */}
          <form onSubmit={handleSubmit(onFilter)}>
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
                  <Button type="button" variant="outline" onClick={onReset}>
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
          </form>

          <hr className="border border-gray-100 dark:border-gray-700 my-4" />

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-2xl">
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
