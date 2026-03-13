# LockdIn MVP

LockdIn is a premium, mobile-first fitness operating system MVP built with deterministic and explainable logic.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Prisma ORM + PostgreSQL
- NextAuth (Credentials)
- Recharts (analytics)

## Product Areas
- Landing + Auth (`/`, `/login`, `/signup`)
- Onboarding (`/onboarding`)
- Command Center (`/home`)
- Plan Studio (`/plan-studio`)
- Nutrition Lab (`/nutrition-lab`)
- Progress Vault (`/progress-vault`)
- Check-In Hub (`/check-in-hub`)
- Social Circle (`/social-circle`)
- Logbook (`/logbook`)
- Settings (`/settings`)

## Core MVP Logic (Deterministic)
- Workout generation: split + prescription by goal/training level/equipment/limitations.
- Substitution system: exercise mapping based on equipment/injury constraints.
- Nutrition generation: BMR/TDEE + conservative goal modifiers + macro targets.
- Grocery generation: weekly category list with balanced/budget/convenience styles.
- Adherence scoring: weighted behavioral score (workouts, nutrition, check-ins, streak, recovery input).
- Adaptive changes: biweekly style rules for calories, volume, and substitutions.
- Milestones: timeline templates by goal.
- Notification preview: tone-based message generator with scheduling stub.

## Architecture Overview

### App Layer
- `src/app` route groups for marketing, auth, and product modules.
- API routes for generation/adaptation/grocery/recap/notification preview.

### Domain Logic
- `src/lib/logic/*`
  - `workout-generator.ts`
  - `nutrition-generator.ts`
  - `adherence.ts`
  - `adaptation.ts`
  - `milestones.ts`
  - `grocery.ts`
  - `notifications.ts`
  - `plan-engine.ts`

### Data Layer
- Prisma schema models include:
  - `User`, `UserProfile`, `GoalProfile`
  - `WorkoutPlan`, `WorkoutDay`, `Exercise`, `ExercisePrescription`, `ExerciseSubstitution`
  - `NutritionPlan`, `GroceryList`
  - `WorkoutLog`, `BodyMetricLog`, `NutritionLog`, `ProgressPhoto`, `ProgressCheckIn`
  - `AdherenceSnapshot`, `Milestone`, `WeeklyRecap`, `AdaptivePlanChange`
  - `FriendConnection`, `NotificationPreference`, `PrivacySettings`
  - NextAuth models (`Account`, `Session`, `VerificationToken`)

## Setup
1. Install deps:
   - `npm install`
2. Copy env:
   - `cp .env.example .env`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Create schema in Postgres:
   - `npm run db:push`
5. Seed sample data:
   - `npm run prisma:seed`
6. Start app:
   - `npm run dev`

## Demo Credentials
- `demo@lockdin.app`
- `LockdinDemo123`

## Seed Data Included
- Exercise database with movement/equipment/difficulty/injury tags
- Substitution mappings
- Sample users + social links
- Seeded workout plan + nutrition plan
- Dummy logs, check-ins, milestones, weekly recaps, progress photos

## Safety Notes
- LockdIn does **not** provide medical diagnosis or medical nutrition therapy.
- No unsafe weight-loss protocols, PED guidance, or false claims.
- Users should consult a qualified professional for injuries, pain, or medical concerns.

## Future AI Enhancement Points
- Swap deterministic generators with model-assisted recommendations while preserving rules guardrails.
- Add AI check-in interpretation and personalized message sequencing.
- Add LLM-powered substitution rationale and meal generation variants.
- Add anomaly detection across adherence/recovery/performance trends.
