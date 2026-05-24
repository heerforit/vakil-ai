from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz
import tempfile
import os
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = "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"

def extract_text(file_bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name
    doc = fitz.open(tmp_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    os.unlink(tmp_path)
    return text

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text(contents)

    prompt = f"""You are a legal document assistant for India.
A user has uploaded this document. They are an ordinary Indian 
person with no legal knowledge.

Explain this document in simple Hindi in this exact format:

1. यह document क्या है: (1 line max)
2. मुख्य बातें: (exactly 5 bullet points)
3. आपको क्या करना है: (clear action items with deadlines if any)
4. आपके अधिकार: (what rights they have)
5. क्या lawyer चाहिए: (हाँ या नहीं, 1 line reason)

Use simple Hindi that a Class 8 student can understand.
Never use legal jargon without explaining it.
Be direct. Be reassuring but honest.

Document text: {text}"""

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    result = response.json()
    print("GROQ RESPONSE:", result)

    if "choices" not in result:
        return {"result": "Error: " + str(result)}

    answer = result["choices"][0]["message"]["content"]
    return {"result": answer}