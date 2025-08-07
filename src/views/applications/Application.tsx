import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Col, Pagination, Row, Table, Tag } from "antd";
import { TbEye, TbPlus, TbSearch } from "react-icons/tb";
import { Application } from "@/@types/application";
import useApplications from "@/hooks/useApplications";
import { useAuth } from "@/auth";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import { DebouceInput } from "@/components/shared";
import { Button, Tooltip } from "@/components/ui";

const ApplicationPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data, total, isLoading, pagination, setPagination } =
    useApplications();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1, search }));
  }, [search]);

  const getLowBound = () => pagination.perPage * (pagination.page - 1);
  const getHighBound = () =>
    Math.min(getLowBound() + pagination.perPage, total);

  const handleChangePagination = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1, search }));
  };

  const columns = [
    {
      title: "S/n",
      dataIndex: "s_no",
      key: "s_no",
      render: (_: any, __: any, index: number) =>
        (pagination.page - 1) * pagination.perPage + index + 1,
    },
    {
      title: "Story Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Award Category",
      dataIndex: "awardCategory",
      key: "awardCategory",
      render: (awardCategory: any) => awardCategory?.category?.name || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "pending"
              ? "green"
              : status == "rejected"
                ? "red"
                : status === "submitted"
                  ? "orange"
                  : status === "approved"
                    ? "green"
                    : "default"
          }
        >
          {status === "submitted" ? "in progress" : status}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: Date) => moment(value).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Application) => {
        const { status, uuid } = record;

        if (status === "submitted") {
          return (
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-4 py-2"
              title="Complete Application"
              onClick={() => navigate(`/applications/apply/${uuid}`)}
            >
              Complete Application
            </button>
          );
        }

        if (status === "pending") {
          return (
            <Tooltip wrapperClass="flex" title="View Details">
              <span
                className="cursor-pointer p-2 text-primary"
                onClick={() => navigate(`/applications/details/${uuid}`)}
              >
                <TbEye size={20} />
              </span>
            </Tooltip>
          );
        }

        return null;
      },
    },
  ];

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Applications</h3>
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
                <Button icon={<TbSearch />} onClick={handleSearch}>
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
        </div>
      </AdaptiveCard>
    </Container>
  );
};

export default ApplicationPage;
