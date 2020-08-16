import { useState, useEffect } from "react";
export function useFetch<T>(url: string): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data: T) => setData(data));
  }, [url]);

  return data;
}
