import { Occupation } from "@/@types/occupation";
import useData from "./useData";

const useOccupations = () => useData<Occupation>("/occupations");

export default useOccupations;
