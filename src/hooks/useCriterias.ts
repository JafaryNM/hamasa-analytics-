import useData from "./useData";
import { Criteria } from "@/@types/criteria";

const useCriterias = () => useData<Criteria>("/criterias");

export default useCriterias;
