from sentence_transformers import SentenceTransformer
#Load embedding model once

embedding_model=SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(chunks: list[str]) -> list[list[float]]:
    """
    Convert text chunks into vector embeddings using SentenceTransformer.
    Returns list of embeddings (each embeddings = list of floats)
    """
    
    embeddings=embedding_model.encode(chunks,convert_to_numpy=True,show_progress_bar=True)
    return embeddings