# Dandiya Night 3.0 — Frontend Web Application

High-performance, mobile-responsive festival ticketing and attendee web portal for Dandiya Night 3.0.

## Overview

- **Framework**: Next.js 16 (Turbopack, React 19)
- **Styling**: Tailwind CSS with custom royal Navratri palette & gold gradients
- **Animations**: Framer Motion & celebratory Canvas Confetti
- **Payment Experience**: Razorpay official checkout SDK
- **Gate Scanning**: Client-side hardware & camera QR scanning with `jsQR` engine
- **Architecture**: 100% decoupled from the database; interacts with `dandiya-night-backend` via HTTP/REST

---

## Directory Structure

```
dandiya-night-frontend/
├── public/                   # Static festival assets (SVG logos, badges, banners)
├── src/
│   ├── app/
│   │   ├── admin/            # Executive command center & gate scanner
│   │   ├── dashboard/        # Attendee tickets & refund requests
│   │   ├── globals.css       # Custom festive CSS utilities & gold gradients
│   │   ├── layout.tsx        # Root HTML layout with festive theme
│   │   └── page.tsx          # Public event landing page
│   ├── components/
│   │   ├── admin/            # CMS manager, Payment config manager, Venue photos manager
│   │   ├── checkout/         # 4-step secure Booking Modal with live pricing breakdown
│   │   ├── common/           # Dandiya festive logo & social icons
│   │   ├── landing/          # Hero, Venue gallery, Schedule, Testimonials, FAQ, Sponsors
│   │   └── navigation/       # Responsive navbar
│   └── lib/
│       ├── api.ts            # Decoupled backend HTTP client helper
│       └── utils/            # Image proxy & helper utilities
├── package.json
├── tsconfig.json
├── next.config.ts            # Auto-rewrites /api calls to backend
├── .env.example
├── README.md
└── DEPLOYMENT.md
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Set `NEXT_PUBLIC_API_BASE_URL` to your running backend service (e.g. `http://localhost:5000` in development).

### 3. Run Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized static and SSR production build.
