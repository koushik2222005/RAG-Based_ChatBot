import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Authentication aborted.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-xs text-zinc-500 mt-1">Provide access parameters to mount secure vector channels</p>
        </div>

        {error && <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900 text-rose-400 text-xs font-semibold rounded-lg">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Email Identity</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#FF5500]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Access Key</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#FF5500]" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#FF5500] hover:bg-[#e04b00] disabled:bg-zinc-800 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer mt-2">{loading ? "Validating Session..." : "Mount Core Console"}</button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">Missing structural security profile? <Link to="/register" className="text-[#FF5500] hover:underline">Register console context</Link></p>
      </div>
    </div>
  );
}