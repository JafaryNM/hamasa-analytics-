// CollaboratorsForm.tsx
import React, { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Avatar from "@/components/ui/Avatar";
import { HiOutlineUser } from "react-icons/hi";
import { TbPlus, TbTrash } from "react-icons/tb";

type Collaborator = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type Option = { value: string; label: string };

// 🔧 Replace with your API data (id, name, email, avatarUrl)
const MOCK_USERS: Collaborator[] = [
  {
    id: "u1",
    name: "Asha Mkapa",
    email: "asha@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "u2",
    name: "John Bosco",
    email: "john@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "u3",
    name: "Neema Paul",
    email: "neema@example.com",
  },
  {
    id: "u4",
    name: "Kelvin Peter",
    email: "kelvin@example.com",
  },
];

const toOption = (u: Collaborator): Option => ({
  value: u.id,
  label: `${u.name} — ${u.email}`,
});

const CollaboratorsForm: React.FC = () => {
  const [hasCollaborators, setHasCollaborators] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [pendingOptions, setPendingOptions] = useState<Option[]>([]);

  const options = useMemo(() => MOCK_USERS.map(toOption), []);

  const addSelected = () => {
    if (!pendingOptions.length) return;
    const selectedIds = new Set(pendingOptions.map((o) => o.value));
    const toAdd = MOCK_USERS.filter(
      (u) => selectedIds.has(u.id) && !collaborators.some((c) => c.id === u.id)
    );
    if (toAdd.length) {
      setCollaborators((prev) => [...prev, ...toAdd]);
      setPendingOptions([]);
    }
  };

  const removeCollaborator = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  const clearAll = () => {
    setCollaborators([]);
    setPendingOptions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Has collaborators:", hasCollaborators);
    console.log("Collaborators:", collaborators);
    // TODO: send to API
  };

  return (
    <form onSubmit={handleSubmit} className=" space-y-6">
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between gap-3 my-4">
          <div>
            <h3 className="text-lg font-semibold">Collaborators</h3>
            <p className="text-sm text-muted-foreground">
              Add teammates who will collaborate on this project.
            </p>
          </div>
          <div className="flex gap-2 my-2">
            <Button
              type="button"
              variant={hasCollaborators ? "default" : "outline"}
              onClick={() => setHasCollaborators(true)}
            >
              I have collaborators
            </Button>
            <Button
              type="button"
              variant={!hasCollaborators ? "default" : "outline"}
              onClick={() => setHasCollaborators(false)}
            >
              No collaborators
            </Button>
          </div>
        </div>

        {/* Selector + actions */}
        {hasCollaborators && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto] items-start">
              <Select
                isMulti
                placeholder="Search & select users..."
                options={options}
                value={pendingOptions}
                onChange={(vals: Option[]) => setPendingOptions(vals)}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  icon={<TbPlus />}
                  onClick={addSelected}
                  disabled={!pendingOptions.length}
                >
                  Add Selected
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearAll}
                  disabled={!collaborators.length && !pendingOptions.length}
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Chips (quick overview) */}
            {collaborators.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1"
                  >
                    <Avatar
                      size="sm"
                      // If your Avatar supports src/alt, these will show the image.
                      // Otherwise it will just use the icon fallback.
                      src={c.avatarUrl as any}
                      alt={c.name}
                      icon={<HiOutlineUser />}
                    />
                    <span className="text-sm">{c.name}</span>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => removeCollaborator(c.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Grid list (detailed) */}
            {collaborators.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border p-4 bg-white/70 shadow-sm flex items-center gap-4"
                  >
                    <Avatar
                      size="lg"
                      src={c.avatarUrl as any}
                      alt={c.name}
                      icon={<HiOutlineUser />}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {c.email}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeCollaborator(c.id)}
                      title="Remove"
                    >
                      <TbTrash className="text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No collaborators added yet.
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            {collaborators.length} collaborator
            {collaborators.length !== 1 ? "s" : ""} added
          </span>
          <Button
            type="submit"
            disabled={hasCollaborators && collaborators.length === 0}
          >
            Save
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default CollaboratorsForm;
