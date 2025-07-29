import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:5000/analyze", { text });
      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze text.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h2>Text Mining Demo</h2>
      <textarea
        rows={6}
        cols={60}
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h4>Sentiment Result:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
