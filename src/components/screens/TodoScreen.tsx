import React, { useState, useEffect } from 'react';
import { Plus, Clock, Edit, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TodoScreenProps {
  onBack: () => void;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  due_time?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export const TodoScreen: React.FC<TodoScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    due_date: '',
    due_time: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    loadTodos();
  }, [user]);

  const loadTodos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the priority field to ensure it matches our interface
      const typedTodos = (data || []).map(todo => ({
        ...todo,
        priority: (todo.priority as 'low' | 'medium' | 'high') || 'medium'
      }));
      
      setTodos(typedTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTodo = async () => {
    if (!user || !todoForm.title.trim()) return;

    try {
      if (editingTodo) {
        const { error } = await supabase
          .from('todos')
          .update({
            title: todoForm.title,
            description: todoForm.description || null,
            due_date: todoForm.due_date || null,
            due_time: todoForm.due_time || null,
            priority: todoForm.priority
          })
          .eq('id', editingTodo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('todos')
          .insert({
            user_id: user.id,
            title: todoForm.title,
            description: todoForm.description || null,
            due_date: todoForm.due_date || null,
            due_time: todoForm.due_time || null,
            priority: todoForm.priority,
            completed: false
          });

        if (error) throw error;
      }

      resetForm();
      loadTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
      alert('Failed to save todo. Please try again.');
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setTodoForm({
      title: todo.title,
      description: todo.description || '',
      due_date: todo.due_date || '',
      due_time: todo.due_time || '',
      priority: todo.priority
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setTodoForm({
      title: '',
      description: '',
      due_date: '',
      due_time: '',
      priority: 'medium'
    });
    setShowCreateModal(false);
    setEditingTodo(null);
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' }
  ];

  const filteredTodos = todos.filter(todo => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (activeTab) {
      case 'completed':
        return todo.completed;
      case 'today':
        return !todo.completed && todo.due_date === today;
      case 'upcoming':
        return !todo.completed && todo.due_date && todo.due_date > today;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="p-4">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading todos...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-gray-800 dark:text-gray-200 ${
                        todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                      }`}>
                        {todo.title}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(todo.priority)} bg-gray-100 dark:bg-gray-700`}>
                        {todo.priority}
                      </span>
                    </div>
                    
                    {todo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {todo.description}
                      </p>
                    )}

                    {todo.due_date && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(todo.due_date).toLocaleDateString()}
                          {todo.due_time && ` at ${todo.due_time}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(todo)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTodos.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks found for this category.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Todo FAB */}
      <button
        onClick={() => {
          setEditingTodo(null);
          resetForm();
          setShowCreateModal(true);
        }}
        className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Create/Edit Todo Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {editingTodo ? 'Edit Todo' : 'Create Todo'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={todoForm.title}
                  onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter todo title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={todoForm.description}
                  onChange={(e) => setTodoForm({ ...todoForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={todoForm.due_date}
                    onChange={(e) => setTodoForm({ ...todoForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={todoForm.due_time}
                    onChange={(e) => setTodoForm({ ...todoForm, due_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={todoForm.priority}
                  onChange={(e) => setTodoForm({ ...todoForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTodo}
                  disabled={!todoForm.title.trim()}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingTodo ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
