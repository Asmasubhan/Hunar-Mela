import { useState } from 'react';
import { getChatbotResponse } from '../services/ai';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const response = await getChatbotResponse(input);
    setIsTyping(false);
    const botMessage = { text: response, sender: 'bot' };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white border rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="bg-orange-500 text-white p-4 rounded-t-lg">
            <h3 className="font-bold">Hunar Mela Assistant</h3>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                  
                  {msg.text}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="mb-2 text-left">
                <span className="inline-block p-2 rounded bg-orange-200">
                  Typing...
                </span>
              </div>
            )}
          </div>
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-grow border rounded-l px-2 py-1"
                placeholder="Ask about our products..."
              />
              <button onClick={handleSend} className="bg-orange-500 text-white px-4 rounded-r">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot;