# main.py (Backend)
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLOv8 model
model = YOLO("yolov8s.pt")

@app.post("/detect")
async def detect_phone(file: UploadFile = File(...)):
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data)).convert("RGB")

    results = model(image)
    detections = []
    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0].item())
            label = model.names[cls]
            conf = float(box.conf[0].item())
            if label == "cell phone" and conf > 0.3:
                xyxy = box.xyxy[0].tolist()
                detections.append({
                    "label": label,
                    "confidence": conf,
                    "bbox": xyxy
                })
    return {"detections": detections}
