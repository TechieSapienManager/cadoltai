
import React, { useState } from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';

interface NotesScreenProps {
  onBack: () => void;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const notes = [
    {
      id: 1,
      title: 'Project Ideas',
      snippet: 'New app concepts for Q2 including AI integration and user experience improvements...',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      title: 'Meeting Notes - Team Sync',
      snippet: 'Discussed project timeline, resource allocation, and upcoming milestones...',
      timestamp: '1 day ago'
    },
    {
      id: 3,
      title: 'Shopping List',
      snippet: 'Groceries for the week: milk, bread, vegetables, fruits...',
      timestamp: '3 days ago'
    },
    {
      id: 4,
      title: 'Book Recommendations',
      snippet: 'List of books to read this month including productivity and technology titles...',
      timestamp: '1 week ago'
    }
  ];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Sort/Filter Button */}
        <div className="flex justify-end mb-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer hover:scale-102"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {note.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
                {note.snippet}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {note.timestamp}
              </p>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet.'}
            </p>
          </div>
        )}
      </div>

      {/* New Note FAB */}
      <button className="fixed bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
