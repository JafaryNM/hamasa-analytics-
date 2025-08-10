import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { TbPlus, TbEdit, TbTrash, TbCheck, TbX } from "react-icons/tb";
import Textarea from "../ui-components/forms/Input/Textarea";
import Card from "@/components/ui/Card";

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

  const handleRemoveMonitoringLine = (areaIndex: number, lineIndex: number) => {
    const updated = [...thematicAreas];
    updated[areaIndex].monitoringLines = updated[
      areaIndex
    ].monitoringLines.filter((_, i) => i !== lineIndex);
    setThematicAreas(updated);
  };

  const handleAddThematicArea = () => {
    setThematicAreas((prev) => [
      ...prev,
      { title: "", description: "", monitoringLines: [{ question: "" }] },
    ]);
    setEditStates((prev) => [...prev, true]);
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
    <Card className="space-y-5">
      {/* Header */}
      <div className="flex items-start md:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Key Thematic Areas</h3>
          <p className="text-sm text-muted-foreground">
            List the key thematic areas for monitoring and receiving analyzed
            reports.
          </p>
        </div>

        <div className="flex items-center gap-2 my-4">
          <span className="hidden md:inline-flex text-xs px-2 py-1 rounded-full bg-muted text-foreground/70">
            {thematicAreas.length} area{thematicAreas.length !== 1 ? "s" : ""}
          </span>
          <Button
            type="button"
            variant="outline"
            icon={<TbPlus />}
            onClick={handleAddThematicArea}
          >
            Add Thematic Area
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {thematicAreas.length === 0 && (
        <div className="rounded-2xl border border-dashed p-8 text-center bg-gray-50">
          <p className="text-sm text-muted-foreground mb-3">
            No thematic areas yet.
          </p>
          <Button
            variant="outline"
            icon={<TbPlus />}
            onClick={handleAddThematicArea}
          >
            Add your first area
          </Button>
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {thematicAreas.map((area, index) => {
          const isEditing = editStates[index];
          return (
            <div
              key={index}
              className={[
                "rounded-2xl p-5 shadow-sm border transition-all",
                isEditing
                  ? "ring-1 ring-primary/30 border "
                  : "border-gray-200 hover:shadow-md",
              ].join(" ")}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </span>
                  <h4 className="text-base font-semibold">
                    {area.title?.trim()
                      ? area.title
                      : `Thematic Area ${index + 1}`}
                  </h4>
                </div>
                <div className="flex gap-1">
                  <span
                    className={[
                      "px-2 py-1 rounded-full text-[11px] font-medium",
                      isEditing
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-600",
                    ].join(" ")}
                  >
                    {isEditing ? "Editing" : "Locked"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mb-4">
                <Button
                  size="sm"
                  variant="ghost"
                  title={isEditing ? "Done" : "Edit"}
                  onClick={() => toggleEdit(index)}
                  icon={isEditing ? <TbCheck /> : <TbEdit />}
                >
                  {isEditing ? "Done" : "Edit"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  title="Delete"
                  onClick={() => handleDeleteThematicArea(index)}
                  icon={<TbTrash />}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>

              {/* Title */}
              <div className="space-y-1 mb-3">
                <label className="text-sm font-medium">Title</label>
                <Input
                  disabled={!isEditing}
                  placeholder={`Title ${index + 1}`}
                  value={area.title}
                  onChange={(e) =>
                    handleChangeThematic(index, "title", e.target.value)
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-1 mb-4">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  disabled={!isEditing}
                  placeholder="Short description"
                  rows={3}
                  value={area.description}
                  onChange={(e) =>
                    handleChangeThematic(index, "description", e.target.value)
                  }
                />
              </div>

              {/* Monitoring Lines */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-sm">
                    Monitoring Lines
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({area.monitoringLines.length})
                    </span>
                  </h5>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<TbPlus />}
                      onClick={() => handleAddMonitoringLine(index)}
                    >
                      Add Line
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {area.monitoringLines.map((line, lineIndex) => (
                    <div key={lineIndex} className="flex items-center gap-2">
                      <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {lineIndex + 1}
                      </span>
                      <Input
                        className="flex-1"
                        disabled={!isEditing}
                        value={line.question}
                        placeholder={`Question ${lineIndex + 1}`}
                        onChange={(e) =>
                          handleMonitoringLineChange(
                            index,
                            lineIndex,
                            e.target.value
                          )
                        }
                      />
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Remove"
                          onClick={() =>
                            handleRemoveMonitoringLine(index, lineIndex)
                          }
                        >
                          <TbX />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer add button */}
      {thematicAreas.length > 0 && (
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            icon={<TbPlus />}
            onClick={handleAddThematicArea}
          >
            Add Thematic Area
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ThematicAreaForm;
