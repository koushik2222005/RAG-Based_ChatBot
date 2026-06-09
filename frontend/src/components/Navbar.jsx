import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'Local User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#FF5500] animate-pulse" />
        <span className="font-bold text-lg tracking-tight text-white">
          LOCAL<span className="text-[#FF5500]">RAG</span>
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-xs text-zinc-400 font-medium bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
          {userEmail}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}