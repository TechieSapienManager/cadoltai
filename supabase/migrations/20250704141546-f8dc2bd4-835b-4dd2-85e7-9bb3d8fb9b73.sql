-- Add vault_pin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN vault_pin TEXT;

-- Add subscription_plan column to profiles table  
ALTER TABLE public.profiles
ADD COLUMN subscription_plan TEXT DEFAULT 'basic';

-- Update existing users to have basic subscription
UPDATE public.profiles 
SET subscription_plan = 'basic' 
WHERE subscription_plan IS NULL;