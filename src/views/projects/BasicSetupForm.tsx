import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { TbPlus } from "react-icons/tb";
import Textarea from "../ui-components/forms/Input/Textarea";
import { Card } from "@/components/ui";

const categoryOptions = [
  { value: "politics", label: "Politics" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "education", label: "Education" },
];

type MonitoringLine = { question: string };
type ThematicArea = {
  title: string;
  description: string;
  monitoringLines: MonitoringLine[];
};

const BasicSetupForm = () => {
  const [project, setProject] = useState({
    title: "",
    category: "",
    description: "",
  });

  const handleAddThematicArea = () => {
    setThematicAreas([
      ...thematicAreas,
      { title: "", description: "", monitoringLines: [{ question: "" }] },
    ]);
  };

  const handleChangeThematic = (
    index: number,
    field: keyof ThematicArea,
    value: string
  ) => {
    const updated = [...thematicAreas];
    updated[index][field] = value;
    setThematicAreas(updated);
  };

  const handleMonitoringLineChange = (
    areaIndex: number,
    lineIndex: number,
    value: string
  ) => {
    const updated = [...thematicAreas];
    updated[areaIndex].monitoringLines[lineIndex].question = value;
    setThematicAreas(updated);
  };

  const handleAddMonitoringLine = (index: number) => {
    const updated = [...thematicAreas];
    updated[index].monitoringLines.push({ question: "" });
    setThematicAreas(updated);
  };

  return (
    <Card className="">
      <div className="space-y-8">
        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium">Title of the Project</label>
            <Input
              placeholder="Enter project title"
              value={project.title}
              onChange={(e) =>
                setProject((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="font-medium">Category</label>
            <Select
              placeholder="Select category"
              value={project.category}
              onChange={(val) =>
                setProject((prev) => ({ ...prev, category: val?.value }))
              }
              options={categoryOptions}
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-medium">Short Project Description</label>
            <Textarea
              placeholder="Describe your project (max 100 words)"
              rows={4}
              value={project.description}
              onChange={(e) =>
                setProject((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BasicSetupForm;
