FROM node:20.11.1-alpine3.19

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN chgrp -R 0 /frontend && chmod -R g+rwX /frontend

EXPOSE 5173

CMD ["npm", "run", "dev"]