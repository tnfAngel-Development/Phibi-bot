# Builder
FROM docker.io/oven/bun:latest AS builder
WORKDIR /build/

ARG GIT_COMMIT
ENV NODE_ENV=production

COPY . ./

RUN bun install --production --frozen-lockfile --ignore-scripts
RUN bun run build:standalone

# Runner
FROM gcr.io/distroless/base-nossl-debian12:nonroot AS runner

ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

COPY --from=builder /build/dist/phibi ./

CMD ["./phibi"]
