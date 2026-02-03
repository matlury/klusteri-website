# Stage 1: Build the React app
FROM node:24-alpine AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm ci

COPY . .

# Define ARG and ENV for RECAPTCHA_SITE_KEY
ARG SITE_KEY
ENV VITE_SITE_KEY=${SITE_KEY}

ARG API_URL
ENV VITE_API_URL=${API_URL}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a script to inject environment variables into a config.js file
RUN echo '#!/bin/sh' > /docker-entrypoint.d/generate_config.sh && \
    echo 'echo "window.ENV = { API_URL: \"$API_URL\", SITE_KEY: \"$SITE_KEY\" };" > /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/generate_config.sh && \
    chmod +x /docker-entrypoint.d/generate_config.sh

# Ensure proper permissions for Nginx directories
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Expose the necessary port
EXPOSE 5173 8000

CMD ["nginx", "-g", "daemon off;"]
