# Stage 1: Build the React app
FROM node:current-alpine AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_RECAPTCHA_SITE_KEY
ENV REACT_APP_RECAPTCHA_SITE_KEY=$REACT_APP_RECAPTCHA_SITE_KEY

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure proper permissions for Nginx directories
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# Expose the necessary port
EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
