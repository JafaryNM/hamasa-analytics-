import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/apiClient";
import { AdminReportData } from "@/@types/AdminReportData";

const useAdminReports = () => {
  const [data, setData] = useState<AdminReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    apiClient
      .get<AdminReportData>("/admin-report", {
        signal: controller.signal,
      })
      .then((res) => {
        setData(res.data);
        setAuthenticated(true);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;

        if (error.response?.status === 401) {
          setAuthenticated(false);
        }

        setError(error.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return {
    data,
    isLoading,
    error,
    authenticated,
  };
};

export default useAdminReports;
