import { Role } from "../services/roleService";
import useData from "./useData";

const useRoles = () => useData<Role>("/roles");

export default useRoles;
