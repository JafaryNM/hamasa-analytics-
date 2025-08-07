import { JournalistUser } from "@/@types/journalistUser";
import useData from "./useData";

const useJournalistUsers = () => useData<JournalistUser>("/users/journalists");

export default useJournalistUsers;
