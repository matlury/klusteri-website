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

# Copy custom Nginx configuration template
# The entrypoint script will run envsubst on this file and output it to /etc/nginx/conf.d/default.conf
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Ensure proper permissions for Nginx directories
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# Filter which variables should be substituted by envsubst to avoid breaking Nginx variables like $uri
ENV NGINX_ENVSUBST_FILTER='$API_URL $SITE_KEY $VITE_API_URL $VITE_SITE_KEY'

# Expose the necessary port
EXPOSE 5173 8000

CMD ["nginx", "-g", "daemon off;"]
