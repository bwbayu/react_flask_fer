import io
from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
from PIL import Image
from io import BytesIO
from transformers import pipeline

app = Flask(__name__)

emotion_labels = {0: 'sad', 1: 'disgust', 2: 'angry', 3: 'neutral', 4: 'fear', 5: 'surprise', 6: 'happy'}
emotion_counts = {label: 0 for label in emotion_labels.values()}  # stores the label count of the model output

faceDetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')  # face detect

# Load the Hugging Face Transformers model
pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

@app.route('/process_frame', methods=['POST'])  # endpoint for image/frame predict
def process_frame():
    data = request.json
    image_src = data.get('image')

    # Decode the Base64 string into binary data
    base64_data = image_src.split(',')[1]
    binary_data = io.BytesIO(base64.b64decode(base64_data))
    # Load the image using PIL
    image = Image.open(binary_data)

    # Resize and normalize the image
    resized_image = image.resize((480, 360))

    emotion = None

    img_np = np.array(resized_image)
    faces = faceDetect.detectMultiScale(cv2.cvtColor(img_np, cv2.COLOR_BGR2GRAY), 1.3, 3)
    if len(faces) > 0:
        # Analyze emotions using your Hugging Face Transformers model
        print("ada muka")
        predictions = pipe(resized_image)[0]
        emotion = predictions['label']
        if emotion in emotion_labels.values():
            print("EMOTION = " + emotion)
            emotion_counts[emotion] += 1  # iterate for emotion label

    return jsonify({'status': 'success', 'emotion':emotion})

@app.route('/result')  # endpoint for show the final result of user emotion
def result():
    global emotion_counts
    total_frames = sum(emotion_counts.values())  # sum the total label that already store in emotion_counts during predicting process
    if total_frames != 0:
        percentage_distribution = {label: count / total_frames * 100 for label, count in
                               emotion_counts.items()}  # calculate the percentage of each label
    else:
        percentage_distribution = {label: "0%" for label in emotion_counts}

    temp = emotion_counts
    # reset the count for each label
    emotion_counts = {label: 0 for label in emotion_labels.values()}

    return jsonify({'status': 'success', 'percentage_distribution': percentage_distribution, 'emotion_counts': temp})

@app.route('/')  # endpoint for index
def index():
    return "reload complete"

if __name__ == '__main__':
    app.run(debug=True)
