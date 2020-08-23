export class Idle<T> {
  public readonly state = "idle";
  public readonly data?: undefined;
  public readonly error?: undefined;

  onLoadingStarted(): Loading<T> {
    return new Loading<T>();
  }

  map<E>(_fn: (from: T) => E): Loadable<E> {
    return new Idle();
  }
}

export class Loading<T> {
  public readonly state = "loading";
  public readonly data?: undefined;
  public readonly error?: undefined;

  onLoaded(data: T): Loaded<T> {
    return new Loaded(data);
  }

  onError(error: Error): LoadError<T> {
    return new LoadError(error);
  }

  map<E>(_fn: (from: T) => E): Loadable<E> {
    return new Loading();
  }
}

export class Reloading<T> {
  public readonly state = "reloading";
  public readonly data: T;
  public readonly error?: undefined;

  constructor(data: T) {
    this.data = data;
  }

  onLoaded(data: T): Loaded<T> {
    return new Loaded(data);
  }

  onError(error: Error): LoadError<T> {
    return new LoadError(error);
  }

  map<E>(fn: (from: T) => E): Loadable<E> {
    return new Reloading(fn(this.data));
  }
}

export class Loaded<T> {
  public readonly state = "loaded";
  public readonly data: T;
  public readonly error?: undefined;

  constructor(data: T) {
    this.data = data;
  }

  onReloadStarted(): Reloading<T> {
    return new Reloading(this.data);
  }

  map<E>(fn: (from: T) => E): Loadable<E> {
    return new Loaded(fn(this.data));
  }
}

export class LoadError<T> {
  public readonly state = "error";
  public readonly data?: T;
  public readonly error: Error;

  constructor(error: Error, data?: T) {
    this.error = error;
    this.data = data;
  }

  onRetry(): Loading<T> {
    return new Loading();
  }

  map<E>(fn: (from: T) => E): Loadable<E> {
    return new LoadError(this.error, this.data ? fn(this.data) : undefined);
  }
}

export type Loadable<T> =
  | Idle<T>
  | Loading<T>
  | Reloading<T>
  | Loaded<T>
  | LoadError<T>;
