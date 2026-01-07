# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Docker-only env
COPY .env.docker .env.local

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copy ONLY what runtime needs
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.local ./.env.local

EXPOSE 3000
CMD ["npm", "start"]
