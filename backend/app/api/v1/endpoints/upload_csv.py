# api/v1/endpoints/import_csv.py
#SHOULD LOAD A DATABASE
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import csv
from io import StringIO

router = APIRouter()


class CSVService:
    def __init__(self):
        pass  # we can add db connection to here

    def process_csv(self, contents: bytes):
        decoded = contents.decode("utf-8")
        csv_reader = csv.DictReader(StringIO(decoded))

        data = []
        for row in csv_reader:
            data.append(row)
        
        return data


def get_csv_service():
    return CSVService()


@router.post("/upload-csv/")
async def upload_csv(
    file: UploadFile = File(...),
    service: CSVService = Depends(get_csv_service)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    contents = await file.read()
    data = service.process_csv(contents)

    return {"message": "CSV uploaded successfully", "rows": len(data)}

@router.get("/upload-csv/")
async def get_csv_data():
    if not csv_data_store:
        raise HTTPException(status_code=404, detail="No CSV data found.")

    return {"rows": len(csv_data_store), "data": csv_data_store}