import React from "react";
import { Card, Row, Col } from "antd";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Sample data for demonstration purposes
const experienceRatingData = {
  labels: ["Excellent", "Good", "Fair", "Poor"],
  datasets: [
    {
      data: [40, 35, 15, 10],
      backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
    },
  ],
};

const criteriaClarityData = {
  labels: ["Very clear", "Somewhat clear", "Not clear", "Not applicable"],
  datasets: [
    {
      data: [50, 30, 15, 5],
      backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#9E9E9E"],
    },
  ],
};

const supportReceivedData = {
  labels: ["Yes", "Partially", "No"],
  datasets: [
    {
      data: [60, 25, 15],
      backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
    },
  ],
};

const submissionQualityData = {
  labels: ["Very high", "Satisfactory", "Mixed", "Generally low"],
  datasets: [
    {
      data: [30, 40, 20, 10],
      backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
    },
  ],
};

const willingToJudgeData = {
  labels: ["Yes", "No", "Maybe"],
  datasets: [
    {
      data: [70, 10, 20],
      backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
    },
  ],
};

// ✅ New chart data for journalism state
const journalismStateData = {
  labels: ["Thriving", "Declining"],
  datasets: [
    {
      data: [45, 55], // Update with your actual aggregated data
      backgroundColor: ["#4CAF50", "#F44336"],
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const JudgeReviewReport = () => {
  return (
    <Card title="Judge Review Report">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Experience Rating">
            <div style={{ height: 300 }}>
              <Pie data={experienceRatingData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Criteria Clarity">
            <div style={{ height: 300 }}>
              <Pie data={criteriaClarityData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Support Received">
            <div style={{ height: 300 }}>
              <Pie data={supportReceivedData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Submission Quality">
            <div style={{ height: 300 }}>
              <Pie data={submissionQualityData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Willingness to Judge Again">
            <div style={{ height: 300 }}>
              <Pie data={willingToJudgeData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Journalism State: Thriving vs Declining">
            <div style={{ height: 300 }}>
              <Pie data={journalismStateData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default JudgeReviewReport;
