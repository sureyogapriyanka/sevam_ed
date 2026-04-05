import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calculator, Ruler, Weight } from "lucide-react";

interface BMIResult {
    value: number;
    category: string;
    interpretation: string;
}

export default function BMICalculator() {
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
    const [error, setError] = useState<string>("");

    const calculateBMI = () => {
        // Reset previous results and errors
        setError("");
        setBmiResult(null);

        // Validate inputs
        if (!height || !weight) {
            setError("Please enter both height and weight");
            return;
        }

        const heightCm = parseFloat(height);
        const weightKg = parseFloat(weight);

        if (isNaN(heightCm) || isNaN(weightKg)) {
            setError("Please enter valid numbers");
            return;
        }

        if (heightCm <= 0 || weightKg <= 0) {
            setError("Height and weight must be positive numbers");
            return;
        }

        if (heightCm > 300) {
            setError("Please enter height in centimeters (max 300 cm)");
            return;
        }

        if (weightKg > 1000) {
            setError("Please enter weight in kilograms (max 1000 kg)");
            return;
        }

        // Calculate BMI
        const heightM = heightCm / 100; // Convert cm to meters
        const bmi = weightKg / (heightM * heightM);

        // Determine category and interpretation
        let category = "";
        let interpretation = "";

        if (bmi < 16) {
            category = "Severely Underweight";
            interpretation = "You may be at risk for nutritional deficiencies and other health issues. Please consult with a healthcare provider.";
        } else if (bmi < 18.5) {
            category = "Underweight";
            interpretation = "You may benefit from a balanced diet to reach a healthier weight. Consider consulting with a nutritionist.";
        } else if (bmi < 25) {
            category = "Normal Weight";
            interpretation = "Congratulations! You're within the healthy weight range. Maintain your current lifestyle for optimal health.";
        } else if (bmi < 30) {
            category = "Overweight";
            interpretation = "Consider adopting a healthier diet and increasing physical activity to reduce health risks.";
        } else if (bmi < 35) {
            category = "Obese Class I";
            interpretation = "You may be at increased risk for health conditions. A healthcare provider can help you develop a weight management plan.";
        } else if (bmi < 40) {
            category = "Obese Class II";
            interpretation = "You're at significant risk for health complications. Medical supervision is recommended for weight management.";
        } else {
            category = "Obese Class III";
            interpretation = "You're at high risk for serious health conditions. Please consult with a healthcare provider immediately.";
        }

        setBmiResult({
            value: parseFloat(bmi.toFixed(1)),
            category,
            interpretation
        });
    };

    const getBadgeVariant = (category: string) => {
        if (category.includes("Underweight")) return "destructive";
        if (category === "Normal Weight") return "default";
        if (category.includes("Overweight") || category.includes("Obese")) return "destructive";
        return "secondary";
    };

    const resetCalculator = () => {
        setHeight("");
        setWeight("");
        setBmiResult(null);
        setError("");
    };

    return (
        <Card className="w-full max-w-md mx-auto border-2 border-blue-300 bg-white">
            <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <span>BMI Calculator</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="height" className="text-blue-800 flex items-center">
                                <Ruler className="h-4 w-4 mr-1" />
                                Height (cm)
                            </Label>
                            <Input
                                id="height"
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="175"
                                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 mt-1"
                                min="0"
                                max="300"
                            />
                        </div>
                        <div>
                            <Label htmlFor="weight" className="text-blue-800 flex items-center">
                                <Weight className="h-4 w-4 mr-1" />
                                Weight (kg)
                            </Label>
                            <Input
                                id="weight"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="70"
                                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 mt-1"
                                min="0"
                                max="1000"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="flex space-x-2">
                        <Button
                            onClick={calculateBMI}
                            disabled={!height || !weight}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Calculate BMI
                        </Button>
                        <Button
                            onClick={resetCalculator}
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                            Reset
                        </Button>
                    </div>

                    {bmiResult && (
                        <div className="p-4 bg-white rounded-lg border border-blue-300 space-y-3">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-800">{bmiResult.value}</p>
                                <p className="text-blue-700">BMI Score</p>
                            </div>

                            <div className="text-center">
                                <Badge variant={getBadgeVariant(bmiResult.category)} className="text-lg py-1 px-3">
                                    {bmiResult.category}
                                </Badge>
                            </div>

                            <div className="text-sm text-blue-800 bg-blue-50 p-3 rounded border border-blue-200">
                                <p className="font-medium mb-1">Interpretation:</p>
                                <p>{bmiResult.interpretation}</p>
                            </div>

                            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                                <p className="font-medium mb-1">BMI Categories:</p>
                                <ul className="space-y-1">
                                    <li>Underweight: &lt; 18.5</li>
                                    <li>Normal weight: 18.5 - 24.9</li>
                                    <li>Overweight: 25 - 29.9</li>
                                    <li>Obese: ≥ 30</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {!bmiResult && !error && (
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <Calculator className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-blue-700 text-sm">
                                Enter your height and weight to calculate your Body Mass Index (BMI)
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
