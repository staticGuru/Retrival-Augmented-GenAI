FROM node:18-alpine

WORKDIR /app

EXPOSE 3000

COPY package.json yarn.lock ./

RUN npm install --silent

COPY . ./

CMD ["npm", "run", "dev"]