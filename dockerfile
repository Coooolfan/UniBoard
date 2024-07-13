# 构建阶段
FROM node:20 as build-stage
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

# 生产阶段
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /usr/share/nginx/media
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]