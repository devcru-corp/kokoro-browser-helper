import React, { useEffect, useRef, useState } from 'react';
import './chat.css'; // Import the CSS for styling

// ChatHeader Component
const ChatHeader = () => (
  <div className="chat-header">
    Chat Window
  </div>
);

// ChatMessage Component
const ChatMessage = ({ message, sender }) => (
  <div className={`chat-message ${sender}`}>
    <div className="message-bubble">
      {message}
    </div>
  </div>
);

// ChatMessageList Component
const ChatMessageList = ({ messages }) => {
  const messageListRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={messageListRef} className="chat-message-list">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
};

// ChatInput Component
const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() !== '') {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

// ChatWindow Component
const ChatWindow = () => {
  const [messages, setMessages] = useState([]);

  // Load persisted messages on mount
  useEffect(() => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['chatMessages'], (result) => {
        if (result.chatMessages) {
          setMessages(result.chatMessages);
        } else {
          setMessages([{ sender: 'bot', text: 'Hello! How can I help you today?' }]);
        }
      });
    } else {
      // Fallback for non-extension environments
      setMessages([{ sender: 'bot', text: 'Hello! How can I help you today?' }]);
    }
  }, []);
  

  // Persist messages whenever they change
  useEffect(() => {
    chrome.storage.local.set({ chatMessages: messages });
  }, [messages]);

  const addMessage = (text) => {
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text }]);
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Thanks for your message!' }]);
    }, 500);
  };

  return (
    <div className="chat-window">
      <ChatHeader />
      <ChatMessageList messages={messages} />
      <ChatInput onSend={addMessage} />
    </div>
  );
};

export default ChatWindow;
