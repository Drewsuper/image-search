import cv2
import easyocr
import numpy as np
from sentence_transformers import SentenceTransformer
import torch


reader = easyocr.Reader(['en', 'ch_sim'], gpu=torch.cuda.is_available())
text_model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_text_segments(video_paths, query_text, similarity_threshold=0.7, min_length=30, sample_rate=5):
   
    query_embedding = text_model.encode(query_text, convert_to_tensor=True)
    results = {}

    for video_path in video_paths:
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = 0
        matched_segments = []
        current_segment = None
        frame_interval = int(fps * sample_rate)  

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            if frame_count % frame_interval == 0:
                
                ocr_results = reader.readtext(frame, detail=0)
                frame_text = " ".join(ocr_results)
                if frame_text:
                    frame_embedding = text_model.encode(frame_text, convert_to_tensor=True)
                    similarity = torch.nn.functional.cosine_similarity(query_embedding, frame_embedding, dim=0).item()
                    if similarity > similarity_threshold:
                        if current_segment is None:
                            current_segment = [frame_count, frame_count]
                        else:
                            current_segment[1] = frame_count
                    else:
                        if current_segment:
                            matched_segments.append(current_segment)
                            current_segment = None
            frame_count += 1

        if current_segment:
            matched_segments.append(current_segment)
        cap.release()

       
        matched_segments = [(start / fps, end / fps) for start, end in matched_segments if end - start >= min_length]
        if matched_segments:
            results[video_path] = matched_segments

    return results