FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY index.html ./
COPY public ./public
COPY src ./src

RUN npm i

ARG BACKEND_URL
ENV VITE_BACKEND_URL=$BACKEND_URL

RUN npm run build

EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]