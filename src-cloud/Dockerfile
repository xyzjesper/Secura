FROM rust:slim
LABEL authors="xyzjesper"

WORKDIR /cloud
COPY . .

RUN cargo build
RUN chmod +x target/release/secura

ENTRYPOINT ["./target/release/secura"]