from flask import Flask, request, jsonify
from deepface import DeepFace
import cv2
import numpy as np
import base64

app = Flask(__name__)

emotion_labels = {0: 'sad', 1: 'disgust', 2: 'angry', 3: 'neutral', 4: 'fear', 5: 'surprise', 6: 'happy'}
emotion_counts = {label: 0 for label in emotion_labels.values()} # stores the label count of the model output

faceDetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml') # face detect

@app.route('/process_frame', methods=['POST']) # endpoint for image/frame predict
def process_frame():
    # collect image/frame data
    data = request.json
    image_src = data.get('image')
    # convert image to numpy
    img_np = cv2.imdecode(np.frombuffer(base64.b64decode(image_src.split(',')[1]), np.uint8), cv2.IMREAD_COLOR)

    # Print the size of the input image

    # Convert image to grayscale
    print("Input image size 1:", img_np.shape)
    gray_frame = cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY)
    emotion = None
    emotion1 = None

    resized_img_np = cv2.resize(img_np, (480, 360))

    # Print the size of the input image
    print("Input image size 2:", resized_img_np.shape)

    faces = faceDetect.detectMultiScale(gray_frame, 1.1, 3)
    if len(faces) > 0:
        # Analyze emotions using DeepFace
        result = DeepFace.analyze(resized_img_np, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion'] # get the dominant emotion from an image/frame
        print("EMOTION = " + emotion)
        result1 = DeepFace.analyze(img_np, actions=['emotion'], enforce_detection=False)
        emotion1 = result1[0]['dominant_emotion']
        emotion_counts[emotion] += 1 # iterate for emotion label
    

    return jsonify({'status': 'success', 'emotion':emotion, 'emotion_big': emotion1})

@app.route('/result') # endpoint for show the final result of user emotion
def result():
    global emotion_counts
    total_frames = sum(emotion_counts.values()) # sum the total label that already store in emotion_counts during predicting process
    percentage_distribution = {label: count / total_frames * 100 for label, count in emotion_counts.items()} # calculate the percentage of each label
    
    temp = emotion_counts
    # reset the count for each label
    emotion_counts = {label: 0 for label in emotion_labels.values()}

    return jsonify({'status':'success', 'percentage_distribution':percentage_distribution, 'emotion_counts':temp})

@app.route('/') # endpoint for index
def index():
    return "reload complete"

if __name__ == '__main__':
    app.run(debug=True)
