import json
from fastapi import HTTPException

latest_pdf_file="latest_pdf.json"

def set_latest_pdf(pdf_name:str):
    """
    Save the name of the latest uploaded PDF to a JSON file.
    """
    with open(latest_pdf_file,"w") as f:
        json.dump({"pdf_name":pdf_name},f)

def get_latest_pdf() ->str:
    """
    Retrieve the latest uploaded PDF name.
    Raises HTTPException if no PDF has been uploaded yet.
    """
    try:
        with open(latest_pdf_file,"r") as f:
            data=json.load(f)
            return data["pdf_name"]
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="No PDF has been uploaded yet.")