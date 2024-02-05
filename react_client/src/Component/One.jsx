import { useNavigate } from "react-router-dom";
import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { useCameraContext } from '../CameraContext';

const One = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const { startPrediction } = useCameraContext();

    const videoConstraints = {
        width: 480,
        height: 360,
        facingMode: 'environment'
    };

    const handleClick = () => {
        // ganti state prediction ke true
        startPrediction();
        // pindah ke page 2
        navigate('/page-two');
    }

    return (
        <div>
            <h1>Page One</h1>
            <br></br>
            <Webcam audio={false}
                videoConstraints={videoConstraints}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
            />
            <br></br>
            <button onClick={handleClick}>Next</button>
        </div>
    )
}

export default One