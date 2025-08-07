import { UserLog } from "@/@types/userLog";
import useData from "./useData";

const useUserLogs = (uuid: string) =>
  useData<UserLog>(`/user-logs/user/${uuid}`, {
    search: "",
    page: 1,
    perPage: 7,
  });

export default useUserLogs;
