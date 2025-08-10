// src/views/requests/Request.tsx
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Col, Row, Table, Pagination, Space, Tooltip, Tag } from "antd";
import { TbPlus, TbSearch, TbEye, TbTrash } from "react-icons/tb";
import type { MouseEvent } from "react";
import moment from "moment";

import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { Input } from "@/components/ui";

type RequestItem = {
  uuid: string;
  title: string;
  description: string;
  status: "open" | "in_review" | "resolved";
  createdAt: string; // ISO
};

// ---- Dummy seed data ----
const initialRequests: RequestItem[] = [
  {
    uuid: "r1",
    title: "Add new project: Media Ethics Tracking",
    description:
      "We need to monitor media ethics violations across top 10 outlets.",
    status: "open",
    createdAt: "2025-08-05T09:10:00Z",
  },
  {
    uuid: "r2",
    title: "Bulk import sources",
    description: "Please import sources from CSV uploaded yesterday.",
    status: "in_review",
    createdAt: "2025-08-06T12:00:00Z",
  },
  {
    uuid: "r3",
    title: "Archive old Health project",
    description: "Project 2024 Health pilot can be archived.",
    status: "resolved",
    createdAt: "2025-08-03T08:30:00Z",
  },
];

type FormValues = {
  title: string;
  description: string;
};

const Request: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });
  const [search, setSearch] = useState("");
  const [dialogIsOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "" },
  });

  // ---- Table filtering & pagination ----
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [requests, search]);

  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.perPage;
    return filtered.slice(start, start + pagination.perPage);
  }, [filtered, pagination]);

  // ---- Dialog handlers (match your Dialog API) ----
  const openDialog = () => setIsOpen(true);

  const onDialogClose = (e?: MouseEvent) => {
    if (e) console.log("onDialogClose", e);
    setIsOpen(false);
  };

  // ---- Create new request ----
  const onCreate = handleSubmit(async (values) => {
    if (!values.title || values.title.length < 3) return;
    if (!values.description || values.description.length < 10) return;

    const newItem: RequestItem = {
      uuid: `r_${Date.now()}`,
      title: values.title,
      description: values.description,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [newItem, ...prev]);
    reset();
    setIsOpen(false);
  });

  const handleDelete = (uuid: string) =>
    setRequests((prev) => prev.filter((r) => r.uuid !== uuid));

  const columns = [
    {
      title: "S/N",
      width: 70,
      render: (_: any, __: any, index: number) =>
        (pagination.page - 1) * pagination.perPage + index + 1,
    },
    { title: "Title", dataIndex: "title" },
    { title: "Description", dataIndex: "description", ellipsis: true },
    {
      title: "Status",
      dataIndex: "status",
      width: 140,
      render: (status: RequestItem["status"]) => (
        <Tag
          color={
            status === "open"
              ? "orange"
              : status === "in_review"
                ? "blue"
                : "green"
          }
        >
          {status.replace(/_/g, " ")}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 160,
      render: (iso: string) => moment(iso).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (_: any, record: RequestItem) => (
        <Space size="middle">
          <Tooltip title="View">
            <TbEye
              className="cursor-pointer text-blue-500"
              onClick={() => console.log("view", record.uuid)}
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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="font-semibold text-2xl">Requests</h3>
            <div className="flex items-center gap-2">
              <div className="w-64">
                <Input
                  placeholder="Search requests…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  suffix={<TbSearch />}
                />
              </div>
              <Button variant="solid" onClick={openDialog} icon={<TbPlus />}>
                New Request
              </Button>
            </div>
          </div>

          {/* Table */}
          <Row className="mt-4">
            <Col span={24}>
              <Table
                dataSource={paginatedData}
                columns={columns}
                rowKey="uuid"
                pagination={false}
              />
            </Col>
          </Row>

          {/* Footer pagination */}
          <Row justify="space-between" className="mt-4">
            <Col>
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.perPage + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.perPage,
                  filtered.length
                )}{" "}
                of {filtered.length} entries
              </p>
            </Col>
            <Col>
              <Pagination
                current={pagination.page}
                total={filtered.length}
                pageSize={pagination.perPage}
                onChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
              />
            </Col>
          </Row>
        </div>

        {/* Create Dialog (your Dialog component) */}
        <Dialog
          isOpen={dialogIsOpen}
          onClose={onDialogClose}
          onRequestClose={onDialogClose}
        >
          <h5 className="mb-4 text-lg font-semibold">Create Request</h5>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onCreate();
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="e.g. Add new monitoring project"
                {...register("title", { required: true, minLength: 3 })}
              />
              {errors.title && (
                <p className="text-sm text-red-600">
                  Title must be at least 3 characters
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={5}
                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                placeholder="Briefly describe the request…"
                {...register("description", { required: true, minLength: 10 })}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  Description must be at least 10 characters
                </p>
              )}
            </div>

            <div className="text-right mt-6">
              <Button
                className="ltr:mr-2 rtl:ml-2"
                variant="plain"
                onClick={onDialogClose}
                type="button"
              >
                Cancel
              </Button>
              <Button variant="solid" type="submit" disabled={isSubmitting}>
                Request
              </Button>
            </div>
          </form>
        </Dialog>
      </AdaptiveCard>
    </Container>
  );
};

export default Request;
