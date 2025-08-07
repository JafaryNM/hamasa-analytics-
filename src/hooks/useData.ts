import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/apiClient";

export interface Pagination {
  search: string;
  page: number;
  perPage: number;
}

interface FetchResponse<T> {
  page: number;
  perPage: number;
  total: number;
  data: T[];
}

const useData = <T>(
  endpoint: string,
  otherParams = {},
  defaultPagination: Pagination = { search: "", page: 1, perPage: 10 }
) => {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<Pagination>(defaultPagination);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    apiClient
      .get<FetchResponse<T>>(endpoint, {
        signal: controller.signal,
        params: { ...pagination, ...otherParams },
      })
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(async (error) => {
        if (error instanceof CanceledError) return;
        if (error.status == 401) {
          setAuthenticated(false);
        }
        setError(error.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [pagination]);

  return {
    data,
    total,
    error,
    isLoading,
    pagination,
    setPagination,
    authenticated,
  };
};

export default useData;
