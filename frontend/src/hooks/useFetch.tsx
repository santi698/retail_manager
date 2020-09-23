import { useState, useEffect, useCallback } from "react";
import { Loadable, Idle } from "../Loadable";
import { simpleFetch } from "../simpleFetch";

export interface UseFetchResult<T> {
  data: Loadable<T>;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<Loadable<T>>(new Idle<T>());

  const fetchData = useCallback(() => {
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
    const { response, abort } = simpleFetch(url, { credentials: "include" });
    response
      .then((response) => response.json())
      .then((data) =>
        setData((prev) => {
          switch (prev.state) {
            case "loading":
            case "reloading":
              return prev.onLoaded(data);
            default:
              throw new Error(
                `Loading finished on invalid state ${prev.state}`
              );
          }
        })
      )
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
      abort();
    };
  }, [url]);

  useEffect(() => fetchData(), [fetchData]);

  return { data, refetch: fetchData };
}
