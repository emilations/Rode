// src/Chat.js
import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://192.168.3.190:11434/api/generate', {
        model: 'llama3',
        prompt: input,
        stream: false,
      });

      graduallyDisplayResponse(response.data.response);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...messages,
        userMessage,
        { sender: 'bot', text: 'An error occurred while fetching the response.' },
      ]);
      setLoading(false);
    }
  };

  const graduallyDisplayResponse = (text) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.sender === 'bot') {
            return [
              ...prev.slice(0, prev.length - 1),
              { ...lastMessage, text: lastMessage.text + text[index] },
            ];
          } else {
            return [...prev, { sender: 'bot', text: text[index] }];
          }
        });
        index++;
      } else {
        clearInterval(intervalId);
        setLoading(false);
      }
    }, 50); // Adjust the speed here (milliseconds per character)
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default Chat;
