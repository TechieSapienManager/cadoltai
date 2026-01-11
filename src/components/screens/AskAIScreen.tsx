import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AskAIScreenProps {
  onBack: () => void;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
}

export const AskAIScreen: React.FC<AskAIScreenProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m Cadolt AI, your productivity assistant. How can I help you today?'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Help me plan my day',
    'Create a new note',
    'What should I focus on?',
    'Suggest productivity tips'
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: message
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const messagesForAI = conversation
        .filter(msg => msg.id !== 1) // Exclude initial greeting
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
      
      messagesForAI.push({ role: 'user', content: userMessage.content });

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: messagesForAI }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response');
      }

      if (data?.error) {
        // Handle specific error cases
        if (data.error.includes('Rate limit')) {
          toast.error('Too many requests. Please wait a moment and try again.');
        } else if (data.error.includes('credits')) {
          toast.error('AI service temporarily unavailable.');
        }
        throw new Error(data.error);
      }

      const aiResponse: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: data?.response || 'I apologize, but I couldn\'t generate a response. Please try again.'
      };
      
      setConversation(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
      };
      setConversation(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 flex flex-col">
      {/* Input Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask Cadolt AI anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-secondary border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="p-4 border-b border-border">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt)}
              disabled={isLoading}
              className="flex-shrink-0 px-4 py-2 bg-secondary text-muted-foreground rounded-full text-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {conversation.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground'
              }`}
            >
              {msg.type === 'ai' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Cadolt AI</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-secondary px-4 py-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Cadolt AI</span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Auth prompt for non-logged in users */}
      {!user && (
        <div className="fixed bottom-20 left-4 right-4 bg-card border border-border rounded-xl p-4 shadow-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Sign in for full features</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create an account to save your conversations and access all productivity tools.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
