import { useState } from "react";
import BMICalculator from "../components/common/BMICalculator";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, Info } from "lucide-react";

export default function BMICalculatorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">BMI Calculator</h1>
                    <p className="text-blue-700">Calculate your Body Mass Index to assess your health status</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <BMICalculator />
                    </div>

                    <div className="space-y-6">
                        <Card className="border-2 border-blue-200 bg-white">
                            <CardHeader className="bg-blue-50">
                                <CardTitle className="flex items-center text-blue-900">
                                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                                    About BMI
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3 text-blue-800">
                                    <p>
                                        Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight, and obesity in adults.
                                    </p>
                                    <p>
                                        It is defined as a person's weight in kilograms divided by the square of their height in meters (kg/m²).
                                    </p>
                                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                        <p className="font-medium mb-1">Formula:</p>
                                        <p className="text-center text-blue-900 font-mono">BMI = weight (kg) / [height (m)]²</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-200 bg-white">
                            <CardHeader className="bg-blue-50">
                                <CardTitle className="flex items-center text-blue-900">
                                    <Heart className="h-5 w-5 mr-2 text-blue-600" />
                                    BMI Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                        <span className="text-blue-800">Under 18.5</span>
                                        <span className="font-medium text-blue-900">Underweight</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                        <span className="text-blue-800">18.5 - 24.9</span>
                                        <span className="font-medium text-green-700">Normal weight</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                                        <span className="text-blue-800">25 - 29.9</span>
                                        <span className="font-medium text-yellow-700">Overweight</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                                        <span className="text-blue-800">30 and above</span>
                                        <span className="font-medium text-red-700">Obese</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-200 bg-white">
                            <CardHeader className="bg-blue-50">
                                <CardTitle className="text-blue-900">Important Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <ul className="space-y-2 text-blue-800 text-sm">
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span>BMI is a screening tool, not a diagnostic tool</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span>It may not be accurate for athletes or very muscular individuals</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span>Elderly individuals may have more body fat than BMI indicates</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span>Always consult with a healthcare provider for a complete health assessment</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
