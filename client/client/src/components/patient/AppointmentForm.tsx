{
    currentStep < totalSteps ? (
        <Button
            onClick={nextStep}
            disabled={currentStep === 5 && doctors.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
        >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
    ) : (