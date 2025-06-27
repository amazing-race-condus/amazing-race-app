FROM node:24-alpine AS backend-build

WORKDIR /app

COPY /backend/package*.json ./
RUN npm ci

COPY /backend/prisma ./prisma/
RUN npx prisma generate

COPY /backend .
COPY /shared ../shared/

RUN npm run build



FROM node:24-alpine AS frontend-build

WORKDIR /app

COPY /frontend/package*.json ./
RUN npm ci

COPY ./frontend .
COPY /shared ../shared/

ARG EXPO_PUBLIC_SOCKET_URL_WEB_ARG

ENV EXPO_PUBLIC_WEB_BACKEND_URL=/api
ENV EXPO_PUBLIC_SOCKET_URL_WEB=${EXPO_PUBLIC_SOCKET_URL_WEB_ARG}
RUN npx expo export --platform web



FROM node:24-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nonroot

WORKDIR /app

COPY --from=backend-build /app/package*.json ./
COPY --from=backend-build /app/dist/app ./dist
COPY --from=backend-build /app/prisma ./dist/prisma/
COPY /backend/prisma ./prisma/
COPY --from=backend-build /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=frontend-build /app/dist ./dist/public/dist/

RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /root/.npm && \
    rm -rf /tmp/* && \
    chown -R nonroot:nodejs /app && \
    chmod -R 755 /app/node_modules/.prisma && \
    chmod -R 755 /app/dist/prisma

USER nonroot

EXPOSE 3000

ENV MIGRATIONS_IN_CODE="true"

CMD ["node", "./dist/src/index.js"]