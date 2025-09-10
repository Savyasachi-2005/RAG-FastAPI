from fastapi import FastAPI
from routers.upload import router as pdf_upload
from routers.query import router as query
app=FastAPI(
    title="RAG API with ChromaDB"
)

app.include_router(pdf_upload,tags=["UPLOAD PDF"])
app.include_router(query,tags=["ASK QUERY"])
