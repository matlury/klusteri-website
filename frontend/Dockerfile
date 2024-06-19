FROM node:current-alpine AS build

# Set the working directory
WORKDIR /frontend

# Copy package.json and package-lock.json from frontend
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from frontend
COPY . .

RUN chgrp -R 0 /frontend && chmod -R g+rwX /frontend

# Build the app
RUN npm run build

# Use a lightweight web server to serve the built files
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built files from the previous stage
COPY --from=build /frontend/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 5173

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
