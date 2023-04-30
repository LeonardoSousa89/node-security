FROM node:18

WORKDIR /src

COPY package*.json .

RUN npm i

COPY . .
 
EXPOSE 34568

CMD  ["npm", "run", "dev"]