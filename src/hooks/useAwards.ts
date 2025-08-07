import { Award } from "@/@types/award";
import useData from "./useData";

const useAwards = () => useData<Award>("/awards");

export default useAwards;
