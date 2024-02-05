import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam';
import { useCameraContext } from '../CameraContext';
import React, { useRef, useEffect } from "react";
import axios from 'axios';

const Two = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const { isPredicting, stopPrediction } = useCameraContext();

    const videoConstraints = {
        width: 480,
        height: 360,
        facingMode: 'environment'
    };

    const sendImageToBackend = async (imageSrc) => {
        try {
            const response = await axios.post(
                'process_frame',
                {
                    image: imageSrc,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Backend response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending image to backend:', error);
        }
    };


    const handleClick = () => {
        // ganti state prediction ke false
        stopPrediction();
        // pindah ke page 2
        navigate('/page-three');
    }


    useEffect(() => {
        let intervalId;
        const captureAndSendImage = () => {
            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc);
            if (imageSrc) {
                sendImageToBackend(imageSrc);
            }
        };


        if (isPredicting) {
            intervalId = setInterval(captureAndSendImage, 10000); // 5 detik
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isPredicting]);

    return (
        <div>
            <h1>Page Two</h1>
            <br></br>
            <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                screenshotFormat='image/jpeg'
            />
            <br></br>
            <button onClick={handleClick}>Next</button>
        </div>
    )
}

export default Two;