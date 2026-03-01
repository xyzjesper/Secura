FROM rust:slim AS builder

WORKDIR /cloud
COPY ./src-cloud .

RUN cargo install --path .

FROM debian:trixie-slim AS publish

WORKDIR /cloud

COPY --from=builder /cloud/target/release/src-cloud /cloud/src-cloud

CMD ["/cloud/src-cloud"]