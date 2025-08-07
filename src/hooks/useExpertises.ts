import { Expertise } from "@/@types/expertise";
import useData from "./useData";

const useExpertises = () => useData<Expertise>("/expertises");

export default useExpertises;
