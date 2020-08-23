import { useState, useEffect, useCallback } from "react";
import { Loadable, Idle } from "../Loadable";

export interface UseFetchResult<T> {
  data: Loadable<T>;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<Loadable<T>>(new Idle<T>());

  const fetchData = useCallback(() => {
    const controller = new AbortController();
    setData((prev) => {
      switch (prev.state) {
        case "idle":
          return prev.onLoadingStarted();
        case "loaded":
          return prev.onReloadStarted();
        case "error":
          return prev.onRetry();
        default:
          throw new Error(`Loading started on invalid state ${prev.state}`);
      }
    });
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status code ${response.status}`);
        }
        return response.json();
      })
      .then((result: T) => {
        setData((prev) => {
          switch (prev.state) {
            case "loading":
            case "reloading":
              return prev.onLoaded(result);
            default:
              throw new Error(
                `Loading finished on invalid state ${prev.state}`
              );
          }
        });
      })
      .catch((error: Error) => {
        setData((prev) => {
          switch (prev.state) {
            case "loading":
            case "reloading":
              return prev.onError(error);
            default:
              throw new Error(`Loading failed on invalid state ${prev.state}`);
          }
        });
      });
    return () => {
      controller.abort();
    };
  }, [url]);

  useEffect(() => fetchData(), [fetchData]);

  return { data, refetch: fetchData };
}
