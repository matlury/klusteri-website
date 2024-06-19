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

# Build the app
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /frontend/dist /usr/share/nginx/html

# Optionally, if you need to customize nginx.conf, you can COPY it here
# COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Create directory for nginx client temp files and set permissions
RUN mkdir -p /var/cache/nginx/client_temp && \
    chmod 755 /var/cache/nginx/client_temp && \
    chown nginx:nginx /var/cache/nginx/client_temp

# Start Nginx server (nginx image CMD already starts nginx, no need to override)
# CMD ["nginx", "-g", "daemon off;"]
