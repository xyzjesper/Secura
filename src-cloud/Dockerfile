FROM rust:slim as builder

WORKDIR /cloud
COPY . .

RUN cargo install --paht .

FROM debian:trixie-slim
RUN apt-get update && apt-get install -y extra-runtime-dependencies && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/secura /usr/local/bin/secura
CMD ["secura"]