import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Pagination, Row, Table } from "antd";
import moment from "moment";
import { TbEye, TbSearch } from "react-icons/tb";

import { useAuth } from "@/auth";
import useApplicationAwards from "@/hooks/useApplicationAwards";
import { ApplicationAward } from "@/@types/applicationAward";
import { MediaChannel } from "@/@types/mediaChannel";
import { AwardCategory } from "@/@types/awardCategory";
import { RoundScore } from "@/@types/roundScore";

import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import { DebouceInput } from "@/components/shared";
import Tooltip from "@/components/ui/Tooltip";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import { Button, Tag } from "@/components/ui";
import useUnreviewedApplications from "@/hooks/useUnreviewedApplications";

interface Props {
  awardUuid: string | undefined;
  awardRoundUuid: string | undefined;
  currentRound: RoundScore | null;
}

const RoundApplications = ({
  awardUuid,
  awardRoundUuid,
  currentRound,
}: Props) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [isLoadingCompletition, setIsLoadingCompletition] = useState(false);

  const { data, total, isLoading, pagination, setPagination, authenticated } =
    useUnreviewedApplications({
      awardUuid,
      awardRoundUuid,
    });

  if (!authenticated) {
    signOut();
  }

  const getLowBound = () => pagination.perPage * (pagination.page - 1);
  const getHighBound = () => {
    const high = getLowBound() + pagination.perPage;
    return total < high ? total : high;
  };

  const handleChangePagination = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1, search });
  };

  const handleCompleteRound = () => {
    setIsLoadingCompletition(true);

    // Placeholder for round completion logic (e.g., API call)
    toast.push(
      <Notification title="Round Completion" type="success">
        This round has been marked as complete.
      </Notification>
    );

    setIsLoadingCompletition(false);
  };

  const columns = [
    {
      title: "S/n",
      key: "s_no",
      render: (_: string, __: ApplicationAward, index: number) =>
        getLowBound() + index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "awardCategory",
      key: "awardCategory",
      render: (value: AwardCategory) => value?.category?.name || "N/A",
    },
    {
      title: "Media Type",
      dataIndex: "mediaChannel",
      key: "mediaChannel",
      render: (value: MediaChannel) => value?.name || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag
          className={`capitalize border-0 rounded ${
            value === "approved"
              ? "bg-emerald-100 text-emerald-600"
              : value === "pending"
                ? "bg-gray-200 text-gray-700"
                : "bg-red-100 text-red-600"
          }`}
        >
          {value}
        </Tag>
      ),
    },
    {
      title: "Total Score",
      dataIndex: "totalScore",
      key: "totalScore",
      render: (value: number) => value ?? "N/A",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => moment(value).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: ApplicationAward) => (
        <Tooltip title="Review Application">
          <span
            className="cursor-pointer p-2 text-primary"
            onClick={() =>
              navigate(
                `/judge-management/awards/evaluations/${awardUuid}/application/${record.uuid}?round=${awardRoundUuid}`
              )
            }
          >
            <TbEye size={20} />
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
            <h3 className="text-xl font-semibold">Unreviewed Applications</h3>
            {currentRound?.uuid === awardRoundUuid && (
              <Button
                variant="solid"
                type="button"
                className="bg-success text-white hover:!bg-success"
                loading={isLoadingCompletition}
                onClick={handleCompleteRound}
              >
                Complete Round
              </Button>
            )}
          </div>

          <Row className="mt-4">
            <Col span={24}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

          <Row className="mt-4">
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
              <p className="text-sm">
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

export default RoundApplications;
