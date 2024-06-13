FROM node:22.3-alpine

RUN apk update && apk add git

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
