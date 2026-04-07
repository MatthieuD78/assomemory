'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);
    
    const response = await fetch('/api/rag/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input, associationId: 'test-id' })
    });
    
    const data = await response.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div>L'IA réfléchit...</div>}
      </div>
      
      <div className="flex space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          rows={2}
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
