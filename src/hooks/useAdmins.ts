import useData from "./useData";
import { Admin } from "@/@types/Results";

const useAdmins = () => useData<Admin>("/users/admins");

export default useAdmins;
