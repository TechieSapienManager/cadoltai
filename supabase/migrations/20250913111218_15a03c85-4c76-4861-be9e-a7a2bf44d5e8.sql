-- Fix foreign key constraint on alarms table to allow user deletion
-- First, drop the existing foreign key constraint
ALTER TABLE public.alarms DROP CONSTRAINT IF EXISTS alarms_user_id_fkey;

-- Add the foreign key constraint with CASCADE DELETE
ALTER TABLE public.alarms 
ADD CONSTRAINT alarms_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) 
ON DELETE CASCADE;