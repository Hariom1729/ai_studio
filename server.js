import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const ai = new GoogleGenAI({
  apiKey: "AIzaSyC9yCtf_Qmw5K8c8FNR6zC57Iy9UezV8D4"
});

const history = [];

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) return res.status(400).json({ error: 'Message is required' });

  history.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: history
    });

    const reply = result.candidates[0].content.parts[0].text;

    history.push({
      role: 'model',
      parts: [{ text: reply }]
    });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
