import os
from uuid import uuid4
from fastapi.responses import FileResponse

from fastapi import UploadFile
static_path = os.path.join(os.getcwd(), f'static\\files')

def save_file(file: UploadFile) -> str:
    _, ext = file.filename.split('.')
    filename = f'{uuid4()}.{ext}'
    location = os.path.join(static_path, filename)
    with open(location, "wb+") as file_object:
        file_object.write(file.file.read())
    return filename

def get_file(path: str) -> FileResponse:
    full_path =  os.path.join(static_path, path)
    print(full_path)
    return FileResponse(full_path)