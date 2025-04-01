FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Set environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
ARG NEXT_PUBLIC_HUGGINGFACE_API_KEY
ARG NEXT_PUBLIC_MINIMAXI_API_KEY
ARG NEXT_PUBLIC_MINIMAXI_GROUP_ID
ARG NEXT_PUBLIC_KLING_ACCESS_KEY
ARG NEXT_PUBLIC_KLING_SECRET_KEY
ARG NEXT_PUBLIC_KLING_API_URL

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=$NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
ENV NEXT_PUBLIC_HUGGINGFACE_API_KEY=$NEXT_PUBLIC_HUGGINGFACE_API_KEY
ENV NEXT_PUBLIC_MINIMAXI_API_KEY=$NEXT_PUBLIC_MINIMAXI_API_KEY
ENV NEXT_PUBLIC_MINIMAXI_GROUP_ID=$NEXT_PUBLIC_MINIMAXI_GROUP_ID
ENV NEXT_PUBLIC_KLING_ACCESS_KEY=$NEXT_PUBLIC_KLING_ACCESS_KEY
ENV NEXT_PUBLIC_KLING_SECRET_KEY=$NEXT_PUBLIC_KLING_SECRET_KEY
ENV NEXT_PUBLIC_KLING_API_URL=$NEXT_PUBLIC_KLING_API_URL

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./package.json

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set user
USER nextjs

# Expose port
EXPOSE 3001

# Set environment variables for the server
ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

# Auth configuration
ENV NEXTAUTH_URL="http://0.0.0.0:3001"
ENV NEXTAUTH_URL_INTERNAL="http://0.0.0.0:3001"
ENV NEXT_PUBLIC_SITE_URL="http://0.0.0.0:3001"
ENV NEXT_PUBLIC_APP_URL="http://0.0.0.0:3001"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://0.0.0.0:3001/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["node", "server.js"] 