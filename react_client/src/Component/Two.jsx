import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam';
import { useCameraContext } from '../CameraContext';
import React, { useRef, useEffect } from "react";
import axios from 'axios';

const Two = () => {
    const navigate = useNavigate(); // for navigate to next page
    const webcamRef = useRef(null); // webcam
    // get isPredicting variable to be used for activate the prediction process
    // get the stopPrediction function to be used for change the state when we go to the next page
    const { isPredicting, stopPrediction } = useCameraContext();

    // define the video window
    const videoConstraints = {
        width: 1,
        height: 1,
        facingMode: 'environment'
    };

    // function for send image/frame to function in backend for predicting image emotion
    const sendImageToBackend = async (imageSrc) => {
        try {
            const response = await axios.post(
                'process_frame', // the endpoint for function
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

    // function when the next button is clicked
    const handleClick = () => {
        // run the stopPrediction function -> this function will change the state of isPrediction variable to False
        stopPrediction();
        // move to page three
        navigate('/page-three');
    }

    // this function will automate run when this page is rendered
    useEffect(() => {
        let intervalId;
        // function for get the current frame and call the function for send that frame to backend
        const captureAndSendImage = () => {
            const imageSrc = webcamRef.current.getScreenshot({ width: 1920, height: 1080 }); // get the current frame based on webcam
            // console.log(imageSrc);
            if (imageSrc) { // error handling when image is empty
                sendImageToBackend(imageSrc);
            }
        };

        // when the state of isPredicting is True, then this function will always run
        if (isPredicting) {
            intervalId = setInterval(captureAndSendImage, 5000); // capture frame for every 10 seconds
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