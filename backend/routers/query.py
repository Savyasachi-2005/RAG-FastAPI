from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.embeddings import embedding_model
from utils.latest_pdf import get_latest_pdf
from utils.sanitize import sanitize_pdf
from dBase.database import search_db,get_chroma_collection
import requests
import os
from dotenv import load_dotenv
router = APIRouter()
load_dotenv()
OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY not found in env")

HEADERS = {
    "Authorization":f"Bearer {OPENROUTER_API_KEY}",
    "HTTP-Referer":"http://localhost:8000",
    "X-Title" : "FastAPI PDF RAG APP"
}

class QueryRequest(BaseModel):
    question:str

import json


@router.post("/ask/")
async def ask_question(request: QueryRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400,detail="Question can't be empty")
    query_embedding=embedding_model.encode([request.question],convert_to_numpy=True)[0]
    pdf_name=get_latest_pdf()
    if not pdf_name:
        return {"ans":"No PDF has been uploaded yet."}
    sanitized_name=sanitize_pdf(pdf_name)
    collection=get_chroma_collection(sanitized_name)
    res=search_db(collection,query_embedding,top_k=3)
    
    if not res["documents"]:
        return {"ans":"No relevent info found in db. please upload pdf first"}
    
    retrived_chunks=res["documents"][0]
    context = "\n\n".join(retrived_chunks)
    
    prompt = f"""
        You are a helpful assistant specialized in analyzing PDF documents.

        Your task:
        1. Read the provided context (extracted from a PDF).
        2. Answer the user’s question based only on this context.
        3. If the context does not contain the answer, explicitly reply: "I don’t know based on the provided document."
        4. Keep the answer **concise** (2–4 sentences), unless the question explicitly asks for details.

        Question:
        {request.question}

        Context (from PDF):
        {context}
        Answer:
        """
    try:
        response=requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=HEADERS,
            json={
                "model":"mistralai/mistral-7b-instruct:free",
                "messages":[{"role":"user","content":prompt}],
                },
                timeout=30
        )
        response.raise_for_status()
        result=response.json()
        answer=result["choices"][0]["message"]["content"]
        return {"answer":answer,"retrieved_chunks":retrived_chunks}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503,detail=f"Error calling LLM: {e}")
