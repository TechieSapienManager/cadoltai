import React, { useState, useEffect } from 'react';
import { Plus, Check, Clock, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { notificationService } from '@/utils/notificationService';

interface TodoScreenProps {
  onBack: () => void;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  due_time?: string;
  created_at: string;
}

export const TodoScreen: React.FC<TodoScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
    due_time: ''
  });

  const loadTodos = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [user]);

  const handleCreateTodo = async () => {
    if (!newTodo.title.trim() || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          user_id: user.id,
          title: newTodo.title,
          description: newTodo.description || null,
          priority: newTodo.priority,
          due_date: newTodo.due_date || null,
          due_time: newTodo.due_time || null
        })
        .select()
        .single();

      if (error) throw error;

      // Schedule notification if due date and time are set
      if (newTodo.due_date && newTodo.due_time && data) {
        const dueDateTime = new Date(`${newTodo.due_date}T${newTodo.due_time}`);
        notificationService.scheduleTaskNotification(data.id, newTodo.title, dueDateTime);
      }

      setShowCreateModal(false);
      setNewTodo({ title: '', description: '', priority: 'medium', due_date: '', due_time: '' });
      loadTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;

      // Clear notification if task is completed
      if (!completed) {
        notificationService.clearNotification(id);
      }

      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Clear any scheduled notification
      notificationService.clearNotification(id);
      
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDueDate = (date?: string, time?: string) => {
    if (!date) return '';
    const datePart = new Date(date).toLocaleDateString();
    const timePart = time ? new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return `${datePart} ${timePart}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="p-4">
        {/* Add Todo */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Add a new task</span>
          </button>
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading todos...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Checkbox and Title */}
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id, todo.completed)}
                      className="h-5 w-5 rounded accent-green-500 focus:ring-0"
                    />
                    <span className={`text-gray-800 dark:text-gray-200 font-medium ${todo.completed ? 'line-through opacity-60' : ''}`}>
                      {todo.title}
                    </span>
                  </label>

                  {/* Priority */}
                  {todo.priority && (
                    <div className={`uppercase text-xs font-bold px-2 py-1 rounded-full ${getPriorityColor(todo.priority)} bg-opacity-20`}>
                      {todo.priority}
                    </div>
                  )}
                </div>

                {/* Description */}
                {todo.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    {todo.description}
                  </p>
                )}

                {/* Due Date and Time */}
                {todo.due_date && (
                  <div className="flex items-center text-gray-500 dark:text-gray-500 text-xs mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Due: {formatDueDate(todo.due_date, todo.due_time)}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            ))}

            {todos.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No todos yet. Add some tasks!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Todo Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Add New Todo
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTodo.due_date}
                    onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={newTodo.due_time}
                    onChange={(e) => setNewTodo({ ...newTodo, due_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTodo}
                  disabled={!newTodo.title.trim() || loading}
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
