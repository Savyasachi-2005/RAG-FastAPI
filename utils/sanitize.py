import re

def sanitize_pdf(filename: str) -> str:
    
    name=filename.rsplit(".",1)[0]
    name=name.replace(" ","_")
    name = re.sub(r"[^a-zA-Z0-9._-]","",name)
    name = re.sub(r"^[._-]+","",name)
    name=re.sub(r"[._-]+$","",name)
    if len(name)<3:
        name = "default_collection_"+name if name else "default_collection"
    return name