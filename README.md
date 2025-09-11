# RAG-FastAPI: PDF Question Answering System

A Retrieval-Augmented Generation (RAG) system built with FastAPI and ChromaDB that allows users to upload PDFs and ask questions about their content.

## Features

- 📄 PDF Upload and Text Extraction
- 📚 Text Chunking and Embedding Generation
- 🔍 Semantic Search using ChromaDB
- 🤖 Question Answering using Mistral-7B
- ⚡ Fast API Endpoints
- 🔒 Secure Environment Variable Management

## Tech Stack

- **FastAPI**: Web framework for building APIs
- **ChromaDB**: Vector database for storing and searching embeddings
- **Sentence-Transformers**: For generating text embeddings
- **PyPDF2**: PDF text extraction
- **Langchain Text Splitters**: Text chunking
- **OpenRouter API**: Access to Mistral-7B model
- **Python-dotenv**: Environment variable management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Savyasachi-2005/RAG-FastAPI.git
cd RAG-FastAPI
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file and add your OpenRouter API key:
```
OPENROUTER_API_KEY=your_api_key_here
```

## Project Structure

```
RAG-FastAPI/
├── dBase/
│   └── database.py          # ChromaDB configuration and operations
├── routers/
│   ├── query.py            # Question answering endpoint
│   └── upload.py           # PDF upload endpoint
├── utils/
│   ├── embeddings.py       # Text embedding generation
│   ├── latest_pdf.py       # PDF file management
│   ├── pdf_utils.py        # PDF text extraction
│   ├── sanitize.py         # Filename sanitization
│   └── text_utils.py       # Text chunking utilities
├── main.py                 # FastAPI application setup
├── config.py               # Configuration settings
└── requirements.txt        # Project dependencies
```

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

### Ask Questions
```http
POST /ask/
```
Ask questions about the uploaded PDF content. The system will:
- Find relevant text chunks using semantic search
- Generate a response using Mistral-7B model
- Return a concise, context-aware answer

## Environment Variables

- `OPENROUTER_API_KEY`: Your OpenRouter API key for accessing Mistral-7B

## Usage

1. Start the server:
```bash
uvicorn main:app --reload
```

2. Upload a PDF using the `/upload-pdf/` endpoint
3. Ask questions about the PDF content using the `/ask/` endpoint

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
