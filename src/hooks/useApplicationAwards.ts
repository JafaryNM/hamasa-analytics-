import { ApplicationAward } from "@/@types/applicationAward";
import useData from "./useData";

const useApplicationAwards = (params = {}) =>
  useData<ApplicationAward>("/applications", params);

export default useApplicationAwards;
