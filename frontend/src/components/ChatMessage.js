import React, { useState } from 'react';
import clsx from 'clsx';

export default function ChatMessage({ text, type, sourceChunks }) {
  const [showSource, setShowSource] = useState(false);
  const hasSources = Array.isArray(sourceChunks) && sourceChunks.length > 0;

  return (
    <div className={clsx(
      'px-4 py-2 rounded-2xl shadow-sm transition text-sm leading-relaxed break-words max-w-[75%]',
      type === 'user'
        ? 'bg-blue-600 text-white ml-auto rounded-br-md'
        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-800 rounded-bl-md'
    )}>
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
      {hasSources && (
        <div className="mt-3">
          <button
            onClick={() => setShowSource(!showSource)}
            className="text-xs font-medium px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
          >
            {showSource ? 'Hide Sources' : 'Show Sources'}
          </button>
          {showSource && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
              {sourceChunks.map((chunk, i) => (
                <div key={i} className="p-2 rounded bg-gray-50 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
                  {chunk}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
