import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './BulkAnalyzer.css';

export default function BulkAnalyzer() {
  const [bigText, setBigText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeTaken, setTimeTaken] = useState(null);

  // Example datasets
  const examples = [
    `This phone is amazing!\nBattery life is great.\nCamera quality is superb.\nThe screen is sharp and bright.`,
    `I really dislike this laptop.\nIt's slow and keeps freezing.\nBattery dies quickly.\nNot worth the price.`,
    `Service was okay.\nFood tasted average.\nAmbience was nice though.\nMight visit again.`
  ];

  const handleAnalyze = async () => {
    if (!bigText.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeTaken(null);
    const start = Date.now();

    try {
      const response = await fetch('https://text-mining-zpd1.onrender.com/mine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: bigText })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Failed to analyze', err);
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
        onChange={e => setBigText(e.target.value)}
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
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
          <div>🔍 Analyzing… please wait. (Free trial APIs may respond slowly.)</div>
          <div className="facts">
            💡 Fun facts about text mining:<br/>
            • Helps discover hidden trends in reviews!<br/>
            • Uses NLP & machine learning to understand meaning.<br/>
            • Common in e-commerce & healthcare analytics.
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

          {timeTaken && (
            <div className="facts">
              🕒 Time taken: {timeTaken}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
