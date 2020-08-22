import React, { createContext, useEffect, useContext } from "react";
import { useFetch } from "../hooks/useFetch";
import { Loadable } from "../Loadable";

export interface MakeLoadableContextProps<T> {
  fetchUrl: string;
  refetchInterval?: number;
}

export function makeLoadableContext<T>({
  fetchUrl,
  refetchInterval,
}: MakeLoadableContextProps<T>) {
  const Context = createContext<Loadable<T>>({ status: "idle" });

  return {
    Provider: function ({ children }: { children: React.ReactNode }) {
      const { data, refetch } = useFetch<T>(fetchUrl);

      useEffect(() => {
        if (refetchInterval === undefined) return;

        const intervalId = setInterval(() => {
          refetch();
        }, refetchInterval);

        return () => {
          clearInterval(intervalId);
        };
      }, [refetch]);
      return <Context.Provider value={data}>{children}</Context.Provider>;
    },
    useData: function () {
      return useContext(Context);
    },
  };
}
