import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CameraContext = createContext();

export const useCameraContext = () => {
    const context = useContext(CameraContext);

    if (!context) {
        throw new Error("useCameraContext must be used within a CameraProvider");
    }

    return context;
};

export const CameraProvider = ({ children }) => {
    const [isPredicting, setIsPredicting] = useState(false);
    const [resultData, setResultData] = useState(null);

    const startPrediction = () => {
        setIsPredicting(true);
    };

    const stopPrediction = () => {
        setIsPredicting(false);
        fetchResultData();
    };

    const fetchResultData = async () => {
        try {
            const response = await axios.get('/result');
            console.log('Result data:', response.data);
            setResultData(response.data);
        } catch (error) {
            console.error('Error fetching result data:', error);
        }
    };

    const contextValue = {
        isPredicting,
        startPrediction,
        stopPrediction,
        resultData,
    };

    return (
        <CameraContext.Provider value={contextValue}>
            {/* Wrap children inside a function */}
            {typeof children === 'function' ? children() : children}
        </CameraContext.Provider>
    );
};



export default CameraContext;