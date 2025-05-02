# 构建阶段
FROM node:22 AS build-stage
WORKDIR /app
COPY . .
RUN corepack enable
RUN yarn
RUN yarn build

# 生产阶段
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]