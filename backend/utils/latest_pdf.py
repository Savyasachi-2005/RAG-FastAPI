import json
from fastapi import HTTPException
import os

latest_pdf_file=os.path.join(os.path.dirname(os.path.dirname(__file__)),"latest_pdf.json")

def set_latest_pdf(pdf_name:str):
    """
    Save the name of the latest uploaded PDF to a JSON file.
    """
    try:
        with open(latest_pdf_file,"w") as f:
            json.dump({"pdf_name":pdf_name},f)
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"could not save PDF name : {str(e)}")

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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF name: {str(e)}")