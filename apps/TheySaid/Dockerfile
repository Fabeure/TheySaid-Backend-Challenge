# Stage 1: Build the application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and workspace configuration
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./

# Copy source files
COPY apps ./apps
COPY libs ./libs

# Install production dependencies only (should we --omit=dev?)
RUN npm ci --legacy-peer-deps

# Build the application
RUN npx nx build TheySaid

# Stage 2: Production image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/dist/apps/TheySaid ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]