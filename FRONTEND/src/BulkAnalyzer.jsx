import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./BulkAnalyzer.css";

export default function BulkAnalyzer() {
  const [bigText, setBigText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(null);

  // Example datasets
  const examples = [
    // Example 1 – 5 short reviews
    `Amazing phone! Totally worth it.\nBattery lasts all day, very satisfied.\nCamera quality is stunning and sharp.\nSuper fast and responsive interface.\nBest purchase I've made this year.`,

    // Example 2 – 15 mixed reviews
    `Absolutely love this laptop, works smoothly.\nBattery life could be better.\nKeyboard feels great to type on.\nThe screen brightness is okay.\nSometimes gets a bit warm.\nPerformance is impressive for daily tasks.\nSound quality is decent, but not very loud.\nBuild quality feels premium and sturdy.\nSpeakers could have been better.\nBoots up quickly, saves me time.\nGaming performance isn't the best.\nDesign is sleek and professional.\nTrackpad is smooth and accurate.\nValue for money is excellent.\nWould recommend to students and professionals alike.`,

    // Example 3 – 30 lines (big data)
    `Service was quick and polite.\nFood was served hot and fresh.\nAmbience is very cozy and relaxing.\nMusic volume was just right.\nMenu has plenty of options.\nPortions were generous.\nLoved the dessert section.\nPrices felt reasonable for the quality.\nStaff checked on us regularly.\nRestrooms were clean and tidy.\nDecor is stylish and modern.\nDrinks menu could have more options.\nParking was easy to find nearby.\nWaiting time was minimal.\nTable was clean and comfortable.\nThe lighting is warm and welcoming.\nSoup was perfectly seasoned.\nMain course was flavorful.\nDessert was a highlight.\nWould come back again soon.\nFriends enjoyed it too.\nGreat for family dinners.\nChildren’s menu available.\nThey offer vegan options.\nEasy to book online.\nPayment process was smooth.\nLoved the outdoor seating.\nInside felt spacious.\nHighly recommended for dates.\nOverall a great dining experience!`,
  ];

  const handleAnalyze = async () => {
    if (!bigText.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeTaken(null);
    const start = Date.now();

    try {
      const response = await fetch(
        "https://text-mining-zpd1.onrender.com/mine",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: bigText }),
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Failed to analyze", err);
    } finally {
      const end = Date.now();
      const elapsedSeconds = Math.floor((end - start) / 1000);
      if (elapsedSeconds < 60) {
        setTimeTaken(`${elapsedSeconds} seconds`);
      } else {
        const mins = Math.floor(elapsedSeconds / 60);
        const secs = elapsedSeconds % 60;
        setTimeTaken(`${mins} min ${secs} sec`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h3>📊 Text Mining Demo</h3>

      <div className="example-buttons">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="outlined"
            size="small"
            onClick={() => setBigText(example)}
          >
            Example {index + 1}
          </Button>
        ))}
      </div>

      <TextField
        multiline
        rows={10}
        fullWidth
        placeholder="Paste many reviews or big text here..."
        value={bigText}
        onChange={(e) => setBigText(e.target.value)}
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      />

      <Button
        variant="contained"
        className="analyze-btn"
        onClick={handleAnalyze}
        disabled={loading}
      >
        Analyze
      </Button>

      {loading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <div>
            🔍 Analyzing… please wait. (Free trial APIs may respond slowly.)
          </div>
          <div className="facts">
            💡 Fun facts about text mining:
            <br />
            • Helps discover hidden trends in reviews!
            <br />
            • Uses NLP & machine learning to understand meaning.
            <br />• Common in e-commerce & healthcare analytics.
          </div>
        </div>
      )}

      {result && (
        <div className="results-section">
          <h4>✅ Sentiment Summary:</h4>
          <pre>{JSON.stringify(result.sentimentSummary, null, 2)}</pre>

          <h4>📝 Common Keywords:</h4>
          <pre>{JSON.stringify(result.wordCounts, null, 2)}</pre>

          <h4>📄 Total lines analyzed: {result.total}</h4>

          {timeTaken && <div className="facts">🕒 Time taken: {timeTaken}</div>}
        </div>
      )}

      <footer
        style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "0.9rem",
          color: "#555",
        }}
      >
        Built by Abdul Shaz • USN: 4SF23IS002
      </footer>
    </div>
  );
}
