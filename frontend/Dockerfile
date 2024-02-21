FROM node:iron-slim

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /.npm && \
    chown -R node:node /.npm

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]
