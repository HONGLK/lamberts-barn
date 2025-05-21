# ================================
# 第一階段：構建階段
# ================================
FROM node:18-alpine AS build

# 設定構建階段的記憶體限制
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 安裝構建所需系統依賴
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

# 複製依賴管理文件
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

# 檢查構建後的文件結構（調試用）
RUN ls -la && \
    find . -name "build" -type d -o -name "dist" -type d -o -name ".build" -type d

# ================================
# 第二階段：運行階段
# ================================
FROM node:18-alpine AS production

# 設定運行階段的記憶體限制
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NODE_ENV=production

# 安裝運行所需系統依賴
RUN apk update && apk add --no-cache \
    bash \
    vips-dev \
    postgresql-client

# 設定工作目錄
WORKDIR /opt/app

# 從構建階段複製必要文件
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/package.json ./
COPY --from=build /opt/app/yarn.lock ./
# 複製 Strapi 相關目錄 (根據 Strapi 結構修改)
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/.cache ./.cache
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/src ./src

# 建立上傳目錄並設置權限
RUN mkdir -p ./public/uploads && \
    chmod 755 ./public/uploads

# 暴露 Strapi 端口
EXPOSE 1337

# 設定啟動命令
CMD ["yarn", "start"]