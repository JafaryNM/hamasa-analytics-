// ReportsForm.tsx
import React, { useState, useMemo, ChangeEvent } from "react";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Radio from "@/components/ui/Radio";
import Checkbox from "@/components/ui/Checkbox";

type ReportsFormData = {
  deliveryMethods: string[]; // <-- multiple selections now
  reportPeriod: string;
  consultationFrequency: string;
};

const DELIVERY_METHODS = [
  "Through Dashboard",
  "Through E-mail",
  "Mobile phone SMS Notification",
];

const REPORT_PERIODS = ["Daily", "Once per week", "Once per month"];

const CONSULTATION_FREQS = [
  "Once per week",
  "Once per two week",
  "Once per month",
];

const ReportsForm: React.FC = () => {
  const [formData, setFormData] = useState<ReportsFormData>({
    deliveryMethods: [],
    reportPeriod: "",
    consultationFrequency: "",
  });

  // radios (single-select) handler
  const handleRadioChange =
    (field: "reportPeriod" | "consultationFrequency") =>
    (_checked: boolean, e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // checkboxes (multi-select) toggle
  const toggleDeliveryMethod = (method: string, checked: boolean) => {
    setFormData((prev) => {
      const exists = prev.deliveryMethods.includes(method);
      let next: string[];
      if (checked && !exists) next = [...prev.deliveryMethods, method];
      else if (!checked && exists)
        next = prev.deliveryMethods.filter((m) => m !== method);
      else next = prev.deliveryMethods;
      return { ...prev, deliveryMethods: next };
    });
  };

  const canSubmit = useMemo(
    () =>
      formData.deliveryMethods.length > 0 &&
      !!formData.reportPeriod &&
      !!formData.consultationFrequency,
    [formData]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: API call
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Report Preferences
            </h3>
            <p className="mt-1 text-sm text-muted-foreground py-4">
              Choose how you want to receive reports and how often to meet our
              experts.
            </p>
          </div>
        </div>

        {/* Delivery Method (MULTI-SELECT) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold text-foreground">
              Delivery Method
            </h4>
            <span className="text-[11px] px-2 py-1 rounded-full bg-muted text-foreground/70">
              {formData.deliveryMethods.length} selected
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERY_METHODS.map((method) => {
              const selected = formData.deliveryMethods.includes(method);
              return (
                <div
                  key={method}
                  className={`rounded-lg border p-3 transition hover:bg-muted/30 ${
                    selected ? "border-primary/50 ring-1 ring-primary/30" : ""
                  }`}
                >
                  <Checkbox
                    checked={selected}
                    onChange={(value: boolean) =>
                      toggleDeliveryMethod(method, value)
                    }
                  >
                    {method}
                  </Checkbox>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Report Period (SINGLE-SELECT) */}
        <section className="space-y-3">
          <h4 className="text-base font-semibold text-foreground">
            Period for receiving analyzed report
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REPORT_PERIODS.map((period) => {
              const selected = formData.reportPeriod === period;
              return (
                <div
                  key={period}
                  className={`rounded-lg border p-3 transition hover:bg-muted/30 ${
                    selected ? "border-primary/50 ring-1 ring-primary/30" : ""
                  }`}
                >
                  <Radio
                    name="reportPeriod"
                    value={period}
                    checked={selected}
                    onChange={handleRadioChange("reportPeriod")}
                  >
                    {period}
                  </Radio>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-full bg-border" />

        {/* Consultation Frequency (SINGLE-SELECT) */}
        <section className="space-y-3">
          <h4 className="text-base font-semibold text-foreground">
            Frequency of consultation meetings with our experts
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONSULTATION_FREQS.map((freq) => {
              const selected = formData.consultationFrequency === freq;
              return (
                <div
                  key={freq}
                  className={`rounded-lg border p-3 transition hover:bg-muted/30 ${
                    selected ? "border-primary/50 ring-1 ring-primary/30" : ""
                  }`}
                >
                  <Radio
                    name="consultationFrequency"
                    value={freq}
                    checked={selected}
                    onChange={handleRadioChange("consultationFrequency")}
                  >
                    {freq}
                  </Radio>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary text-white hover:text-white"
            disabled={!canSubmit}
          >
            Creat Project
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default ReportsForm;
