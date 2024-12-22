# Builder
FROM docker.io/imbios/bun-node:1.1-21-alpine
WORKDIR /bot/

ENV NODE_ENV=production

COPY . ./

RUN bun install --production --frozen-lockfile --ignore-scripts

CMD ["bun", "run", "start"]