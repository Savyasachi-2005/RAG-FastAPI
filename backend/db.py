import chromadb
from chromadb.config import Settings

# Initialise and return a Chroma client

def get_chroma_client():
    client=chromadb.Client(
        Settings(
            persist_dir="./chroma_db",
            anonymzed_telemetry=False
        )
    )
    return client