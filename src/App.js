import React, { useState, useEffect } from 'react';
import './App.css';


//function uses the useEffect hook to fetch the initial interaction from Tinnie 
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/initial');
        const data = await response.json();
        setMessages([{ sender: 'Tinnie', text: data.text }]);
      } catch (err) {
        console.error('Error fetching initial message:', err);
        setMessages([{ sender: 'Tinnie', text: 'Failed to fetch initial message.' }]);
      }
    };

    fetchInitialMessage();
  }, []);

  //Updates the input state when user types into the input field 
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  //function handles submission of user messages by adding user input into message state, sends to the back end then adds AI response into the state
  const handleSubmit = async () => {
    const userMessage = input;
    setMessages(messages => [...messages, { sender: 'User', text: userMessage }]);
    setInput('');

    try {
      const response = await fetch('http://localhost:3001/api/interact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      setMessages(messages => [...messages, { sender: 'Tinnie', text: data.text }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(messages => [...messages, { sender: 'Tinnie', text: 'Failed to send message.' }]);
    }
  };

  return (
      <div className="App">
          <h1>Tinnie - Your AI Insurance Policy Consultant</h1>
          <div className="chat-window">
              {messages.map((msg, index) => (
                  <p key={index} className={`message ${msg.sender === 'Tinnie' ? 'tinnie' : 'user'}`}>
                      <strong>{msg.sender}:</strong> {msg.text}
                  </p>
              ))}
          </div>
          <input type="text" value={input} onChange={handleInputChange} placeholder="Type your message..." />
          <button onClick={handleSubmit}>Submit</button>
      </div>
  );
}

export default App;

