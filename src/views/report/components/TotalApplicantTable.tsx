import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Button } from "@/components/ui";
import { TbFileDownload, TbFileSpreadsheet } from "react-icons/tb";
import { useRef } from "react";

interface Applicant {
  name: string;
  age: number;
}

const youngestApplicants: Applicant[] = [
  { name: "John Doe", age: 20 },
  { name: "Jane Smith", age: 21 },
  { name: "Tom Johnson", age: 22 },
];

const oldestApplicants: Applicant[] = [
  { name: "Alice Williams", age: 55 },
  { name: "Robert Brown", age: 53 },
  { name: "Michael Lee", age: 51 },
];

const TopApplicantsTable = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "top-applicants-table.png";
      link.click();
    }
  };

  const handleDownloadExcel = () => {
    const csvContent = [
      "Type,Name,Age",
      "Youngest,John Doe,20",
      "Youngest,Jane Smith,21",
      "Youngest,Tom Johnson,22",
      "Oldest,Alice Williams,55",
      "Oldest,Robert Brown,53",
      "Oldest,Michael Lee,51",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "top-applicants.csv";
    link.click();
  };

  const columns: ColumnsType<Applicant> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
  ];

  return (
    <div ref={cardRef} className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold">
          Top 3 Youngest & Oldest Applicants
        </h4>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="solid"
            icon={<TbFileDownload />}
            onClick={handleDownloadImage}
          >
            PNG
          </Button>
          <Button
            size="sm"
            variant="solid"
            icon={<TbFileSpreadsheet />}
            onClick={handleDownloadExcel}
          >
            Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card title="Top 3 Youngest Applicants" bordered>
          <Table
            dataSource={youngestApplicants}
            columns={columns}
            pagination={false}
            rowKey="name"
            size="middle"
            bordered
          />
        </Card>

        <Card title="Top 3 Oldest Applicants" bordered>
          <Table
            dataSource={oldestApplicants}
            columns={columns}
            pagination={false}
            rowKey="name"
            size="middle"
            bordered
          />
        </Card>
      </div>
    </div>
  );
};

export default TopApplicantsTable;
