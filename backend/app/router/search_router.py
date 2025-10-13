from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from fastapi.responses import JSONResponse
from app.utils.face_processor import extract_face_segments
from app.utils.text_processor import extract_text_segments
from app.utils.audio_processor import extract_audio_segments
import os
import shutil

router = APIRouter()

os.makedirs("videos", exist_ok=True)
os.makedirs("targets", exist_ok=True)

@router.post("/upload_videos")
async def upload_videos(files: list[UploadFile] = File(...)):
    video_paths = []
    for file in files:
        if not file.filename.endswith((".mp4", ".avi", ".mov")):
            raise HTTPException(status_code=400, detail="仅支持MP4、AVI、MOV格式")
        path = f"videos/{file.filename}"
        with open(path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        video_paths.append(path)
    return {"video_paths": video_paths}

@router.post("/search_face")
async def search_face(target_image: UploadFile = File(...), video_paths: list[str] = []):
    if not target_image.filename.endswith((".jpg", ".png")):
        raise HTTPException(status_code=400, detail="仅支持JPG、PNG格式")
    target_path = f"targets/{target_image.filename}"
    with open(target_path, "wb") as f:
        shutil.copyfileobj(target_image.file, f)
    try:
        results = extract_face_segments(video_paths, target_path)
        return JSONResponse(content=results)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/search_text")
async def search_text(query_text: str = Body(...), video_paths: list[str] = Body([])):
    if not query_text:
        raise HTTPException(status_code=400, detail="查询文字不能为空")
    results = extract_text_segments(video_paths, query_text)
    return JSONResponse(content=results)

@router.post("/search_audio")
async def search_audio(query_audio: UploadFile = File(...), video_paths: list[str] = []):
    if not query_audio.filename.endswith((".wav", ".mp3")):
        raise HTTPException(status_code=400, detail="仅支持WAV、MP3格式")
    query_path = f"targets/{query_audio.filename}"
    with open(query_path, "wb") as f:
        shutil.copyfileobj(query_audio.file, f)
    results = extract_audio_segments(video_paths, query_path)
    return JSONResponse(content=results)