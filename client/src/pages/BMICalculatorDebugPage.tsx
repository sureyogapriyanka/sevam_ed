import BMICalculatorDebug from "../components/common/BMICalculatorDebug";

export default function BMICalculatorDebugPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">BMI Calculator Debug</h1>
                    <p className="text-blue-700">Debug version of the BMI Calculator component</p>
                </div>

                <BMICalculatorDebug />
            </div>
        </div>
    );
}
