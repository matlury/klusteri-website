# Stage 1: Build stage
FROM node:current-alpine AS build

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json from frontend
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from frontend
COPY . .

# Set permissions if needed (may not be necessary depending on your setup)
# RUN chgrp -R 0 /frontend && chmod -R g+rwX /frontend

# Build the app
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Copy the built files from the previous stage
COPY --from=build /frontend/dist /usr/share/nginx/html

# Create directory for nginx client temp files and set permissions
RUN mkdir -p /var/cache/nginx/client_temp && \
    chmod 755 /var/cache/nginx/client_temp && \
    chown nginx:nginx /var/cache/nginx/client_temp

# Expose the port the app runs on (not necessary for nginx)
# EXPOSE 5173

# Start Nginx server (nginx image CMD already starts nginx, no need to override)
# CMD ["nginx", "-g", "daemon off;"]
