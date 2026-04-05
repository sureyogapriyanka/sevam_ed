import { useState } from "react";
import BMICalculator from "../components/common/BMICalculator";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, Info } from "lucide-react";

export default function BMICalculatorTestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">BMI Calculator Test</h1>
                    <p className="text-blue-700">Testing the BMI Calculator component</p>
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
                                    Test Instructions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3 text-blue-800">
                                    <p>
                                        Enter height: 175 cm
                                    </p>
                                    <p>
                                        Enter weight: 70 kg
                                    </p>
                                    <p>
                                        Click "Calculate BMI"
                                    </p>
                                    <p>
                                        Expected result: BMI = 22.9 (Normal Weight)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
