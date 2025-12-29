-- Update Service table: Remove imageUrl and add order field
-- Run this in Supabase SQL Editor

-- Step 1: Add order column (if not exists)
ALTER TABLE "Service" 
ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;

-- Step 2: Remove imageUrl column (if exists)
ALTER TABLE "Service" 
DROP COLUMN IF EXISTS "imageUrl";

-- Step 3: Update existing services with order values
-- English Course = 1
UPDATE "Service" 
SET "order" = 1 
WHERE slug = 'english-course';

-- Math Tutoring = 2
UPDATE "Service" 
SET "order" = 2 
WHERE slug = 'math-tutoring';

-- Bimbel = 3
UPDATE "Service" 
SET "order" = 3 
WHERE slug = 'bimbel';

-- Set order for any other services (if any)
UPDATE "Service" 
SET "order" = 999 
WHERE "order" = 0 AND slug NOT IN ('english-course', 'math-tutoring', 'bimbel');

