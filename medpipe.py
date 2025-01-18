import cv2
import mediapipe as mp
import time
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

base_options = python.BaseOptions(model_asset_path='hand_landmerker.task')
options = vision.HandLandmarkOptions(base_options=base_options, num_hands=2)

detector = vision.HandLandmarker.create_from_options(options)

image = mp.Image.create_from_file({input image here})

result = detector.detect(image)

drawn_image = draw_landmarks_on_image(image.numpy_view(), detection_result)
cv2_imshow(cv2.cvColor(drawn_image, cv2.COLOR_RGB2BGR))
