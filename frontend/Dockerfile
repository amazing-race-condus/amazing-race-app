FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV EXPO_PUBLIC_WEB_BACKEND_URL=/api

RUN npx expo export --platform web


FROM nginxinc/nginx-unprivileged:stable-alpine-slim

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

USER root
RUN chmod 644 /etc/nginx/nginx.conf && \
    chown nginx:nginx /etc/nginx/nginx.conf
USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]