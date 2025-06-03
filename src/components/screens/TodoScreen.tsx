
import React, { useState } from 'react';
import { Plus, Clock, MoreVertical } from 'lucide-react';

interface TodoScreenProps {
  onBack: () => void;
}

export const TodoScreen: React.FC<TodoScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('all');

  const todos = [
    {
      id: 1,
      title: 'Review project proposal',
      completed: false,
      dueTime: '10:00 AM',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Call client about meeting',
      completed: false,
      dueTime: '2:00 PM',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Update presentation slides',
      completed: true,
      dueTime: '',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Grocery shopping',
      completed: false,
      dueTime: '6:00 PM',
      priority: 'low'
    }
  ];

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' }
  ];

  const filteredTodos = todos.filter(todo => {
    switch (activeTab) {
      case 'completed':
        return todo.completed;
      case 'today':
        return !todo.completed && todo.dueTime;
      case 'upcoming':
        return !todo.completed && !todo.dueTime;
      default:
        return true;
    }
  });

  const toggleTodo = (id: number) => {
    // In a real app, this would update the todo in state/database
    console.log('Toggle todo:', id);
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
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
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

                {/* Title */}
                <div className="flex-1">
                  <span className={`text-gray-800 dark:text-gray-200 ${
                    todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                  }`}>
                    {todo.title}
                  </span>
                </div>

                {/* Due Time */}
                {todo.dueTime && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{todo.dueTime}</span>
                  </div>
                )}

                {/* More Options */}
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No tasks found for this category.
            </p>
          </div>
        )}
      </div>

      {/* Add Todo FAB */}
      <button className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
