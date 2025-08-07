import { useToken } from "@/store/authStore";
import axios, { CanceledError } from "axios";

const { token } = useToken();

export default axios.create({
  // baseURL: "http://localhost:4000/ejat-api/v1",
  baseURL: "https://award.ejat.or.tz/ejat-api/v1",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export { CanceledError };
