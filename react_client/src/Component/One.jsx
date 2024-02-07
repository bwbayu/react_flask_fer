import { useNavigate } from "react-router-dom";
import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { useCameraContext } from '../CameraContext';

const One = () => {
    const navigate = useNavigate(); // for navigate to next page
    const webcamRef = useRef(null); // webcam
    const { startPrediction } = useCameraContext(); // get startPrediction function from cameracontext

    // define the video window
    const videoConstraints = {
        width: 480,
        height: 360,
        facingMode: 'environment'
    };

    // function when the next button is clicked
    const handleClick = () => {
        // run the startPrediction function -> this function will change the state of isPrediction variable to True
        startPrediction();
        // move to page two
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