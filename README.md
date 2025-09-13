# RAG-FastAPI (Full‑Stack PDF Q&A)

Full‑stack Retrieval Augmented Generation (RAG) application: a FastAPI + ChromaDB backend for embedding & semantic retrieval, and a modern React + Tailwind frontend with animated chat UX (dark mode, 30/70 responsive layout, answer source chunks, and a stop button for responses). Upload a PDF, ask questions, get grounded answers with provenance.

## Features

-  Unified JSON schema: `{ answer, retrieved_chunks }`

- Upload progress feedback + success state card

Dev / Quality
- Separate `frontend/` and `backend/` for clean concerns
- `.env` based secret management (not committed)
- `.gitignore` tuned for Python + Node
- Conventional commit style encouraged

## Tech Stack

Backend: FastAPI, ChromaDB, Sentence-Transformers, PyPDF2 / pypdf, LangChain text splitters, Requests, python-dotenv.
Frontend: React, Tailwind CSS, Framer Motion, react-hot-toast, Heroicons, clsx.
Model Access: OpenRouter (Mistral‑7B currently configured).
Language: Python 3.11+ (adjust if needed), Node 18+/20+ recommended.

## Installation

### 1. Clone
```bash
git clone https://github.com/Savyasachi-2005/RAG-FastAPI.git
cd RAG-FastAPI
```

### 2. Backend Setup (FastAPI / Python)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # (Use `source .venv/bin/activate` on Linux/Mac)
pip install -r requirements.txt
```
Create `backend/.env`:
```env
OPENROUTER_API_KEY=your_api_key_here
```

### 3. Frontend Setup (React / Node)
Use Node 18 or 20 LTS.
```powershell
cd ../frontend
npm install
```

### 4. Directory Hygiene
These paths are auto‑created at runtime (ensure they remain in .gitignore):
- `backend/uploads/`
- `backend/chroma_db/`
- `backend/latest_pdf.json`

### 5. Verify
```powershell
dir ..  # should show backend & frontend
```

## Project Structure

```
RAG-FastAPI/
├── backend/
│   ├── main.py                # FastAPI app entry (includes routers)
│   ├── config.py              # Loads env vars (OpenRouter key)
│   ├── db.py / dBase/         # ChromaDB client helpers (collection, search, add)
│   ├── routers/
│   │   ├── upload.py          # /upload-pdf/ endpoint: ingest → chunk → embed → store
│   │   └── query.py           # /ask/ endpoint: retrieve → LLM answer
│   ├── utils/
│   │   ├── pdf_utils.py       # PDF text extraction
│   │   ├── text_utils.py      # Recursive chunking logic
│   │   ├── embeddings.py      # SentenceTransformer model + embedding function
│   │   ├── sanitize.py        # Safe collection / filename sanitizer
│   │   ├── latest_pdf.py      # Tracks most recently ingested PDF
│   │   └── __init__.py
│   ├── chroma_db/             # Persistent ChromaDB directory (ignored in VCS)
│   ├── uploads/               # Uploaded PDFs (ignored)
│   ├── latest_pdf.json        # Runtime state (ignored)
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── package.json           # Frontend dependencies & scripts
│   ├── tailwind.config.js     # Tailwind setup (dark mode class)
│   ├── postcss.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── index.css
│       ├── App.js             # Root layout (30/70 responsive split)
│       └── components/
│           ├── Navbar.js      # Dark mode toggle
│           ├── Upload.js      # PDF uploader + progress & success state
│           ├── Chat.js        # Chat orchestration (stop button, scroll)
│           ├── ChatMessage.js # User message bubbles
│           └── AnswerCard.js  # Typewriter answer + source chunks
│
├── .gitignore                 # (root) Python + Node ignores (additions inside frontend/)
└── README.md
```

Key Runtime Directories (not committed):
- `backend/uploads/` – user PDF files
- `backend/chroma_db/` – vector store persistence
- `backend/latest_pdf.json` – pointer to last ingested PDF

## API Endpoints

### Upload PDF
```http
POST /upload-pdf/
```
Upload a PDF file for processing. The file will be:
- Text extracted
- Chunked into smaller segments
- Converted to embeddings
- Stored in ChromaDB

Request (multipart/form-data):
```
file: <PDF binary>
```
Successful Response (200):
```json
{
	"filename": "example.pdf",
	"chunks_count": 128,
	"message": "PDF processed successfully"
}
```
Common Errors:
- 400 invalid file type / empty file
- 422 parsing failure
- 500 embedding or DB storage issue

### Ask Questions
```http
POST /ask/
```
Ask questions about the uploaded PDF content. The system will:
- Find relevant text chunks using semantic search
- Generate a response using Mistral-7B model
- Return a concise, context-aware answer

Request Body (JSON):
```json
{ "question": "What is virtual memory?" }
```
Successful Response:
```json
{
	"answer": "Virtual memory is ...",
	"retrieved_chunks": [
		{ "text": "Definition of virtual memory ...", "score": 0.12 },
		{ "text": "It allows processes ...", "score": 0.19 }
	]
}
```
Error (example):
```json
{ "detail": "No PDF uploaded yet" }
```

## Environment Variables

Create `backend/.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key used to call the selected LLM (Mistral‑7B by default). |

Optional future variables (not yet implemented):
- `CHUNK_SIZE` / `CHUNK_OVERLAP` to tune splitter
- `TOP_K` to change number of retrieved chunks
- `MODEL_NAME` to swap embedding model

The `.env` file is ignored by Git; never commit secrets.

## Usage
### Run Backend
From the `backend/` directory (venv activated):
```powershell
uvicorn main:app --reload --port 8000
```
FastAPI docs: http://localhost:8000/docs

### Run Frontend
In a second terminal:
```powershell
cd frontend
npm start
```
Frontend dev server: http://localhost:3000

### (Optional) Single Command (Concurrently)
Add to `frontend/package.json` (if you install `concurrently`):
```json
"scripts": {
	"dev": "concurrently \"cd ../backend && uvicorn main:app --reload --port 8000\" \"react-scripts start\""
}
```
Then run:
```powershell
cd frontend
npm install concurrently --save-dev
npm run dev
```

### Typical Flow
1. Upload PDF via UI (or `POST /upload-pdf/` with multipart form field `file`)
2. Ask a question in chat (or `POST /ask/` with JSON `{ "question": "..." }`)
3. View answer + supporting chunks (expand details)

## Contributing
## Future Improvements (Roadmap)
- Streaming token updates (Server-Sent Events / WebSocket)
- Multi‑PDF collections & cross‑document querying
- Re-ranking layer (e.g., Cohere / cross-encoder) for higher answer quality
- PDF page / position metadata shown with each chunk
- Authentication & per-user namespace isolation
- Caching of frequent queries
- Source highlighting inside original PDF (viewer integration)
- Usage metrics dashboard (queries, latency, hit rates)
- Adjustable chunk parameters via UI

## Contributing
Contributions welcome!
1. Fork & clone
2. Create a feature branch: `feat/<short-description>`
3. Use conventional commits (`feat:`, `fix:`, `docs:` ...)
4. Add/update documentation where relevant
5. Open a Pull Request with clear description

Before submitting:
- Run backend: `uvicorn main:app --reload`
- Run frontend: `npm start`
- Smoke test upload + ask flows

## License
MIT License © 2025

---
If you build something cool on top of this (multi‑file, different models, UI extensions) feel free to open an issue and share it!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
