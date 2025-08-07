import { EducationLevel } from "@/@types/educationLevel";
import useData from "./useData";

const useEducationLevels = () => useData<EducationLevel>("/education-levels");

export default useEducationLevels;
