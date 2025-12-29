-- Add role column to Admin table
-- Run this in Supabase SQL Editor

ALTER TABLE "Admin" 
ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'ADMIN';

-- Update existing admin to SUPER_ADMIN
UPDATE "Admin" 
SET "role" = 'SUPER_ADMIN' 
WHERE email = 'admin@pec.id';

