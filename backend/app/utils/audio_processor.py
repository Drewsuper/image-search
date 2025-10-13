import whisper
import torch
from moviepy.editor import VideoFileClip
from sentence_transformers import SentenceTransformer
import numpy as np
import os

whisper_model = whisper.load_model("base")
text_model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_audio_segments(video_paths, query_audio_path, similarity_threshold=0.7, min_length=30):
    # 转录查询音频
    print(f"Transcribing query audio: {query_audio_path}")
    query_result = whisper_model.transcribe(query_audio_path)
    query_text = query_result["text"]
    query_embedding = text_model.encode(query_text, convert_to_tensor=True)
    results = {}

    for video_path in video_paths:
        print(f"Processing video: {video_path}")  # 调试日志
        if not isinstance(video_path, str):  # 确保 video_path 是字符串
            print(f"Invalid video_path type: {type(video_path)}, value: {video_path}")
            continue
        if not os.path.exists(video_path):
            print(f"Video file not found: {video_path}")
            continue
        
        try:
            video = VideoFileClip(video_path)
            audio_path = "temp_audio.wav"
            video.audio.write_audiofile(audio_path)
            video.close()

            # 转录视频音频
            print(f"Transcribing video audio: {audio_path}")
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

            # 过滤短片段
            matched_segments = [(start, end) for start, end in matched_segments if end - start >= min_length]
            if matched_segments:
                results[video_path] = matched_segments
            os.remove(audio_path)  # 清理临时文件
        except Exception as e:
            print(f"Error processing {video_path}: {e}")
            continue

    return results