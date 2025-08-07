import { useEffect, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import withHeaderItem from "@/utils/hoc/withHeaderItem";
import { PiUserDuotone, PiSignOutDuotone, PiUser } from "react-icons/pi";
import { useAuth } from "@/auth";
import journalistService from "@/services/journalistService";
import SettingsSecurity from "@/views/accounts/components/SettingsSecurity";
import { useNavigate } from "react-router-dom";

const _UserDropdown = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getUser = (uuid: string) => {
    setLoading(true);
    const { request } = journalistService.show(uuid);

    request
      .then((response) => {
        if (!response?.data?.data) {
          console.warn("User data not found");
          return;
        }
        setProfile(response.data.data);
      })
      .catch((error) => {
        console.error("Failed to load user profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.uuid) {
      getUser(user.uuid);
    }
  }, [user?.uuid]);

  const handleSignOut = () => {
    signOut();
  };

  const avatarProps = profile?.profilePicUrl
    ? { src: profile.profilePicUrl }
    : profile?.firstName
      ? {
          text: profile.firstName.charAt(0).toUpperCase(),
          className: "bg-primary text-white",
        }
      : { icon: <PiUserDuotone /> };

  return (
    <Dropdown
      className="flex"
      toggleClassName="flex items-center"
      renderTitle={
        <div className="cursor-pointer flex items-center">
          <Avatar size={32} {...avatarProps} />
        </div>
      }
      placement="bottom-end"
    >
      <Dropdown.Item variant="header">
        <div className="py-2 px-3 flex items-center gap-3">
          <Avatar size={40} {...avatarProps} />
          <div>
            <div className="font-bold text-gray-900 dark:text-gray-100">
              {profile?.firstName} {profile?.lastName}
            </div>
            <div className="text-xs">{profile?.type || user?.type}</div>
          </div>
        </div>
      </Dropdown.Item>

      <Dropdown.Item variant="divider" />

      <Dropdown.Item
        eventKey="Sign Out"
        className="gap-2"
        onClick={() => navigate("/profile/account/update-password")}
      >
        <span className="text-xl">
          <PiUser />
        </span>
        <span>Update Passsword</span>
      </Dropdown.Item>

      <Dropdown.Item
        eventKey="Sign Out"
        className="gap-2"
        onClick={handleSignOut}
      >
        <span className="text-xl">
          <PiSignOutDuotone />
        </span>
        <span>Sign Out</span>
      </Dropdown.Item>
    </Dropdown>
  );
};

const UserDropdown = withHeaderItem(_UserDropdown);
export default UserDropdown;
