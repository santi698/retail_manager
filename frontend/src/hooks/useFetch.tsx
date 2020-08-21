import { useState, useEffect, useCallback } from "react";

export interface Idle<T> {
  status: "idle";
}

export interface Loading<T> {
  status: "loading";
}

export interface Reloading<T> {
  status: "reloading";
  data: T;
}

export interface Loaded<T> {
  status: "loaded";
  data: T;
}

export interface LoadError<T> {
  status: "error";
  data?: T;
  error: Error;
}

export type Loadable<T> =
  | Idle<T>
  | Loading<T>
  | Reloading<T>
  | Loaded<T>
  | LoadError<T>;

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
