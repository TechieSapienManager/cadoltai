import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

type TableName = 'events' | 'notes' | 'todos' | 'alarms' | 'vault_items';

export const useFeatureLimit = (table: TableName, feature: string) => {
  const { user } = useAuth();
  const { subscriptionPlan, hasProAccess } = useSubscription();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const FREE_LIMIT = 5;

  useEffect(() => {
    if (user) {
      loadCount();
    }
  }, [user, table]);

  const loadCount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      if (error) throw error;
      setCount(data?.length || 0);
    } catch (error) {
      console.error(`Error loading ${table} count:`, error);
    } finally {
      setLoading(false);
    }
  };

  const checkLimit = () => {
    if (hasProAccess) return true;
    
    if (count >= FREE_LIMIT) {
      setShowUpgradeModal(true);
      return false;
    }
    
    return true;
  };

  const handleUpgrade = async (plan: 'pro' | 'premium') => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: plan })
        .eq('id', user.id);

      if (error) throw error;
      setShowUpgradeModal(false);
      // Refresh subscription status
      window.location.reload();
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade. Please try again.');
    }
  };

  const incrementCount = () => setCount(prev => prev + 1);
  const decrementCount = () => setCount(prev => Math.max(0, prev - 1));

  return {
    count,
    loading,
    canCreate: hasProAccess || count < FREE_LIMIT,
    checkLimit,
    showUpgradeModal,
    setShowUpgradeModal,
    handleUpgrade,
    incrementCount,
    decrementCount,
    isAtLimit: !hasProAccess && count >= FREE_LIMIT,
    remainingFree: hasProAccess ? null : Math.max(0, FREE_LIMIT - count)
  };
};