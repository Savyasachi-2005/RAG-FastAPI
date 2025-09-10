from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path: str)->str:
    """
    Reads a pdf file and extracts its text content
    """
    reader=PdfReader(file_path)
    text=""
    for page in reader.pages:
        text+=page.extract_text() or "" # handle pages with no extractable text
    return text.strip()