import useData from "./useData";
import { Organization } from "@/@types/organization";

const useOrganizations = () => useData<Organization>("/organizations");

export default useOrganizations;
