// import React from "react";

// function SourcesForm() {
//   return <div>SourcesForm</div>;
// }

// export default SourcesForm;

// MediaSourcesPicker.tsx
import React, { useMemo, useState } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

type Option = { value: string; label: string; color?: string };

type MediaSelections = {
  radio: Option[];
  newspaper: Option[];
  tv: Option[];
  digital: Option[];
};

type Props = {
  initial?: Partial<MediaSelections>;
  onChange?: (values: MediaSelections) => void;
};

const radioOptions: Option[] = [
  { value: "clouds", label: "Clouds FM", color: "#37AFE3" },
  { value: "efm", label: "E FM" },
  { value: "times", label: "Times FM" },
  { value: "wasafi", label: "Wasafi FM" },
  { value: "radioone", label: "Radio One" },
];

const newspaperOptions: Option[] = [
  { value: "mwananchi", label: "Mwananchi" },
  { value: "nipashe", label: "Nipashe" },
  { value: "thecitizen", label: "The Citizen" },
  { value: "habarileo", label: "HabariLeo" },
];

const tvOptions: Option[] = [
  { value: "itv", label: "ITV" },
  { value: "tbc", label: "TBC" },
  { value: "wasafi_tv", label: "Wasafi TV" },
  { value: "azamtv", label: "Azam TV" },
];

const digitalOptions: Option[] = [
  { value: "mwananchi_digital", label: "Mwananchi Digital" },
  { value: "jamii_forums", label: "JamiiForums" },
  { value: "millard_ayo", label: "Millard Ayo" },
  { value: "global_publishers", label: "Global Publishers" },
  { value: "twitter_x", label: "X (Twitter)" },
  { value: "facebook", label: "Facebook Pages" },
];

const Card: React.FC<
  React.PropsWithChildren<{ title: string; count?: number }>
> = ({ title, count = 0, children }) => (
  <div className="rounded-2xl border bg-white shadow-sm p-4 space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold">{title}</h4>
      <span className="text-[11px] px-2 py-1 rounded-full bg-muted text-foreground/70">
        {count} selected
      </span>
    </div>
    {children}
  </div>
);

const SourcesForm: React.FC<Props> = ({ initial, onChange }) => {
  const [radio, setRadio] = useState<Option[]>(initial?.radio ?? []);
  const [newspaper, setNewspaper] = useState<Option[]>(
    initial?.newspaper ?? []
  );
  const [tv, setTv] = useState<Option[]>(initial?.tv ?? []);
  const [digital, setDigital] = useState<Option[]>(initial?.digital ?? []);

  const selections = useMemo<MediaSelections>(
    () => ({ radio, newspaper, tv, digital }),
    [radio, newspaper, tv, digital]
  );

  const handleEmit = (next: Partial<MediaSelections>) => {
    const merged = { ...selections, ...next } as MediaSelections;
    onChange?.(merged);
  };

  const clearAll = () => {
    setRadio([]);
    setNewspaper([]);
    setTv([]);
    setDigital([]);
    onChange?.({ radio: [], newspaper: [], tv: [], digital: [] });
  };

  return (
    <Card>
      <div>
        <h3 className="text-lg font-semibold">
          Identify media sources to monitor
        </h3>
        <p className="text-sm text-muted-foreground">
          Select Radio, Newspaper, TV, and Digital platforms you want to track.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Select Radio" count={radio.length}>
          <Select
            isMulti
            placeholder="Choose radio stations"
            options={radioOptions}
            value={radio}
            onChange={(val: Option[]) => {
              setRadio(val);
              handleEmit({ radio: val });
            }}
          />
        </Card>

        <Card title="Select Newspaper" count={newspaper.length}>
          <Select
            isMulti
            placeholder="Choose newspapers"
            options={newspaperOptions}
            value={newspaper}
            onChange={(val: Option[]) => {
              setNewspaper(val);
              handleEmit({ newspaper: val });
            }}
          />
        </Card>

        <Card title="Select TV" count={tv.length}>
          <Select
            isMulti
            placeholder="Choose TV stations"
            options={tvOptions}
            value={tv}
            onChange={(val: Option[]) => {
              setTv(val);
              handleEmit({ tv: val });
            }}
          />
        </Card>

        <Card title="Select Digital Platform" count={digital.length}>
          <Select
            isMulti
            placeholder="Choose digital platforms"
            options={digitalOptions}
            value={digital}
            onChange={(val: Option[]) => {
              setDigital(val);
              handleEmit({ digital: val });
            }}
          />
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={clearAll}>
          Clear all
        </Button>
        {/* Example: read current selections */}
        <div className="text-xs text-muted-foreground">
          {radio.length + newspaper.length + tv.length + digital.length} total
          selected
        </div>
      </div>
    </Card>
  );
};

export default SourcesForm;
