export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export class HttpStatusCodeError extends Error {
  public statusCode: number;

  constructor(statusCode: number) {
    super(`HTTP request failed with status code ${statusCode}.`);
    this.statusCode = statusCode;
  }
}

export type SimpleFetchOptions =
  | {
      method?: "GET" | "DELETE";
      json?: undefined;
      body?: undefined;
      contentType?: undefined;
    }
  | {
      method?: "POST" | "PUT";
      body?: undefined;
      json: object;
      contentType?: undefined;
    }
  | {
      method?: "POST" | "PUT";
      json?: undefined;
      body: string;
      contentType: string;
    };

export function simpleFetch(
  url: string,
  { method = "GET", json, body, contentType }: SimpleFetchOptions = {
    method: "GET",
  }
) {
  const controller = new AbortController();
  const hasBody = method === "POST" || method === "PUT";
  const isJson = json !== undefined;
  const response = fetch(url, {
    method,
    signal: controller.signal,
    body: isJson ? JSON.stringify(json) : body,
    headers: hasBody
      ? {
          "Content-Type": isJson ? "application/json" : (contentType as string),
        }
      : undefined,
  }).then((response) => {
    if (response.status >= 400) {
      throw new HttpStatusCodeError(response.status);
    }
    return response;
  });

  return { response, abort: () => controller.abort() };
}
