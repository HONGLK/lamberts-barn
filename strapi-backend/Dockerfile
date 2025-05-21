# 構建階段
FROM node:18-alpine AS build
WORKDIR /opt/app

# 增加構建階段的記憶體限制
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json yarn.lock* ./
RUN yarn global add node-gyp && \
    yarn config set network-timeout 600000 -g && \
    yarn install --frozen-lockfile

COPY . .
RUN yarn build

# 運行階段 (更輕量)
FROM node:18-alpine
WORKDIR /opt/app

# 運行時的記憶體限制可以低一些
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NODE_ENV=production

COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/package.json ./
COPY --from=build /opt/app/yarn.lock ./
COPY --from=build /opt/app/build ./build
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/src ./src

CMD ["yarn", "start"]