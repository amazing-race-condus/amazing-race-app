FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate --no-engine

COPY . .
RUN npm run build


FROM node:24-alpine

RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nonroot

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma/
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

RUN npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /root/.npm && \
    rm -rf /tmp/* && \
    chown -R nonroot:nodejs /app && \
    chmod -R 755 /app/node_modules/.prisma && \
    chmod -R 755 /app/node_modules/@prisma && \
    chmod -R 755 /app/prisma

USER nonroot

EXPOSE 3000

CMD ["node", "dist/index.js"]