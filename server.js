require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Mock Interview Backend is running!"
  });
});

app.post("/api/question", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "AI API key is not configured."
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const role = String(req.body.role || "Software Developer")
      .slice(0, 100);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful job interview coach."
        },
        {
          role: "user",
          content: `Generate one interview question for a ${role} candidate. Return only the question.`
        }
      ]
    });

    res.json({
      question: response.choices[0].message.content
    });
  } catch (error) {
    console.error("Question generation failed:", error.message);
    res.status(500).json({
      error: "Could not generate a question. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
