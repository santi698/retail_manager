import { useState, useEffect, useCallback } from "react";
import { Loadable } from "../Loadable";

export interface UseFetchResult<T> {
  data: Loadable<T>;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<Loadable<T>>({ status: "idle" });

  const fetchData = useCallback(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: T) => setData({ status: "loaded", data }));
    return () => {
      controller.abort();
    };
  }, [url]);

  useEffect(() => {
    setData({ status: "loading" });
    return fetchData();
  }, [fetchData]);

  return { data, refetch: fetchData };
}
