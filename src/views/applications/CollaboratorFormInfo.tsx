import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { BiPlus, BiTrash } from "react-icons/bi";
import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import { Col, Row, Table } from "antd";
import {
  Button,
  Dialog,
  Input,
  Notification,
  Tag,
  toast,
} from "@/components/ui";
import userService from "@/services/userService";
import applicationService from "@/services/applicationService";
import { JournalistUser } from "@/@types/journalistUser";
import { CanceledError } from "axios";
import { useAuth } from "@/auth";

interface CollaboratorProps {
  onNext: () => void;
  onPrev: () => void;
  updateFormData: (newData: Record<string, any>) => void;
  formData: Record<string, any>;
}

interface MemberInterface {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface MemberWrapper {
  uuid: string;
  member: MemberInterface;
}

const CollaboratorFormInfo = ({
  onNext,
  updateFormData,
  onPrev,
  formData,
}: CollaboratorProps) => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<MemberWrapper[]>([]);
  const [journalists, setJournalists] = useState<JournalistUser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<MemberWrapper | null>(
    null
  );

  useEffect(() => {
    if (Array.isArray(formData?.members)) {
      const mapped = formData.members
        .filter((item: any) => item?.member)
        .map((item: any) => ({
          uuid: item.uuid,
          member: item.member,
        }))
        .filter(
          (m) =>
            m.member.uuid !== user?.uuid &&
            m.member.firstName?.trim() &&
            m.member.lastName?.trim()
        );

      setMembers(mapped);
    } else {
      setMembers([]);
    }
  }, [formData, user]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const getSearchMemberResults = () => {
    setIsSearching(true);
    const { request } = userService.list(
      { page: 1, size: 10000, search },
      "/journalists-email-phone"
    );
    request
      .then((res) => {
        if (res.data.data) {
          setJournalists(res.data.data);
        }
        setIsSearching(false);
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) {
          console.error(error);
        }
        setIsSearching(false);
      });
  };

  const handleAddCollaborator = (member: MemberInterface) => {
    if (
      member.uuid &&
      member.firstName?.trim() &&
      member.lastName?.trim() &&
      !members.some((col) => col.member.uuid === member.uuid)
    ) {
      setMembers((prev) => [...prev, { uuid: crypto.randomUUID(), member }]);
    }
    setSearch("");
    setJournalists([]);
  };

  const confirmRemoveCollaborator = (member: MemberWrapper) => {
    setMemberToDelete(member);
    setConfirmDelete(true);
  };

  const deleteCollaborator = async () => {
    if (!memberToDelete) return;

    try {
      await applicationService.delete(`/member/${memberToDelete.uuid}`);
      setMembers((prev) => prev.filter((m) => m.uuid !== memberToDelete.uuid));
      toast.push(
        <Notification type="success" title="Deleted">
          Collaborator removed successfully.
        </Notification>
      );
    } catch (error) {
      toast.push(
        <Notification type="danger" title="Delete Failed">
          {error.response?.data?.message || "Unable to delete collaborator."}
        </Notification>
      );
    } finally {
      setConfirmDelete(false);
      setMemberToDelete(null);
    }
  };

  const handleSaveAndNext = () => {
    if (!formData?.uuid) {
      toast.push(
        <Notification type="danger" title="Missing Application ID">
          Unable to save collaborators because application UUID is missing.
        </Notification>
      );
      return;
    }

    setIsSaving(true);

    const memberUuids = members
      .filter((m) => m?.member?.uuid && m.member.uuid !== user?.uuid)
      .map((m) => m.member.uuid);

    applicationService
      .update({ uuid: formData.uuid, members: memberUuids }, "/collaborators")
      .then((res) => {
        if (res.data.success) {
          updateFormData({ members });
          toast.push(
            <Notification type="success" title="Collaborators Saved">
              You have successfully added your collaborators.
            </Notification>
          );
          setTimeout(() => {
            setIsSaving(false);
            onNext();
          }, 500);
        } else {
          toast.push(
            <Notification type="danger" title="Save Failed">
              {res.data.message || "Failed to update collaborators."}
            </Notification>
          );
          setIsSaving(false);
        }
      })
      .catch((error) => {
        toast.push(
          <Notification type="danger" title="Save Failed">
            {error.response?.data?.message || "Something went wrong."}
          </Notification>
        );
        setIsSaving(false);
      });
  };

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Collaborators</h3>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 text-white bg-green-500 rounded-md"
            >
              <BiPlus size={20} className="mr-2" /> Add Collaborator
            </button>
          </div>
        </div>

        <Table
          dataSource={members}
          columns={[
            {
              title: "S/n",
              render: (_: any, __: any, index: number) => index + 1,
            },
            {
              title: "Full Name",
              render: (record: any) =>
                `${record.member?.firstName ?? ""} ${record.member?.lastName ?? ""}`,
            },
            {
              title: "Email",
              render: (record: any) => record.member?.email ?? "-",
            },
            {
              title: "Phone",
              render: (record: any) => record.member?.phone ?? "-",
            },
            {
              title: "Action",
              render: (record: any) => (
                <button
                  type="button"
                  onClick={() => confirmRemoveCollaborator(record)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <BiTrash size={20} />
                </button>
              ),
            },
          ]}
          rowKey="uuid"
          pagination={false}
        />

        <Dialog isOpen={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <h4 className="mb-4">Confirm Delete</h4>
          <p>Are you sure you want to remove this collaborator?</p>
          <div className="text-right mt-6">
            <Button
              className="mr-2"
              variant="plain"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button variant="solid" onClick={deleteCollaborator}>
              Delete
            </Button>
          </div>
        </Dialog>

        <Dialog isOpen={showModal} onClose={() => setShowModal(false)}>
          <h4 className="mb-4 text-center">Add Collaborator</h4>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by email or phone"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && getSearchMemberResults()}
              />
              <Button
                variant="solid"
                icon={<TbSearch className="text-lg" />}
                onClick={getSearchMemberResults}
                loading={isSearching}
              >
                Search
              </Button>
            </div>

            {journalists.length > 0 && (
              <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
                {journalists.map((journalist) => (
                  <div
                    key={journalist.uuid}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddCollaborator(journalist)}
                  >
                    <div>
                      <p className="font-medium">{`${journalist.firstName} ${journalist.lastName}`}</p>
                      <p className="text-sm text-gray-600">
                        {journalist.email}
                      </p>
                    </div>
                    <Button size="sm" variant="default">
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {members.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">
                  Selected Collaborators:
                </p>
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => (
                    <Tag
                      key={member.member.uuid}
                      className="flex items-center gap-2 m-1"
                    >
                      {`${member.member.firstName} ${member.member.lastName}`}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <div className="text-right mt-4">
              <Button variant="plain" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="solid"
                className="ml-2"
                onClick={() => setShowModal(false)}
              >
                OK
              </Button>
            </div>
          </div>
        </Dialog>

        <Row className="mt-4">
          <Col span={24} className="flex justify-between">
            <Button variant="solid" onClick={onPrev}>
              Back
            </Button>
            <Button
              variant="solid"
              onClick={handleSaveAndNext}
              loading={isSaving}
            >
              {isSaving ? "Saving..." : "Save & Next stages"}
            </Button>
          </Col>
        </Row>
      </AdaptiveCard>
    </Container>
  );
};

export default CollaboratorFormInfo;
