import React, { useState, useMemo } from "react";
import { Table, Col, Row, Pagination, Button, Drawer, Select, Tag } from "antd";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";

const JudgeResults = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const winnersData = [
    { name: "John Doe", category: "Print Journalism", score: 95, position: 1 },
    {
      name: "Alice Smith",
      category: "Radio Journalism",
      score: 91,
      position: 2,
    },
    {
      name: "Michael Lee",
      category: "Online Journalism",
      score: 88,
      position: 3,
    },
    { name: "Grace Kim", category: "TV Journalism", score: 85, position: 4 },
    { name: "David King", category: "Photojournalism", score: 82, position: 5 },
    {
      name: "Sandra Park",
      category: "Environmental Reporting",
      score: 80,
      position: 6,
    },
    { name: "James Hall", category: "Data Journalism", score: 78, position: 7 },
  ];

  const handleFilterChange = (value) => {
    setFilterCategory(value); // Update the filter category state
  };

  // Memoize the filtered categories
  const filteredCategories = useMemo(() => {
    let filtered = winnersData;
    if (filterCategory) {
      filtered = winnersData.filter(
        (winner) => winner.category === filterCategory
      );
    }

    // Group by category and take top 3 winners based on score
    const categories = filtered.reduce((acc, winner) => {
      if (!acc[winner.category]) {
        acc[winner.category] = [];
      }
      acc[winner.category].push(winner);
      return acc;
    }, {});

    // Sort and take top 3 in each category
    for (const category in categories) {
      categories[category] = categories[category]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Only take the top 3
    }

    return categories;
  }, [filterCategory]);

  const applyFilter = () => {
    setFilteredData(Object.values(filteredCategories).flat());
    setIsDrawerOpen(false);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const columns = [
    {
      title: "S/N",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * perPage + index + 1,
    },
    {
      title: "Winner Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
  ];

  // Get the overall winner based on the highest score across all categories
  const overallWinner = useMemo(() => {
    return winnersData.reduce((max, winner) =>
      winner.score > max.score ? winner : max
    );
  }, [winnersData]);

  return (
    <Container>
      <AdaptiveCard>
        <h3 className="mb-4 font-semibold">List of Winners</h3>

        <Row className="mt-5">
          <Col span={18}>
            <Table
              dataSource={paginatedData}
              columns={columns}
              rowKey={(record) => record.name + record.position}
              pagination={false}
            />
          </Col>
          <Col span={6}>
            <div className="filter-sidebar">
              <Button onClick={() => setIsDrawerOpen(true)} className="mb-4">
                Open Filter
              </Button>

              <div className="overall-winners">
                <h4>Overall Winner</h4>
                <ul>
                  <li>
                    {overallWinner.name} - {overallWinner.category}
                  </li>
                  <li>Score: {overallWinner.score}</li>
                </ul>
              </div>

              <h4>Top 3 Winners by Category</h4>
              {Object.keys(filteredCategories).map((category) => (
                <div key={category}>
                  <h5>{category}</h5>
                  <ul>
                    {filteredCategories[category].map((winner, index) => (
                      <li key={index}>
                        {winner.name} (Score: {winner.score})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col sm={24} md={12}>
            <p className="category">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
          </Col>
          <Col sm={24} md={12}>
            <Pagination
              align="end"
              current={currentPage}
              total={filteredData.length}
              pageSize={perPage}
              onChange={(page) => setCurrentPage(page)}
            />
          </Col>
        </Row>

        <Drawer
          title="Filter Results"
          placement="right"
          onClose={() => setIsDrawerOpen(false)}
          visible={isDrawerOpen}
        >
          <div className="filter-content">
            <div className="filter-item">
              <label>Category</label>
              <Select
                value={filterCategory}
                onChange={handleFilterChange} // Make sure handleFilterChange is used here
                style={{ width: "100%" }}
              >
                <Select.Option value="">All Categories</Select.Option>
                <Select.Option value="Print Journalism">
                  Print Journalism
                </Select.Option>
                <Select.Option value="Radio Journalism">
                  Radio Journalism
                </Select.Option>
                <Select.Option value="Online Journalism">
                  Online Journalism
                </Select.Option>
                <Select.Option value="TV Journalism">
                  TV Journalism
                </Select.Option>
                <Select.Option value="Photojournalism">
                  Photojournalism
                </Select.Option>
                <Select.Option value="Environmental Reporting">
                  Environmental Reporting
                </Select.Option>
                <Select.Option value="Data Journalism">
                  Data Journalism
                </Select.Option>
              </Select>
            </div>
            <Button
              type="primary"
              onClick={applyFilter}
              style={{ marginTop: 20, width: "100%" }}
            >
              Apply Filter
            </Button>
          </div>
        </Drawer>
      </AdaptiveCard>
    </Container>
  );
};

export default JudgeResults;
