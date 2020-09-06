import React, { createContext, useEffect, useContext, useMemo } from "react";
import { useFetch } from "../hooks/useFetch";
import { Loadable, Idle } from "../Loadable";

export interface MakeLoadableContextProps<T> {
  fetchUrl: string;
}

export interface LoadableProviderProps {
  children: React.ReactNode;
  refetchInterval?: number;
}

export function makeLoadableContext<T>({
  fetchUrl,
}: MakeLoadableContextProps<T>) {
  const Context = createContext<{ data: Loadable<T>; refetch: () => void }>({
    data: new Idle<T>(),
    refetch: () => {},
  });

  return {
    Provider: function ({ children, refetchInterval }: LoadableProviderProps) {
      const { data, refetch } = useFetch<T>(fetchUrl);
      const value = useMemo(() => ({ data, refetch }), [data, refetch]);

      useEffect(() => {
        if (refetchInterval === undefined) return;

        const intervalId = setInterval(() => {
          refetch();
        }, refetchInterval);

        return () => {
          clearInterval(intervalId);
        };
      }, [refetch, refetchInterval]);
      return <Context.Provider value={value}>{children}</Context.Provider>;
    },
    useData: function () {
      return useContext(Context).data;
    },
    useRefetch: function () {
      return useContext(Context).refetch;
    },
  };
}
