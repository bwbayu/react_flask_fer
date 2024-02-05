import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from 'axios';

const videoConstraints = {
    width: 480,
    height: 360,
    facingMode: 'environment'
};

const Camera = () => {
    const webcamRef = useRef(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [resultData, setResultData] = useState(null);

    const startPrediction = useCallback(() => {
        setIsPredicting(true);
    }, []);

    const stopPrediction = useCallback(() => {
        setIsPredicting(false);
        fetchResultData();
    }, []);

    const sendImageToBackend = async (imageSrc) => {
        try {
            const response = await axios.post('process_frame', {
                image: imageSrc,
            });
            console.log('Backend response:', response.data);
        } catch (error) {
            console.error('Error sending image to backend:', error);
        }
    };

    const fetchResultData = async () => {
        try {
            const response = await axios.get('result');
            console.log('Result data:', response.data);
            setResultData(response.data);
        } catch (error) {
            console.error('Error fetching result data:', error);
        }
    };

    useEffect(() => {
        let intervalId;

        if (isPredicting) {
            intervalId = setInterval(() => {
                const imageSrc = webcamRef.current.getScreenshot();
                sendImageToBackend(imageSrc);
            }, 5000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isPredicting]);

    return (
        <>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            />
            <button onClick={startPrediction}>Start Prediction</button>
            <button onClick={stopPrediction}>Stop Prediction</button>
            {resultData && (
                <div>
                    <p>Count Result Data:</p>
                    <ul>
                        {Object.entries(resultData.emotion_counts).map(([label, count]) => (
                            <li key={label}>
                                {label}: {count}
                            </li>
                        ))}
                    </ul>
                    <p>Percentage Result Data:</p>
                    <ul>
                        {Object.entries(resultData.percentage_distribution).map(([label, percentage]) => (
                            <li key={label}>
                                {label}: {percentage.toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Camera;
