FROM oven/bun:latest

WORKDIR /app/website

COPY package.json bun.lock ./
RUN bun install

COPY . .

ENV NODE_ENV=production

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]