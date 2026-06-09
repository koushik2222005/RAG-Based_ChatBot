import React from 'react';
import ChatWindow from '../components/ChatWindow';
import DocumentUpload from '../components/DocumentUpload';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
        
        {/* Document Ingestion Panel */}
        <div className="md:col-span-1 bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">Local Store Context</h2>
            <p className="text-xs text-zinc-500 mt-1 leading-normal">
              Documents are processed directly inside system loops to isolate indexing tasks and limit vector overhead.
            </p>
          </div>
          <hr className="border-zinc-800" />
          <DocumentUpload />
        </div>

        {/* Dynamic Context Interrogator Panel */}
        <div className="md:col-span-3 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col overflow-hidden shadow-xl min-h-[500px] h-[calc(100vh-140px)]">
          <ChatWindow />
        </div>

      </div>
    </div>
  );
}