FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./  
COPY src ./src

RUN npm i 

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]