FROM node:20.11.1-alpine3.19

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN chmod -R 777 *

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]