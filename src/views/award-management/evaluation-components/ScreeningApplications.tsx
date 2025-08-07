import { useState } from "react";
// import Progress from "@/components/ui/Progress";
import Tooltip from "@/components/ui/Tooltip";
import { TbEye, TbSearch } from "react-icons/tb";

import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import moment from "moment";
import { Col, Pagination, Row, Table, message } from "antd";
import { DebouceInput } from "@/components/shared";
import { Button, Tag } from "@/components/ui";
import { useAuth } from "@/auth";
import { useNavigate } from "react-router-dom";
import useApplicationAwards from "@/hooks/useApplicationAwards";
import { Application } from "@/@types/application";
import { ApplicationAward } from "@/@types/applicationAward";
import { MediaChannel } from "@/@types/mediaChannel";
import { AwardCategory } from "@/@types/awardCategory";
import applicationService from "@/services/applicationService";
import awardApplicationScoreService from "@/services/awardApplicationScoreService";
import { RoundScore } from "@/@types/roundScore";

interface Props {
  awardUuid: string | undefined;
  currentRound: RoundScore | null;
  reloadPage: () => void;
}

const ScreeningApplications = ({
  awardUuid,
  currentRound,
  reloadPage,
}: Props) => {
  const { signOut } = useAuth();

  const navigate = useNavigate();

  const { data, total, isLoading, pagination, setPagination, authenticated } =
    useApplicationAwards({ awardUuid, status: "pending" });

  const [search, setSearch] = useState("");
  const [isLoadingCompletition, setIsLoadingCompletition] = useState(false);

  if (!authenticated) {
    signOut();
  }

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

  const handleCompleteScreening = () => {
    setIsLoadingCompletition(true);
    const payload = {
      awardUuid,
    };
    awardApplicationScoreService
      .create(payload, "/initialize-round")
      .then((res) => {
        setIsLoadingCompletition(false);
        reloadPage();
        toast.push(
          <Notification title={"Successfully "} type="success">
            You have successfully closed screening
          </Notification>
        );
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingCompletition(false);
        toast.push(
          <Notification title={"Failed"} type="danger">
            {error.response.data.message}
          </Notification>
        );
      });
  };

  const columns = [
    {
      title: "S/n",
      dataIndex: "s_no",
      key: "s_no",
      render: (value: string, record: ApplicationAward, index: number) => {
        return (pagination.page - 1) * pagination.perPage + index + 1;
      },
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
      render: (value: AwardCategory) => {
        return value.category.name;
      },
    },
    {
      title: "Media Channel",
      dataIndex: "mediaChannel",
      key: "mediaChannel",
      render: (value: MediaChannel | null | undefined) => {
        return value?.name || "-";
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        return value == "approved" ? (
          <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded">
            {value}
          </Tag>
        ) : value == "pending" ? (
          <Tag className="text-gray-600 bg-gray-200 dark:text-red-100 dark:bg-gray-500/20 border-0">
            {value}
          </Tag>
        ) : (
          <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
            {value}
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
      dataIndex: "uuid",
      key: "uuid",
      render: (value: string) => {
        return (
          <Tooltip wrapperClass="flex" title="View">
            <span
              className={`cursor-pointer p-2 text-primary`}
              onClick={() =>
                navigate(
                  `/award-management/awards/evaluations/${awardUuid}/application/${value}`
                )
              }
            >
              <TbEye size={20} />
            </span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Applications</h3>
            {currentRound == null && (
              <Button
                variant="solid"
                type="button"
                className="bg-success text-white hover:!bg-success"
                loading={isLoadingCompletition}
                onClick={handleCompleteScreening}
              >
                Complete Screening
              </Button>
            )}
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
        </div>
      </AdaptiveCard>
    </Container>
  );
};

export default ScreeningApplications;
