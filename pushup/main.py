import cv2
import mediapipe as md
import time

md_drawing = md.solutions.drawing_utils
md_drawing_styles = md.solutions.drawing_styles
md_pose = md.solutions.pose

count = 0
position = None

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

# Prompt the user to choose exercise type
exercise_type = int(input("Enter 0 for push-ups or 1 for sit-ups: "))

# Prompt the user to enter the duration in seconds
duration = int(input("Enter the duration in seconds: "))

# Create a named window
cv2.namedWindow("exercise counter", cv2.WINDOW_NORMAL)
# Set the window to be always on top
cv2.setWindowProperty("exercise counter", cv2.WND_PROP_TOPMOST, 1)
# Set the window to fullscreen
cv2.setWindowProperty("exercise counter", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

# Display a 5-second countdown timer
for i in range(5, 0, -1):
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        exit()
    frame_bgr = cv2.flip(frame, 1)
    h, w, _ = frame_bgr.shape
    cv2.putText(frame_bgr, f'Starting in {i}', (w // 2 - 100, h // 2), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 4, cv2.LINE_AA)
    cv2.imshow("exercise counter", frame_bgr)
    cv2.waitKey(1000)

start_time = time.time()

with md_pose.Pose(
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7) as pose:
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print('empty camera')
            break

        image_rgb = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        result = pose.process(image_rgb)

        imlist = []

        if result.pose_landmarks:
            md_drawing.draw_landmarks(
                image_rgb, result.pose_landmarks, md_pose.POSE_CONNECTIONS)
            for id, im in enumerate(result.pose_landmarks.landmark):
                h, w, _ = image_rgb.shape
                X, Y = int(im.x * w), int(im.y * h)
                imlist.append([id, X, Y])
        
        if len(imlist) != 0:
            if exercise_type == 0:  # Push-ups
                if ((imlist[12][2] - imlist[14][2]) >= 15 and (imlist[11][2] - imlist[13][2]) >= 15):
                    position = 'down'
                if ((imlist[12][2] - imlist[14][2]) <= 5 and (imlist[11][2] - imlist[13][2]) <= 5) and position == "down":
                    position = "up"
                    count += 1
                    print(count)
            elif exercise_type == 1:  # Sit-ups
                if ((imlist[24][2] - imlist[26][2]) >= 15 and (imlist[23][2] - imlist[25][2]) >= 15):
                    position = 'down'
                if ((imlist[24][2] - imlist[26][2]) <= 5 and (imlist[23][2] - imlist[25][2]) <= 5) and position == "down":
                    position = "up"
                    count += 1
                    print(count)

        # Calculate elapsed time
        elapsed_time = int(time.time() - start_time)
        remaining_time = duration - elapsed_time

        # Convert image to BGR for display
        image_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        # Overlay timer on the image (top left)
        cv2.putText(image_bgr, f'Time: {remaining_time}s', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        # Overlay exercise count on the image (top right)
        text_size = cv2.getTextSize(f'Count: {count}', cv2.FONT_HERSHEY_SIMPLEX, 1, 2)[0]
        text_x = image_bgr.shape[1] - text_size[0] - 10
        cv2.putText(image_bgr, f'Count: {count}', (text_x, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        cv2.imshow("exercise counter", image_bgr)
        key = cv2.waitKey(1)
        
        # Check if the specified duration has passed
        if elapsed_time >= duration:
            print("Time's up!")
            break

cap.release()
cv2.destroyAllWindows()