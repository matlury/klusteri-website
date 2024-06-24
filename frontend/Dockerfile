FROM node:current-alpine AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /frontend/dist /usr/share/nginx/html

RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

RUN sed -i.bak 's/listen\(.*\)80;/listen 5173;/' /etc/nginx/conf.d/default.conf

RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

EXPOSE 5173