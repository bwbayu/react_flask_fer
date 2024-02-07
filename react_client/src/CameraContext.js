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
    // isPredicting variable is used for store the state of predicting process
    const [isPredicting, setIsPredicting] = useState(false);
    // resultData variable is used for store data after predicting process
    const [resultData, setResultData] = useState(null);

    // function for change the state isPredicting to True
    const startPrediction = () => {
        setIsPredicting(true);
    };

    // function for change the state isPredicting to False
    const stopPrediction = () => {
        setIsPredicting(false);
        // also call the function for get the data from backend
        fetchResultData();
    };

    // function to get the result data from backend to be shown in frontend
    const fetchResultData = async () => {
        try {
            const response = await axios.get('/result'); // the endpoint for function
            console.log('Result data:', response.data);
            setResultData(response.data); // change the state of resultData by fill the variable with data from backend 
        } catch (error) {
            console.error('Error fetching result data:', error);
        }
    };

    // variable and function that used in component file
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