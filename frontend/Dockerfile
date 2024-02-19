FROM node:20.11.1-alpine3.19

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN chmod -R 777 *

EXPOSE 5173

CMD ["npm", "run", "dev"]