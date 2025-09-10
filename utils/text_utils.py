from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_text(text:str,chunk_size:int = 500,chunk_overlap:int=50):
    """
    Split text into smaller chunks for embeddings.
    *chunk_size:max char per chunk
    *chunk_overlap:overlap between chunks to preserve context
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len
    )
    chunks=splitter.split_text(text)
    return chunks