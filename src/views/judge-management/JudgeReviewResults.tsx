// import React from "react";

// function JudgeReviewResults() {
//   return <div>JudgeReviewResults</div>;
// }

// export default JudgeReviewResults;

import React, { useState } from "react";
import { Table, Typography, Tag, Row, Col, Pagination } from "antd";
import { TbSearch } from "react-icons/tb";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import { DebouceInput } from "@/components/shared";
import { Button, Select } from "@/components/ui";
import moment from "moment";

const { Title } = Typography;

interface Applicant {
  id: string;
  name: string;
  scores: {
    judge1: number;
    judge2: number;
    judge3: number;
    judge4: number;
    judge5: number;
  };
}

const categories = [
  { label: "Overall Winners", value: "overall" },
  { label: "Category 1", value: "category1" },
  { label: "Category 2", value: "category2" },
];

const JudgeReviewResults = () => {
  const [applicants] = useState<Applicant[]>([
    {
      id: "1",
      name: "Alice John",
      scores: { judge1: 85, judge2: 90, judge3: 88, judge4: 92, judge5: 94 },
    },
    {
      id: "2",
      name: "Ben Mwita",
      scores: { judge1: 80, judge2: 85, judge3: 78, judge4: 89, judge5: 90 },
    },
    {
      id: "3",
      name: "Caroline Musa",
      scores: { judge1: 95, judge2: 93, judge3: 94, judge4: 91, judge5: 96 },
    },
    {
      id: "4",
      name: "Cabrib Musa",
      scores: { judge1: 90, judge2: 85, judge3: 80, judge4: 88, judge5: 91 },
    },
    {
      id: "5",
      name: "Caroline Musa",
      scores: { judge1: 92, judge2: 94, judge3: 96, judge4: 95, judge5: 97 },
    },
  ]);

  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("overall");

  const applicantsWithTotalAndPercentage = applicants.map((applicant) => {
    const total =
      applicant.scores.judge1 +
      applicant.scores.judge2 +
      applicant.scores.judge3 +
      applicant.scores.judge4 +
      applicant.scores.judge5;
    const percentage = (total / 500) * 100; // Total max score is 500
    return {
      ...applicant,
      total,
      percentage,
    };
  });

  const filteredApplicants = applicantsWithTotalAndPercentage.filter(
    (applicant) => applicant.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedApplicants = filteredApplicants.sort((a, b) => b.total - a.total);

  const highestScore = sortedApplicants[0]?.total || 0;
  const winners = sortedApplicants.filter((a) => a.total === highestScore);

  const getLowBound = () => {
    return (pagination.page - 1) * pagination.perPage;
  };

  const getHighBound = () => {
    let highBound = getLowBound() + pagination.perPage;
    if (sortedApplicants.length < highBound) {
      highBound = sortedApplicants.length;
    }
    return highBound;
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPagination({ ...pagination, page: 1 });
  };

  const handleClear = () => {
    setSearch("");
    setPagination({ ...pagination, search: "" });
  };

  const handleChangePagination = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const columns = [
    {
      title: "S/n",
      dataIndex: "s_no",
      key: "s_no",
      render: (value: string, record: Applicant, index: number) => {
        return (pagination.page - 1) * pagination.perPage + index + 1;
      },
    },
    {
      title: "Applicant Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Judge 1 Marks",
      key: "judge1",
      render: (_: any, record: Applicant) => record.scores.judge1,
    },
    {
      title: "Judge 2 Marks",
      key: "judge2",
      render: (_: any, record: Applicant) => record.scores.judge2,
    },
    {
      title: "Judge 3 Marks",
      key: "judge3",
      render: (_: any, record: Applicant) => record.scores.judge3,
    },
    {
      title: "Judge 4 Marks",
      key: "judge4",
      render: (_: any, record: Applicant) => record.scores.judge4,
    },
    {
      title: "Judge 5 Marks",
      key: "judge5",
      render: (_: any, record: Applicant) => record.scores.judge5,
    },
    {
      title: "Total Marks",
      key: "total",
      render: (_: any, record: Applicant) => record.total,
    },
    {
      title: "Percentage",
      key: "percentage",
      render: (_: any, record: Applicant) => `${record.percentage.toFixed(2)}%`,
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: Applicant) => {
        const total = record.total;
        const isWinner = total === highestScore && highestScore > 0;
        return isWinner ? (
          <Tag color="green">Winner 🏆</Tag>
        ) : (
          <Tag color="blue">Participant</Tag>
        );
      },
    },
  ];

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Judge Overall Evaluations</h3>
            <Select
              placeholder="Select Category"
              options={categories}
              onChange={handleCategoryChange}
              value={selectedCategory}
            />
          </div>

          <Row className="mt-5">
            <Col span={24}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <DebouceInput
                  placeholder="Search"
                  suffix={<TbSearch className="text-lg" />}
                  value={search}
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
                dataSource={sortedApplicants}
                columns={columns}
                rowKey="id"
                pagination={false}
                loading={false}
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col sm={24} md={12}>
              <p className="category">
                Showing {getLowBound() + 1} to {getHighBound()} of{" "}
                {sortedApplicants.length} entries
              </p>
            </Col>

            <Col sm={24} md={12}>
              <Pagination
                align="end"
                current={pagination.page}
                total={sortedApplicants.length}
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

export default JudgeReviewResults;
