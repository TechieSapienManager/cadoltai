
import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface VaultPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VaultPinModal: React.FC<VaultPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [hasExistingPin, setHasExistingPin] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && user) {
      checkExistingPin();
    }
  }, [isOpen, user]);

  const checkExistingPin = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('vault_pin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setHasExistingPin(!!data?.vault_pin);
    } catch (error) {
      console.error('Error checking existing PIN:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (isSettingPin) {
      if (pin !== confirmPin) {
        alert('PINs do not match');
        return;
      }
      if (pin.length !== 4) {
        alert('PIN must be 4 digits');
        return;
      }
    }

    setLoading(true);
    try {
      if (isSettingPin) {
        // Set new PIN
        const { error } = await supabase
          .from('profiles')
          .update({ vault_pin: pin })
          .eq('id', user.id);

        if (error) throw error;
        onSuccess();
      } else {
        // Verify existing PIN
        const { data, error } = await supabase
          .from('profiles')
          .select('vault_pin')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.vault_pin === pin) {
          onSuccess();
        } else {
          alert('Incorrect PIN');
          setPin('');
        }
      }
    } catch (error) {
      console.error('Error with PIN:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isSettingPin ? 'Set Vault PIN' : 'Enter Vault PIN'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isSettingPin ? 'Create a 4-digit PIN to secure your vault' : 'Enter your 4-digit PIN to access vault'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              maxLength={4}
            />
          </div>

          {isSettingPin && (
            <div>
              <input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                maxLength={4}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || pin.length !== 4 || (isSettingPin && confirmPin.length !== 4)}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSettingPin ? 'Set PIN' : 'Unlock'}
          </button>

          {!hasExistingPin && !isSettingPin && (
            <button
              onClick={() => setIsSettingPin(true)}
              className="w-full py-2 text-blue-500 hover:text-blue-600 text-sm"
            >
              Set up new PIN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
