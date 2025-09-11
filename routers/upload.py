from fastapi import APIRouter, UploadFile, File,HTTPException
import os
from utils.pdf_utils import extract_text_from_pdf
from utils.text_utils import chunk_text
from utils.embeddings import create_embeddings
from utils.sanitize import sanitize_pdf
from utils.latest_pdf import set_latest_pdf
from dBase.database import add_chunks_to_db, get_chroma_collection
router = APIRouter()

#Folder to temporarily store the pdf
UPLOAD_DIR="uploads"
os.makedirs(UPLOAD_DIR,exist_ok=True)

@router.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400,detail="Upload only pdf other extensions are not supported as of now")
    file_path=os.path.join(UPLOAD_DIR,file.filename)
    
    #save uploaded pdf locally
    with open(file_path,"wb") as f:
        f.write(await file.read())
    collection_name=sanitize_pdf(file.filename)
    collection=get_chroma_collection(collection_name)
    text = extract_text_from_pdf(file_path)
    if not text:
        raise HTTPException(status_code=400,msg="Could not extract text")
    
    chunks=chunk_text(text)
    
    embeddings=create_embeddings(chunks)
    add_chunks_to_db(collection,chunks,embeddings,source_name=file.filename)
    set_latest_pdf(file.filename)
    return {
        "filename":file.filename,
        "msg":"PDF uploaded successfully",
        "msg":f"PDF processed successfully, {len(chunks)} chunks embedded and stored in DB",
        "chunks_count":len(chunks)
        }

