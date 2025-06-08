
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>('basic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setSubscriptionPlan(data?.subscription_plan || 'basic');
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscriptionPlan('basic');
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (newPlan: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: newPlan })
        .eq('id', user.id);

      if (error) throw error;
      setSubscriptionPlan(newPlan);
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  };

  return {
    subscriptionPlan,
    loading,
    updateSubscription,
    hasProAccess: subscriptionPlan === 'pro' || subscriptionPlan === 'premium',
    hasPremiumAccess: subscriptionPlan === 'premium'
  };
};
