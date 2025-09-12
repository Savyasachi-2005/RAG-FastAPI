import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnswerCard({ answer, chunks }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!answer) return;
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(answer.slice(0, i + 1));
      i++;
      if (i >= answer.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [answer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-4 p-5 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Answer</h3>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-gray-900 dark:text-gray-100 min-h-[40px]">
        {displayed || '...'}
      </pre>
      {chunks && chunks.length > 0 && (
        <motion.details
          initial={false}
          className="mt-4 group"
        >
          <summary className="cursor-pointer list-none text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Show retrieved chunks ({chunks.length})
          </summary>
          <div className="mt-3 space-y-3">
            {chunks.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="p-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm"
              >
                {c}
              </motion.div>
            ))}
          </div>
        </motion.details>
      )}
    </motion.div>
  );
}
