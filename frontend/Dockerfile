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

# Stage 2: Serve with Express
FROM node:24-alpine

WORKDIR /frontend

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy build output and server script
COPY --from=build /frontend/dist ./dist
COPY server.js ./

# Use a non-root user for OpenShift compatibility
USER node

# Expose the necessary port
EXPOSE 5173

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5173

# Run the server
CMD ["node", "server.js"]