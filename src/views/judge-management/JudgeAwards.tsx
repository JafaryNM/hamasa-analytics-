import { useState } from "react";
import { TbBriefcase2, TbSearch } from "react-icons/tb";
import moment from "moment";
import { Col, Pagination, Row, Table } from "antd";

import useAwards from "@/hooks/useAwards";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import Tooltip from "@/components/ui/Tooltip";
import { DebouceInput } from "@/components/shared";
import { Button, Tag } from "@/components/ui";
import { useAuth } from "@/auth";
import { useNavigate } from "react-router-dom";
import { Award } from "@/@types/award";

const JudgeAwards = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data, total, isLoading, pagination, setPagination, authenticated } =
    useAwards();

  const [search, setSearch] = useState("");

  if (!authenticated) {
    signOut();
  }

  const getLowBound = () => pagination.perPage * (pagination.page - 1);
  const getHighBound = () => {
    const high = getLowBound() + pagination.perPage;
    return total < high ? total : high;
  };

  const handleChangePagination = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1, search });
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "s_no",
      key: "s_no",
      render: (_: string, __: Award, index: number) =>
        (pagination.page - 1) * pagination.perPage + index + 1,
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
      render: (_: string, record: Award) =>
        `${moment(record.startDate).format("DD MMM YYYY")} - ${moment(
          record.endDate
        ).format("DD MMM YYYY")}`,
    },
    {
      title: "Published",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (value: boolean) =>
        value ? (
          <Tag className="bg-emerald-100 text-emerald-600 border-0 rounded">
            Yes
          </Tag>
        ) : (
          <Tag className="bg-gray-200 text-gray-700 border-0">No</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean) =>
        value ? (
          <Tag className="bg-emerald-100 text-emerald-600 border-0 rounded">
            Active
          </Tag>
        ) : (
          <Tag className="bg-red-100 text-red-600 border-0">Inactive</Tag>
        ),
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
      render: (_: string, record: Award) => (
        <Tooltip wrapperClass="flex" title="View Evaluation">
          <span
            className="cursor-pointer p-2 text-warning"
            onClick={() =>
              navigate(`/judge-management/awards/evaluations/${record.uuid}`)
            }
          >
            <TbBriefcase2 size={20} />
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Awards</h3>
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
              <p>
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

export default JudgeAwards;
