# Stage 1: Build Expo Web
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV CI=1
ENV EXPO_NO_TELEMETRY=1
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npx expo export -p web

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
