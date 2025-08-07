import { MediaChannel } from "@/@types/mediaChannel";
import useData from "./useData";

const useMediaChannels = () => useData<MediaChannel>("/media-channels");

export default useMediaChannels;
