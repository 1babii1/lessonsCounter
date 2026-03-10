# Stage 1: Build Expo Web
FROM node:18-bullseye-slim AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Set environment variables to prevent out-of-memory and hanging on prompts
ENV CI=1
ENV EXPO_NO_TELEMETRY=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the web bundle (Expo 50+ usually exports to dist folder)
RUN npx expo export -p web

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built web assets to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
