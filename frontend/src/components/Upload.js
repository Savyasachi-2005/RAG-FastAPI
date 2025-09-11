import React, { useState } from 'react';
import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Upload({ setLoading, onUploaded, compact = false }) {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fakeProgress = () => {
    setProgress(5);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) { clearInterval(id); return p; }
        return p + Math.random() * 18;
      });
    }, 180);
    return id;
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

  const formData = new FormData();
  formData.append('file', file);
  setLoading(true);
  setUploading(true);
  setResult(null);
  setProgress(0);
  const progId = fakeProgress();

  try {
      const response = await fetch('/upload-pdf/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
  if (!response.ok) throw new Error(data.detail || 'Upload failed');
  toast.success(`Embedded ${data.chunks_count} chunks`);
  setResult({ chunks: data.chunks_count, filename: file.name });
  if (onUploaded) onUploaded();
    } catch (error) {
      toast.error(error.message);
    } finally {
  clearInterval(progId);
  setProgress(100);
      setLoading(false);
  setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`h-full flex flex-col ${compact ? '' : 'bg-white/90 dark:bg-gray-800/70 backdrop-blur rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4'}`}
    >
      <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-white tracking-wide">
        Upload PDF
      </h2>
      <div className="flex items-center justify-center w-full flex-grow">
  <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <DocumentArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only</p>
          </div>
          <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} />
        </label>
      </div>
  <AnimatePresence mode="wait">
        {uploading && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6"
          >
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 tracking-wide">
              Embedding chunks... {Math.min(99, Math.round(progress))}%
            </p>
          </motion.div>
        )}
        {result && !uploading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-4 flex items-start gap-3 p-4 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
          >
            <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {result.chunks} chunks embedded successfully
              </p>
              <p className="text-xs text-green-600/70 dark:text-green-400/60 mt-0.5">
                File: {result.filename}
              </p>
            </div>
          </motion.div>
        )}
  </AnimatePresence>
    </motion.div>
  );
}
