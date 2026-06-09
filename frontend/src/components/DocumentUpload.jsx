import React, { useState } from 'react';

export default function DocumentUpload({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const processFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Only standard PDF documents are supported.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setStatus({ type: 'loading', message: 'Parsing contents and calculating binary vectors...' });

    try {
      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Pipeline ingestion failure.');
      }

      setStatus({ type: 'success', message: 'Document ingested successfully into local files.' });
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Network connection failed.' });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${
          dragActive 
            ? 'border-[#FF5500] bg-[#FF5500]/5' 
            : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
        }`}
      >
        <input
          type="file"
          id="pdf-file-input"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
        />
        <label htmlFor="pdf-file-input" className="cursor-pointer flex flex-col items-center group">
          <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
            Drag & drop PDF here
          </span>
          <span className="text-xs text-zinc-500 mt-1">
            or <span className="text-[#FF5500] underline">browse system files</span>
          </span>
        </label>
      </div>

      {status.type !== 'idle' && (
        <div className={`p-3 rounded-lg text-xs font-medium border ${
          status.type === 'loading' ? 'bg-zinc-900 border-zinc-800 text-zinc-300 animate-pulse' :
          status.type === 'success' ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' :
          'bg-rose-950/30 border-rose-800/50 text-rose-400'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
}