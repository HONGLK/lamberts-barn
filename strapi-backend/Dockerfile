# 使用 Node.js 18 Alpine 作為基礎映像
FROM node:18-alpine

ENV NODE_OPTIONS="--max-old-space-size=4096"

# 安裝系統依賴
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    vips-dev \
    git \
    postgresql-client

# 設定工作目錄
WORKDIR /opt/app

# 設定環境變量
ENV NODE_ENV=production

# 複製 package 管理文件
COPY package*.json yarn.lock* ./

# 安裝全局和項目依賴
RUN yarn global add node-gyp && \
    yarn config set network-timeout 600000 -g && \
    yarn install --frozen-lockfile && \
    yarn add pg

# 複製應用程式文件
COPY . .

# 構建 Strapi 應用
RUN yarn build

# 暴露 Strapi 端口
EXPOSE 1337

# 設定啟動命令
CMD ["yarn", "start"]