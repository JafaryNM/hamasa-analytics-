import { Award } from "@/@types/award";
import useData from "./useData";
import { District } from "@/@types/district";

const useDistricts = () => useData<District>("/districts");

export default useDistricts;
