import React, { useState, useEffect } from 'react';
import { Lock, Plus, Eye, EyeOff, FileText, Upload, Image as ImageIcon, FileIcon, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VaultPinModal } from '@/components/VaultPinModal';

interface VaultScreenProps {
  onBack: () => void;
}

interface VaultItem {
  id: string;
  title: string;
  content?: string;
  item_type: 'password' | 'note' | 'file';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  category: string;
  created_at: string;
}

export const VaultScreen: React.FC<VaultScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [visibleItems, setVisibleItems] = useState<{[key: string]: boolean}>({});
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    type: 'password' as 'password' | 'note' | 'file',
    category: 'general'
  });

  useEffect(() => {
    setShowPinModal(true);
  }, []);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setIsUnlocked(true);
    loadVaultItems();
  };

  const loadVaultItems = async () => {
    if (!user || !isUnlocked) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vault_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData: VaultItem[] = (data || []).map(item => ({
        ...item,
        item_type: item.item_type as 'password' | 'note' | 'file'
      }));
      
      setVaultItems(typedData);
    } catch (error) {
      console.error('Error loading vault items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (id: string) => {
    setVisibleItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vault-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('vault-files')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('vault_items')
        .insert({
          user_id: user.id,
          title: file.name,
          item_type: 'file',
          file_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          category: 'files'
        });

      if (dbError) throw dbError;

      loadVaultItems();
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    if (!newItem.title.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('vault_items')
        .insert({
          user_id: user.id,
          title: newItem.title,
          content: newItem.content || null,
          item_type: newItem.type,
          category: newItem.category
        });

      if (error) throw error;

      setShowCreateModal(false);
      setNewItem({ title: '', content: '', type: 'password', category: 'general' });
      loadVaultItems();
      alert('Item created successfully!');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string, fileUrl?: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('vault_items')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      if (fileUrl) {
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('vault-files')
            .remove([`${user?.id}/${fileName}`]);
        }
      }

      loadVaultItems();
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getItemIcon = (item: VaultItem) => {
    if (item.item_type === 'file') {
      if (item.mime_type?.startsWith('image/')) {
        return <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />;
      }
      return <FileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
    return <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  if (!isUnlocked) {
    return (
      <>
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Vault Locked
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your PIN to access secure items
              </p>
            </div>
          </div>
        </div>
        <VaultPinModal
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          onSuccess={handlePinSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="p-4">
        {/* File Upload */}
        <div className="mb-6">
          <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Upload files (PDF, Images, Documents)
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
              disabled={loading}
            />
          </label>
        </div>

          {/* Vault Items */}
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading vault items...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vaultItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      {getItemIcon(item)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 truncate">
                        {item.title}
                      </h3>
                      
                      {item.item_type === 'file' ? (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>{item.file_name}</p>
                          <p>{formatFileSize(item.file_size)}</p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {visibleItems[item.id] ? (item.content || 'No content') : '••••••••••••'}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {item.item_type !== 'file' && (
                        <button
                          onClick={() => toggleVisibility(item.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {visibleItems[item.id] ? (
                            <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          )}
                        </button>
                      )}
                      
                      {item.item_type === 'file' && item.file_url && (
                        <button
                          onClick={() => window.open(item.file_url, '_blank')}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteItem(item.id, item.file_url)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {vaultItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Your vault is empty. Add your first secure item.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Item FAB */}
        <button 
          onClick={() => {
            setShowCreateModal(true);
          }}
          className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>

        {/* Create Item Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Add New Item
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'password' | 'note' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="password">Password</option>
                    <option value="note">Secure Note</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {newItem.type === 'password' ? 'Password' : 'Content'}
                  </label>
                  <textarea
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder={newItem.type === 'password' ? 'Enter password' : 'Enter content'}
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateItem}
                    disabled={!newItem.title.trim() || loading}
                    className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
