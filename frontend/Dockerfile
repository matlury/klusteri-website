FROM node:iron-slim

RUN npm install -g npm@10.4.0

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN chgrp -R 0 /frontend && chmod -R g+rwX /frontend

EXPOSE 5173

CMD ["npm", "run", "dev"]
