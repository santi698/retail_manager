FROM rust:1.51 as planner
WORKDIR /app
RUN cargo install cargo-chef
COPY . .
RUN cargo chef prepare  --recipe-path recipe.json

FROM rust:1.51 as cacher
WORKDIR /app
RUN cargo install cargo-chef
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

FROM rust:1.51 as builder
WORKDIR /app
COPY . .
# Copy over the cached dependencies
COPY --from=cacher /app/target target
COPY --from=cacher /usr/local/cargo /usr/local/cargo
RUN cargo build --release --bin http_api

FROM debian:buster-slim

ARG APP=/usr/src/app

RUN apt-get update \
  && apt-get install -y ca-certificates tzdata \
  && rm -rf /var/lib/apt/lists/*

ENV TZ=Etc/UTC \
  APP_USER=appuser

RUN groupadd ${APP_USER} \
  && useradd -g ${APP_USER} ${APP_USER} \
  && mkdir -p ${APP}

COPY --from=builder /app/target/release/http_api ${APP}/retail_manager

RUN chown -R ${APP_USER}:${APP_USER} ${APP}

USER ${APP_USER}
WORKDIR ${APP}

CMD ["./retail_manager"]
