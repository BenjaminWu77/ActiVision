import cv2
import mediapipe as mp
import time
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

def distanceCalculate (x, y):
    dist = ((y[0] - x[0])**2 + (y[1] - x[1])**2)**0.5
    return dist

mp_pose = mp.solutions.pose

pushUpCounter = 0

#hand capture code
base_options = python.BaseOptions(model_asset_path='hand_landmerker.task')
options1 = vision.HandLandmarkOptions(base_options=base_options, num_hands=2)

detector = vision.HandLandmarker.create_from_options(options1)

image1 = mp.Image.create_from_file({input image here})

result1 = detector.detect(image1)

drawn_image = draw_landmarks_on_image(image1.numpy_view(), result1)
cv2_imshow(cv2.cvColor(drawn_image, cv2.COLOR_RGB2BGR))


baseOptions = python.BaseOptions(model_asset_path='pose_landmarker.task')
options2 = vision.PoseLandmarkerOptions(baseOptions=base_options, output_segmentation_masks=True)
detector = vision.PoseLandmarker.create_from_options(options2)

image2 = mp.Image.create_from_file({input image here})

result2 = detector.detect(image2)

landmark_image = draw_landmarks_on_image(image2.numpy_view(), result2)
cv2_imshow(cv2.cvtColor(landmark_image, cv2.COLOR_RGB2BGR))

#video capture code
vid = cv2.VideoCapture(0)

frame_width = int(cam.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cam.get(cv2.CAP_PROP_FRAME_HEIGHT))

out = cv2.VIdeoWriter({output video here}, cv2.VideoWriter_fourcc({VIDEO HERE}), 20, (frame_width, frame_height))
while True:
    ret, frame = cam.read()
    out.write(frame)
    cv2.imshow('Camera', frame)
    if cv2.waitKey(1) == ord('q'):
        break

cam.release()
out.release()
cv2.destroyAllWindows()

#track main body parts
leftHand = result.multi_handedness[0].classification[0].label
rightHand = result.multi_handedness[1].classification[0].label
leftShoulder = result.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
rightShoulder = result.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]

#push up counter
down = False
if distanceCalculate(rightShoulder, rightHand) <130:
    down = True
elif down and distanceCalculate(rightShoulder, rightHand) > 250:
    down = False
    pushUpCounter += 1