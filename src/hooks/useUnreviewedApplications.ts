import { ApplicationAward } from "@/@types/applicationAward";
import useData from "./useData";

const useUnreviewedApplications = (params = {}) =>
  useData<ApplicationAward>("/applications/judge-unreviewed", params);

export default useUnreviewedApplications;
