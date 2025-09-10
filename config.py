import os
import getpass

# --- OpenRouter API key ---

OPENROUTER_API_KEY = ps.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    print("openrouter api is not found in env")
    OPENROUTER_API_KEY=getpass.getpass("Please enter your openrouter API key")
# -- API request Headers --
HEADERS ={
    "Authorization":f"Bearer {OPENROUTER_API_KEY}",
    "HTTP-Referer": "http://localhost:8000",
    "X-Title":"FastAPI PDF RAG App"
}

CHROMA_DB_PATH="./chroma_db"