# 🍵 Cozy Specialty Tea Brew & Extraction Profiler (Kissa Lab)

> **Kissa Lab** — A Creative Sandbox & Extraction Profiler for specialty tea blending in Cozy Casual aesthetic.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-darkblue?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-green?style=flat-square&logo=supabase)

---

## ☕ Key Features

1. **🧪 Real-time Extraction Engine (`lib/extraction-engine.ts`)**
   - Calculates extraction factor based on water temperature (60–100°C) and steeping time (30–300s).
   - Dynamic weighted RGB color blending with extraction darkening.
   - Evaluates 5 flavor dimensions: Sweetness, Aroma, Body, Bitterness, Clarity (1–10).
   - Generates cozy Sommelier titles (e.g. *Honey Blossom Dream*, *Velvet Caramel Embrace*) and detailed tasting notes.

2. **🍵 Dynamic Animated SVG Teacup (`components/game/CozyCupScene.tsx`)**
   - Ceramic cup on wooden saucer with dynamic tea liquid color and opacity.
   - Realistic foam bubbles and steam rising animation scaling with temperature.

3. **📊 Recharts Flavor Radar Chart (`components/charts/FlavorRadarChart.tsx`)**
   - 5-axis sensory flavor radar with cozy warm amber palette.

4. **📱 Responsive & Mobile-first Control**
   - Touch-friendly +/- increment buttons for mobile.
   - Fixed floating bottom action drawer on mobile screens.

5. **🗄️ Public Recipe Archive (`app/recipes`)**
   - Save custom recipes to PostgreSQL database without login.
   - View community blends with mini radar charts and deep extraction metrics.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 100% (Strict Type Safety with Zod)
- **Database & ORM:** PostgreSQL (Supabase) + Prisma ORM
- **Styling & UI:** Tailwind CSS v4 + Lucide React + Framer Motion
- **Data Visualization:** Recharts
- **Deployment:** Vercel (Edge / Serverless)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/10VE48TKU-KaCha/Tea-Blender-Brew-Lab.git
cd Tea-Blender-Brew-Lab
npm install
```

### 2. Configure Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` with your Supabase PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
```

### 3. Sync Database & Seed Data
```bash
npx prisma db push
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel & Supabase

### Step 1: Set up Supabase Database
1. Go to [Supabase](https://supabase.com) and create a new project.
2. Go to **Project Settings** > **Database**.
3. Under **Connection string**, copy the **URI** (Transaction Pooler or Session Pooler recommended for serverless).

### Step 2: Push Database Schema & Seed Data
Run locally to initialize tables and starter tea leaves:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 3: Deploy on Vercel
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import the Git repository: `10VE48TKU-KaCha/Tea-Blender-Brew-Lab`.
3. In **Environment Variables**, add:
   - `DATABASE_URL` = `<Your Supabase PostgreSQL Connection String>`
4. Click **Deploy**.
5. Once built, Vercel will automatically run `prisma generate` via the `postinstall` script and compile the application!

---

## 📄 License
MIT License. Crafted with 🍵 for tea lovers.
