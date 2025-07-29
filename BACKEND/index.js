const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.send('OK'));


// POST /analyze – analyze single text
app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment",
      { inputs: text },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
      }
    );

    res.json({ sentiment: hfResponse.data });
  } catch (error) {
    console.error("Hugging Face error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to analyze text",
      details: error.response?.data || error.message,
    });
  }
});

// POST /mine – analyze big text, return sentiment summary & word counts
app.post("/mine", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    // Split big text into lines (you can change to split by '.' etc.)
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    let results = [];
    let wordCounts = {};

    for (let line of lines) {
      try {
        const hfResponse = await axios.post(
          "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment",
          { inputs: line },
          {
            headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
          }
        );

        results.push({
          text: line,
          sentiment: hfResponse.data,
        });

        // Count words for keyword mining
        const words = line.toLowerCase().split(/\W+/);
        for (let word of words) {
          if (word.length > 2) { // ignore very short words
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        }
      } catch (error) {
        console.error("Hugging Face error for line:", error.response?.data || error.message);
        results.push({
          text: line,
          sentiment: "error"
        });
      }
    }

    // Create summary
    let sentimentSummary = { positive: 0, neutral: 0, negative: 0 };
    for (let r of results) {
      if (Array.isArray(r.sentiment) && r.sentiment[0]) {
        const topLabel = r.sentiment[0][0].label;
        if (topLabel === "5 stars" || topLabel === "4 stars") {
          sentimentSummary.positive++;
        } else if (topLabel === "3 stars") {
          sentimentSummary.neutral++;
        } else {
          sentimentSummary.negative++;
        }
      }
    }

    res.json({
      sentimentSummary,
      wordCounts,
      total: lines.length,
      results
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Failed to analyze text" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
