# SETUP
## flask
1. cd flask_server
2. pip install Flask opencv-python deepface numpy

## react
1. cd react_client
2. npm install react-webcam react-router-dom axios

# RUN (bikin 2 cmd, satu buat nge run flask, satu lagi buat react)
1. masuk dir flask_server
2. python server.py
3. masuk ke localhost:5000

1. masuk dir react_client
2. npm start
3. masuk ke localhost:3000

# ALUR WEB
1. Di page 1, webcam otomatis on
2. button next buat ke page 2
3. di page 2, model deepface buat facial expression detection di load
4. tiap 10 detik webcam bakal nge-capture trus imagenya dijadiin input buat ke model, buat detail tiap prediksinya bisa liat cmd dari flask atau inspect
5. button next buat ke page 3
6. di page 3, model deepfacenya dan webcamnya berhenti, nampilin result
