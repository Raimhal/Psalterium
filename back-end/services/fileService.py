import os
from uuid import uuid4
from fastapi.responses import FileResponse

from fastapi import UploadFile
static_files_path = os.path.join(os.getcwd(), 'static\\files')
static_assets_path = os.path.join(os.getcwd(), 'static\\assets')

def save_file(file: UploadFile) -> str:
    _, ext = file.filename.split('.')
    filename = f'{uuid4()}.{ext}'
    location = os.path.join(static_files_path, filename)
    with open(location, "wb+") as file_object:
        file_object.write(file.file.read())
    return filename

def get_file(path: str) -> FileResponse:
    if path == 'default.png':
        full_path = get_full_path(static=static_assets_path, path=path)
    else:
        full_path = get_full_path(static=static_files_path, path=path)
    return FileResponse(full_path)

def delete_file(path: str):
    full_path = get_full_path(static=static_files_path,path=path)
    if os.path.exists(full_path):
        os.remove(full_path)


def get_full_path(static: str, path: str):
    return os.path.join(static, path)
