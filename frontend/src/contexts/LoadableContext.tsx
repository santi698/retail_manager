import React, { createContext, useEffect, useContext } from "react";
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
  const Context = createContext<Loadable<T>>(new Idle<T>());

  return {
    Provider: function ({ children, refetchInterval }: LoadableProviderProps) {
      const { data, refetch } = useFetch<T>(fetchUrl);

      useEffect(() => {
        if (refetchInterval === undefined) return;

        const intervalId = setInterval(() => {
          refetch();
        }, refetchInterval);

        return () => {
          clearInterval(intervalId);
        };
      }, [refetch, refetchInterval]);
      return <Context.Provider value={data}>{children}</Context.Provider>;
    },
    useData: function () {
      return useContext(Context);
    },
  };
}
