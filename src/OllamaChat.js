// src/OllamaChat.js
import React, { useState } from 'react';

function OllamaChat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResponse('');
    setLoading(true);

    try {
      const result = await fetch('http://192.168.3.190:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt: prompt,
          stream: false
        })
      });
      const data = await result.json();
      slowlyPopulateResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while fetching the response.');
      setLoading(false);
    }
  };

  const slowlyPopulateResponse = (text) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        setResponse((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(intervalId);
        setLoading(false);
      }
    }, 50); // Adjust the speed here (milliseconds per character)
  };

  return (
    <div>
      <h1>Ollama Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default OllamaChat;
