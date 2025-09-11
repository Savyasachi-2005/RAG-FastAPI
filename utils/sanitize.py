import re

def sanitize_pdf(filename: str) -> str:
    
    name=filename.rsplit(".",1)[0]
    name=name.replace(" ","_")
    name = re.sub(r"[*a-zA-Z0-9._-]","",name)
    if not name:
        name = "default_collection"
    return name