
import { useEffect, useState } from "react";
import "./dashbord.css"
import axios from 'axios'

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
   const userId = "user123";

useEffect(()=>{
  
   const getMessapges = async()=>{
        try {
            
            const res = await axios.get('http://localhost:3000/messages',{
              params:{userId}})

            setMessages(res.data.messages)
            
        } catch (error) {
            console.log("failed to get messages",error)
        }
    }
    getMessapges()

},[])

  
const handelSubmit = async (e) => {
  e.preventDefault();

  if (!input.trim()) return;


  const newMessages = [...messages, { sender: 'user', text: input }];
  setMessages(newMessages);
  setInput('');  

  try {
    const res = await axios.post("http://localhost:3000/chat", {
      userId,
      sender: 'user',
      text: input,
    });

   
    setMessages(res.data.messages);
  } catch (error) {
    setMessages([...newMessages, { sender: 'bot', text: "Sorry, server is busy. Please try again later." }]);
  }
};



  return (
    <div className="chat-container">
      <h2>Student Assistant Chatbot</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handelSubmit}>
        <input type="text" placeholder="Type your question..."value={input} onChange={(e)=>{setInput(e.target.value)}} />
        <button type="submit" >Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
