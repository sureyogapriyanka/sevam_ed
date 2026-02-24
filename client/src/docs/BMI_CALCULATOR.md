# BMI Calculator Documentation

## Overview
The BMI Calculator is a React component that allows users to calculate their Body Mass Index (BMI) based on their height and weight measurements.

## Component Location
- Component: `src/components/common/BMICalculator.tsx`
- Test Page: `src/pages/BMICalculatorTestPage.tsx`
- Test Route: `/bmi-test`

## How to Test the BMI Calculator

### Manual Testing
1. Navigate to `/bmi-test` route in your browser
2. Enter height: 175 cm
3. Enter weight: 70 kg
4. Click "Calculate BMI"
5. Expected result: BMI = 22.9 (Normal Weight category)

### Test Cases

#### Valid Input Test
- Height: 175 cm
- Weight: 70 kg
- Expected BMI: 22.9
- Expected Category: "Normal Weight"

#### Error Handling Tests
1. Empty inputs - Should show "Please enter both height and weight"
2. Invalid numbers - Should show "Please enter valid numbers"
3. Negative values - Should show "Height and weight must be positive numbers"
4. Excessive values - Should show appropriate limits (height > 300 cm or weight > 1000 kg)

## BMI Categories
- Under 16: Severely Underweight
- 16-18.5: Underweight
- 18.5-25: Normal Weight
- 25-30: Overweight
- 30-35: Obese Class I
- 35-40: Obese Class II
- Over 40: Obese Class III

## Formula
BMI = weight (kg) / [height (m)]²

## Component Props
The BMICalculator component does not require any props and can be used standalone.

## Usage Example
```jsx
import BMICalculator from "../components/common/BMICalculator";

function MyPage() {
  return (
    <div>
      <h1>BMI Calculator</h1>
      <BMICalculator />
    </div>
  );
}
```

## Troubleshooting
If the calculator is not working:

1. Check that both height and weight fields are filled
2. Ensure values are positive numbers
3. Verify that height is in centimeters and weight is in kilograms
4. Check browser console for any JavaScript errors
5. Ensure all dependencies are properly installed