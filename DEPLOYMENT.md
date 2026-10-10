# Dandiya Night 3.0 — Frontend Deployment Guide

Instructions for deploying `dandiya-night-frontend` to modern cloud static/SSR platforms (Vercel, Netlify, Cloudflare Pages, AWS Amplify, or Docker).

---

## Deploying to Vercel (Recommended)

1. **Connect Repository**:
   - Import the `dandiya-night-frontend` repository in your Vercel Dashboard.

2. **Framework Preset**:
   - Select **Next.js**.

3. **Build & Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables**:
   Add the following in Project Settings -> Environment Variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://dnd-kat-gdcm.vercel.app
   NEXT_PUBLIC_SITE_URL=https://dandiyanightkatoria.vercel.app
   ```

5. **Deploy**:
   Click **Deploy**. Vercel will build and deploy the edge-optimized client globally.

---

## Deploying to Netlify / Cloudflare

1. Set Build Command: `npm run build`
2. Set Publish Directory: `.next`
3. Configure `NEXT_PUBLIC_API_BASE_URL` pointing to your backend URL.

---

## Docker Deployment

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
```
