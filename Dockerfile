FROM node:24-alpine AS backend-build

WORKDIR /app

COPY /backend/package*.json ./
RUN npm ci

COPY /backend/prisma ./prisma/
RUN npx prisma generate --no-engine

COPY /backend .
RUN npm run build



FROM node:24-alpine AS frontend-build

WORKDIR /app

COPY /frontend/package*.json ./
RUN npm ci

COPY ./frontend .

ENV EXPO_PUBLIC_WEB_BACKEND_URL=/api
RUN npx expo export --platform web



FROM node:24-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nonroot

WORKDIR /app

COPY --from=backend-build /app/package*.json ./
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/prisma ./dist/prisma/
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

CMD ["node", "./dist/src/index.js"]