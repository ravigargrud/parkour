from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
from ultralytics import YOLO
import cvzone
import io

router = APIRouter(
    prefix="/ml",
    tags=["ML"]
)

# Load your YOLO model (change path to your model)
model = YOLO("weights/best.pt")

classNames = ['empty', 'occupied']  # Your class names for parking spots

def process_image(image_bytes):
    # Decode the image
    image_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
    # Pass image to YOLO model for detection
    results = model(img)
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            w, h = x2 - x1, y2 - y1
            cvzone.cornerRect(img, (x1, y1, w, h), 20, 1)  # Draw rectangle with rounded corners
            cvzone.putTextRect(img, classNames[int(box.cls[0])], (x1, y1), scale=1.5, thickness=2)  # Add class label
    
    # Encode the processed image back to JPEG format
    _, encoded_img = cv2.imencode('.jpg', img)
    return encoded_img.tobytes()

@router.post("/process-image/")
async def process_image_endpoint(file: UploadFile = File(...)):
    # Read file contents
    contents = await file.read()

    # Process the image with YOLO
    processed_image = process_image(contents)
    
    # Stream the processed image back as a response
    return StreamingResponse(io.BytesIO(processed_image), media_type="image/jpeg")