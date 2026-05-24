import { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("कोई file चुनें");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "http://localhost:8000/analyze",
        formData
      );
      setResult(res.data.result);
    } catch (err) {
      setResult("कुछ गलत हुआ। दोबारा कोशिश करें।");
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ color: "#1a1a2e", textAlign: "center" }}>
        ⚖️ Vakil AI
      </h1>
      <p style={{ textAlign: "center", color: "#666" }}>
        अपना legal document upload करें — हम हिंदी में समझाएंगे
      </p>

      <div style={{
        border: "2px dashed #ccc",
        borderRadius: "12px",
        padding: "30px",
        textAlign: "center",
        margin: "30px 0"
      }}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <p style={{ color: "green" }}>✅ {file.name}</p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "#1a1a2e",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        {loading ? "समझा रहे हैं..." : "समझाओ"}
      </button>

      {result && (
        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          whiteSpace: "pre-wrap",
          lineHeight: "1.8"
        }}>
          {result}
        </div>
      )}

      <p style={{
        marginTop: "20px",
        fontSize: "12px",
        color: "#999",
        textAlign: "center"
      }}>
        ⚠️ यह AI-generated जानकारी है, legal advice नहीं।
        गंभीर मामलों में वकील से मिलें।
      </p>
    </div>
  );
}