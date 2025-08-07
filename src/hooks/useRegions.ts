import useData from "./useData";
import { District } from "@/@types/district";

const useRegions = () => useData<District>("/regions");

export default useRegions;
