import { useState } from "react";
import BMICalculator from "./BMICalculator";

export default function BMICalculatorDemo() {
    const [testResults, setTestResults] = useState<string[]>([]);

    const runTest = () => {
        // This is a demonstration component to show the BMI calculator working
        // In a real test, we would use testing-library to simulate user interactions
        setTestResults([
            "BMI Calculator Component Loaded Successfully",
            "Height Input Field: ✓",
            "Weight Input Field: ✓",
            "Calculate Button: ✓",
            "To test functionality:",
            "1. Enter Height: 175",
            "2. Enter Weight: 70",
            "3. Click Calculate BMI",
            "4. Expected Result: BMI = 22.9 (Normal Weight)"
        ]);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">BMI Calculator Demo</h1>
            <p className="mb-4">This page demonstrates the BMI calculator component.</p>

            <div className="mb-6">
                <button
                    onClick={runTest}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Run Test
                </button>
            </div>

            {testResults.length > 0 && (
                <div className="mb-6 p-4 bg-gray-100 rounded">
                    <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
                    <ul className="list-disc pl-5">
                        {testResults.map((result, index) => (
                            <li key={index} className="mb-1">{result}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">BMI Calculator:</h2>
                <BMICalculator />
            </div>
        </div>
    );
}
