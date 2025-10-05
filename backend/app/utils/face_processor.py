import torch
import cv2
import numpy as np
from ultralytics import YOLO
from torchvision import transforms
from app.models.mobilefacenet import MobileFaceNet


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
yolo_model = YOLO("yolov8n-face-lindevs.pt")
face_model = MobileFaceNet().to(device)
face_model = torch.jit.load("save_model/mobilefacenet.pth", map_location=device)
face_model.eval()


transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((112, 112)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])


def load_target_face(target_image_path):
    
    target_image = cv2.imread(target_image_path)
    faces_detected = yolo_model.predict(target_image, imgsz=640, conf=0.5, verbose=False)

    if len(faces_detected[0].boxes) == 0:
        raise ValueError("未检测到目标人脸")

    x1, y1, x2, y2 = map(int, faces_detected[0].boxes.xyxy[0].cpu().numpy())
    face_crop = target_image[y1:y2, x1:x2]

    with torch.no_grad():
        face_tensor = transform(face_crop).unsqueeze(0).to(device)
        target_embedding = face_model(face_tensor).cpu().numpy()

    return target_embedding


def extract_face_segments(video_paths, target_image_path, threshold=0.5, min_length=30, batch_size=16):
    
    target_embedding = load_target_face(target_image_path)
    results = {}

    for video_path in video_paths:
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = 0
        matched_segments = []
        current_segment = None
        frames_buffer = []
        frame_indices = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frames_buffer.append(frame)
            frame_indices.append(frame_count)

            if len(frames_buffer) == batch_size:
                faces_detected = yolo_model.predict(frames_buffer, imgsz=640, conf=0.5, verbose=False)

                for i, result in enumerate(faces_detected):
                    boxes = result.boxes.xyxy.cpu().numpy()
                    matched = False
                    for box in boxes:
                        x1, y1, x2, y2 = map(int, box[:4])
                        face_crop = frames_buffer[i][y1:y2, x1:x2]
                        if face_crop.shape[0] > 0 and face_crop.shape[1] > 0:
                            with torch.no_grad():
                                face_tensor = transform(face_crop).unsqueeze(0).to(device)
                                embedding = face_model(face_tensor).cpu().numpy()
                            distance = np.linalg.norm(embedding - target_embedding)
                            if distance < threshold:
                                matched = True
                                break
                    if matched:
                        if current_segment is None:
                            current_segment = [frame_indices[i], frame_indices[i]]
                        else:
                            current_segment[1] = frame_indices[i]
                    else:
                        if current_segment:
                            matched_segments.append(current_segment)
                            current_segment = None
                frames_buffer.clear()
                frame_indices.clear()
            frame_count += 1

        if current_segment:
            matched_segments.append(current_segment)
        cap.release()

       
        matched_segments = [(start / fps, end / fps) for start, end in matched_segments if end - start >= min_length]
        if matched_segments:
            results[video_path] = matched_segments

    return results