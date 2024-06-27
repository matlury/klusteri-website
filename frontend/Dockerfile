# Stage 1: Build the React app
FROM node:current-alpine AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

# Define ARG and ENV for RECAPTCHA_SITE_KEY
ARG SITE_KEY
ENV SITE_KEY=${SITE_KEY}

ARG API_URL
ENV API_URL=${API_URL}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY start_nginx.sh /usr/bin/start_nginx.sh

RUN chmod +x /usr/bin/start_nginx.sh

ENTRYPOINT ["/usr/bin/start_nginx.sh"]

# Ensure proper permissions for Nginx directories
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# Expose the necessary port
EXPOSE 5173 8000

CMD ["nginx", "-g", "daemon off;"]
