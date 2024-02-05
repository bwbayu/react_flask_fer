import { useCameraContext } from '../CameraContext';


const Three = () => {
    const { resultData } = useCameraContext();

    return (
        <div>
            <h1>Page Three</h1>
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
        </div>
    )
}

export default Three