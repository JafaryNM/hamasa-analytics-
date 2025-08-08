import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { TbPlus, TbEdit, TbTrash } from "react-icons/tb";
import Textarea from "../ui-components/forms/Input/Textarea";

type MonitoringLine = { question: string };
type ThematicArea = {
  title: string;
  description: string;
  monitoringLines: MonitoringLine[];
};

const ThematicAreaForm = () => {
  const [thematicAreas, setThematicAreas] = useState<ThematicArea[]>([
    { title: "", description: "", monitoringLines: [{ question: "" }] },
    { title: "", description: "", monitoringLines: [{ question: "" }] },
  ]);

  const [editStates, setEditStates] = useState<boolean[]>(
    thematicAreas.map(() => true)
  );

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

  const handleAddThematicArea = () => {
    setThematicAreas([
      ...thematicAreas,
      { title: "", description: "", monitoringLines: [{ question: "" }] },
    ]);
    setEditStates([...editStates, true]);
  };

  const handleDeleteThematicArea = (index: number) => {
    const updated = thematicAreas.filter((_, i) => i !== index);
    const updatedEdit = editStates.filter((_, i) => i !== index);
    setThematicAreas(updated);
    setEditStates(updatedEdit);
  };

  const toggleEdit = (index: number) => {
    const updated = [...editStates];
    updated[index] = !updated[index];
    setEditStates(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Key Thematic Areas</h3>
        <p className="text-sm text-muted-foreground">
          List the key thematic areas for monitoring and receiving analyzed
          reports.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {thematicAreas.map((area, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold">
                Thematic Area {index + 1}
              </h4>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  title="Edit"
                  onClick={() => toggleEdit(index)}
                >
                  <TbEdit className="text-primary" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Delete"
                  onClick={() => handleDeleteThematicArea(index)}
                >
                  <TbTrash className="text-red-500" />
                </Button>
              </div>
            </div>

            {/* Thematic Title */}
            <div>
              <label className="font-medium">Title</label>
              <Input
                disabled={!editStates[index]}
                placeholder={`Title ${index + 1}`}
                value={area.title}
                onChange={(e) =>
                  handleChangeThematic(index, "title", e.target.value)
                }
              />
            </div>

            {/* Thematic Description */}
            <div>
              <label className="font-medium">Description</label>
              <Textarea
                disabled={!editStates[index]}
                placeholder="Short description"
                rows={2}
                value={area.description}
                onChange={(e) =>
                  handleChangeThematic(index, "description", e.target.value)
                }
              />
            </div>

            {/* Monitoring Lines */}
            <div className="space-y-2">
              <h5 className="font-semibold text-sm">Monitoring Lines</h5>
              {area.monitoringLines.map((line, lineIndex) => (
                <Input
                  key={lineIndex}
                  disabled={!editStates[index]}
                  value={line.question}
                  placeholder={`Question ${lineIndex + 1}`}
                  onChange={(e) =>
                    handleMonitoringLineChange(index, lineIndex, e.target.value)
                  }
                />
              ))}
              {editStates[index] && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<TbPlus />}
                  onClick={() => handleAddMonitoringLine(index)}
                >
                  Add Monitoring Line
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Thematic Area */}
      <Button
        type="button"
        variant="outline"
        icon={<TbPlus />}
        onClick={handleAddThematicArea}
        className="mt-4"
      >
        Add Thematic Area
      </Button>
    </div>
  );
};

export default ThematicAreaForm;
