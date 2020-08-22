export interface Idle<T> {
  status: "idle";
  data?: undefined;
  error?: undefined;
}

export interface Loading<T> {
  status: "loading";
  data?: undefined;
  error?: undefined;
}

export interface Reloading<T> {
  status: "reloading";
  data: T;
  error?: undefined;
}

export interface Loaded<T> {
  status: "loaded";
  data: T;
  error?: undefined;
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

export function mapLoadable<T, E>(
  loadable: Loadable<T>,
  fn: (data: T) => E
): Loadable<E> {
  switch (loadable.status) {
    case "error":
      return {
        status: loadable.status,
        data: loadable.data ? fn(loadable.data) : undefined,
        error: loadable.error,
      };
    case "loaded":
    case "reloading":
      return {
        status: loadable.status,
        data: fn(loadable.data),
        error: undefined,
      };
    case "idle":
    case "loading":
    default:
      return loadable;
  }
}
