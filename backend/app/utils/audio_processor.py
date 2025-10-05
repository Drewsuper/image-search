import whisper
import torch
from moviepy.editor import VideoFileClip
from sentence_transformers import SentenceTransformer
import numpy as np


whisper_model = whisper.load_model("base")
text_model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_audio_segments(video_paths, query_audio_path, similarity_threshold=0.7, min_length=30):
    
    
    query_result = whisper_model.transcribe(query_audio_path)
    query_text = query_result["text"]
    query_embedding = text_model.encode(query_text, convert_to_tensor=True)
    results = {}

    for video_path in video_paths:
        
        video = VideoFileClip(video_path)
        audio_path = "temp_audio.wav"
        video.audio.write_audiofile(audio_path)
        video.close()

        
        audio_result = whisper_model.transcribe(audio_path, word_timestamps=True)
        segments = audio_result["segments"]
        matched_segments = []
        current_segment = None

        for seg in segments:
            seg_text = seg["text"]
            if seg_text:
                seg_embedding = text_model.encode(seg_text, convert_to_tensor=True)
                similarity = torch.nn.functional.cosine_similarity(query_embedding, seg_embedding, dim=0).item()
                if similarity > similarity_threshold:
                    start_time = seg["start"]
                    end_time = seg["end"]
                    if current_segment is None:
                        current_segment = [start_time, end_time]
                    else:
                        current_segment[1] = end_time
                else:
                    if current_segment:
                        matched_segments.append(current_segment)
                        current_segment = None

        if current_segment:
            matched_segments.append(current_segment)

        
        matched_segments = [(start, end) for start, end in matched_segments if end - start >= min_length]
        if matched_segments:
            results[video_path] = matched_segments

    return results