import chromadb
from chromadb.utils import embedding_functions

chorma_client=chromadb.PersistentClient(path="chroma_db")

collection = chorma_client.get_or_create_collection(name="pdf_chunks")

def add_chunks_to_db(collection,chunks:list[str],embeddings:list[list[float]],source_name: str):
    """
    Store chunks with embeddings inside the chromadb
    Each chunk is stored with an ID, text,and its embedding......
    """
    
    ids=[f"chunk_{i}" for i in range(len(chunks))]
    
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
        metadatas=[{"source": source_name}] * len(chunks),
    )
    
def search_db(collection,query_embedding:list[float],top_k:int =3):
    """
    search for the most relevent chunks given  query embedding 
    returns top_k chunks 
    """
    
    res=collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return res

def get_chroma_collection(pdf_name : str):
    return chorma_client.get_or_create_collection(name=pdf_name)