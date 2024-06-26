# Stage 1: Build the React app
FROM node:current-alpine AS build

# Set the working directory
WORKDIR /frontend

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Define ARG for RECAPTCHA_SITE_KEY
ARG REACT_APP_RECAPTCHA_SITE_KEY

# Set environment variable for the build process
ENV REACT_APP_RECAPTCHA_SITE_KEY=${REACT_APP_RECAPTCHA_SITE_KEY}

# Build the React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /frontend/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure proper permissions for Nginx directories
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# Expose the necessary port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
