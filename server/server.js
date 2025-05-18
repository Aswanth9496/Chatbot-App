
const express = require('express');
const dotenv = require('dotenv')
const axios = require('axios');
const cors = require('cors')
const mongoose = require('mongoose')

const Chat = require('./src/schema/chatSchema')
const openai = require('./src/config/AIconfig')

dotenv.config();

const app = express()

mongoose.connect('mongodb://localhost:27017/chatBoat')
.then(()=>{console.log('connected to mongoDB')})
.catch((err)=>{console.log('MongoDB connection error', err)})





app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('ChatBot API is running');
});




app.get('/messages', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const chat = await Chat.findOne({ userId });

    if (!chat) {
      return res.json({ messages: [] }); // No messages yet
    }

    res.json({ messages: chat.messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



app.post('/chat', async (req, res) => {
  const { userId, sender, text } = req.body;
  if (!userId || !sender || !text) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({
        userId,
        messages: [{ sender, text }],
      });
    } else {
      chat.messages.push({ sender, text });
    }

    let botReply;
    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: text }],
      });
      botReply = aiResponse.choices[0].message.content;
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      botReply = "Sorry, the server is busy. Please try again later.";
    }

    chat.messages.push({ sender: "bot", text: botReply });
    await chat.save();

    res.status(200).json({ success: true, messages: chat.messages });
  } catch (error) {
    console.error('Server error:', error);
     res.status(500).json({ error: "Sorry, the server is busy. Please try again later." });
  }
});



const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`server is runnig in : http://localhost:${3000}`)
});