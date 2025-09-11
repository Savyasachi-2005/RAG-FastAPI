import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import ChatMessage from './ChatMessage';
import AnswerCard from './AnswerCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Chat({ loading, setLoading }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: question, type: 'user' }]);
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch('/ask/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to get answer');
      setMessages((prev) => [
        ...prev,
        {
          text: data.answer || data.ans || 'No answer returned.',
          type: 'assistant',
          sourceChunks: data.retrieved_chunks || data.source_chunks || data.chunks || [],
        },
      ]);
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessages((prev) => [
          ...prev,
          { text: 'Response stopped.', type: 'assistant', sourceChunks: [] },
        ]);
      } else {
        toast.error(error.message);
        setMessages((prev) => [
          ...prev,
          { text: 'Sorry, something went wrong. Please try again.', type: 'assistant' },
        ]);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="h-full flex flex-col"
    >
      <div className="px-5 pt-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white tracking-wide">Chat</h2>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
  <div className="flex-1 overflow-y-auto scroll-smooth px-5 py-3 space-y-2" id="chat-scroll">
          {messages.filter(m => m.type === 'user').length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Upload a PDF and ask a question to get started.</p>
          )}
          <AnimatePresence initial={false}>
            {messages.filter(m => m.type === 'user').map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className='flex justify-end'
              >
                <ChatMessage {...m} />
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
        <AnimatePresence mode="wait">
          {messages.length > 0 && messages[messages.length -1].type === 'assistant' && (
            <div className="px-4 pb-2">
              <AnswerCard
                key={messages.length -1}
                answer={messages[messages.length -1].text}
                chunks={messages[messages.length -1].sourceChunks}
              />
            </div>
          )}
        </AnimatePresence>
  <div className="border-t border-gray-200 dark:border-gray-700 bg-white/85 dark:bg-gray-800/85 backdrop-blur px-4 py-2 sticky bottom-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the PDF..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={loading}
            />
            {loading ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStop}
                className="px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow flex items-center justify-center"
              >
                Stop
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow flex items-center justify-center"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </motion.button>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}
