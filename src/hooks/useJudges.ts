import useData from "./useData";
import { Judge } from "@/@types/judge";

const useJudges = () => useData<Judge>("/users/judges");

export default useJudges;
