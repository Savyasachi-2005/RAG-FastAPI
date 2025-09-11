import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Upload from './components/Upload';
import Chat from './components/Chat';
import { Toaster } from 'react-hot-toast';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 min-h-0">
          {/* PDF Utility Panel */}
          <div className="w-full md:w-[30%] md:min-h-0 h-auto md:h-full overflow-visible md:overflow-y-auto p-0 md:p-0 rounded-lg shadow-md border md:border-r border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/70 flex flex-col" style={{backdropFilter:'blur(6px)'}}>
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              <Upload setLoading={setLoading} onUploaded={() => {}} compact />
            </div>
          </div>
          {/* Chat Workspace Panel */}
          <div className="w-full md:w-[70%] flex-1 h-full flex flex-col rounded-lg shadow-md bg-white/90 dark:bg-gray-800/70 overflow-hidden min-h-0" style={{backdropFilter:'blur(6px)'}}>
            <Chat loading={loading} setLoading={setLoading} />
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default App;
