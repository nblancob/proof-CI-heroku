FROM node:14

WORKDIR /graphql-server

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","start"]