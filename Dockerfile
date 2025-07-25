# Multi-stage Docker build for Passio application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# Install dependencies
RUN npm ci

# Backend build stage
FROM base AS backend-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY packages/backend ./packages/backend
COPY package.json ./

# Build backend
WORKDIR /app/packages/backend
RUN npm run build

# Frontend build stage
FROM base AS frontend-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY packages/frontend ./packages/frontend
COPY package.json ./

# Set environment variables for build
ENV VITE_API_URL=http://localhost:8000
ENV NODE_ENV=production

# Build frontend
WORKDIR /app/packages/frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install production dependencies
COPY package.json package-lock.json* ./
COPY packages/backend/package.json ./packages/backend/
RUN npm ci --only=production && npm cache clean --force

# Copy built applications
COPY --from=backend-builder --chown=nextjs:nodejs /app/packages/backend/dist ./packages/backend/dist
COPY --from=backend-builder --chown=nextjs:nodejs /app/packages/backend/package.json ./packages/backend/
COPY --from=frontend-builder --chown=nextjs:nodejs /app/packages/frontend/dist ./packages/frontend/dist

# Copy additional files
COPY --chown=nextjs:nodejs database ./database

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose ports
EXPOSE 8000

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "packages/backend/dist/index.js"] 