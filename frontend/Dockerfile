FROM node:22.18-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

CMD ["sh", "-c", "npm install && npm run dev"]
