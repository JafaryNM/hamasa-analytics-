import { Award } from "@/@types/award";
import useData from "./useData";

const useApplications = () => useData<Award>("/applications/member");

export default useApplications;
