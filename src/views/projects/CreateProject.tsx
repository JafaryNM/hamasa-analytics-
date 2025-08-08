import { useState } from "react";
import Steps from "@/components/ui/Steps";
import Button from "@/components/ui/Button";
import BasicSetupForm from "./BasicSetupForm";
import ThematicAreaForm from "./ThematicAreaForm";
import SourcesForm from "./SourcesForm";
import ReportsForm from "./ReportsForm";
// import CollaboratorsForm from "./CollaboratorsForm"
import { Card } from "@/components/ui";

const steps = [
  "Basic Setup",
  "Thematic Areas",
  "Sources",
  "Reports",
  "Collaborators",
];

const CreateProject = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicSetupForm />;
      case 1:
        return <ThematicAreaForm />;
      case 2:
        return <SourcesForm />;
      case 3:
        return <ReportsForm />;
      case 4:
        return (
          <div className="text-muted-foreground">
            Collaborators form not implemented yet.
          </div>
          // return <CollaboratorsForm />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold">New Project</h2>
        <p className="text-gray-600">
          Complete the steps below to set up a project to monitor and generate
          reports.
        </p>
      </div>

      {/* Step Navigation */}
      <Steps current={currentStep}>
        {steps.map((title, index) => (
          <Steps.Item key={index} title={title} />
        ))}
      </Steps>

      {/* Step Content */}
      <div className="mt-6">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
          Next
        </Button>
      </div>
    </Card>
  );
};

export default CreateProject;
