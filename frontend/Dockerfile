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

# Stage 2: Serve with nginx
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Copy build output to nginx html directory
COPY --from=build /frontend/dist /usr/share/nginx/html

# Use a non-root user for OpenShift compatibility
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Expose the necessary port
EXPOSE 5173

# Substitute environment variables and run nginx
CMD ["/bin/sh", "-c", "envsubst '${API_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]