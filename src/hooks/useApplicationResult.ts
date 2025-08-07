import { ApplicationResult } from "@/@types/award";
import useData from "./useData";

const useApplicationResult = () =>
  useData<ApplicationResult>("/application-report");

export default useApplicationResult;
