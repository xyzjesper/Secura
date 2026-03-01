FROM rust:slim as builder

WORKDIR /cloud
COPY . .

RUN cargo install --paht .

FROM debian:trixie-slim as publish

RUN apt update && apt install -y extra-runtime-dependencies && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/secura /usr/local/bin/secura

CMD ["secura"]