FROM node:18

WORKDIR /src

COPY package*.json .

RUN npm i
RUN npm i -g pm2

COPY . .
 
EXPOSE 34568


CMD  ["npm", "run","server"]