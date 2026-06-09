import React, { useState, useRef, useEffect } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    const botMessageId = Date.now();
    setMessages(prev => [...prev, { id: botMessageId, text: '', sender: 'bot' }]);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) throw new Error("Could not retrieve AI execution matrix streaming channel.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, text: msg.text + chunk } : msg
        ));
      }
    } catch (err) {
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, text: 'Local LLM processing faulted. Ensure Ollama is running.' } : msg
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/20">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-md">
        <h3 className="font-bold text-sm text-zinc-200 uppercase tracking-wider">AI Analytical Vector Chat</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6">
            <p className="text-sm font-medium">Your local index repository workspace is ready.</p>
            <p className="text-xs mt-1 max-w-xs">Upload a source asset and run validation requests via terminal configurations below.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.sender === 'user' 
                ? 'bg-[#FF5500] text-white font-medium shadow-sm' 
                : 'bg-zinc-900 text-zinc-100 border border-zinc-800'
            }`}>
              {msg.text || <span className="animate-pulse text-zinc-500">Processing vector blocks...</span>}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex gap-2">
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          placeholder={loading ? "Generating analytical token streams..." : "Ask questions against localized indexes..."}
          className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5500] disabled:opacity-50 transition-colors"
        />
        <button 
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[#FF5500] hover:bg-[#e04b00] disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Query
        </button>
      </form>
    </div>
  );
}