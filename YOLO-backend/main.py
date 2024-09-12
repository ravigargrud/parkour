from ultralytics import YOLO
import cv2

# cap = cv2.VideoCapture(0)
# cap.set(3, 640)
# cap.set(4, 480)

cap = cv2.VideoCapture("Training-Data/1.mp4")

model = YOLO("Yolo-Weights/psd.pt")

classNames = ['empty', 'occupied']
