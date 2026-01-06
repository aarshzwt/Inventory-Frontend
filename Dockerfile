# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /src

COPY package*.json ./
RUN npm install

COPY .env.docker .env.local

COPY . .
RUN npm run build

# --- Run Stage ---
FROM node:20-alpine
WORKDIR /src

COPY --from=builder /src ./

EXPOSE 3000
CMD ["npm", "start"]

