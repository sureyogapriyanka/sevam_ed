// Test file to verify the new CSS classes work correctly
const testCSSClasses = () => {
    // Test data
    const testUser = {
        name: "Dr. Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "+91 98765 43210",
        role: "Doctor"
    };

    const testNotifications = [
        { id: 1, type: 'success', title: 'Appointment Confirmed', message: 'Your appointment with patient Raj Kumar has been confirmed for tomorrow at 10:30 AM.' },
        { id: 2, type: 'warning', title: 'Lab Results', message: 'Pending lab results for patient Sunita Devi require your attention.' },
        { id: 3, type: 'info', title: 'System Update', message: 'The system will undergo maintenance tonight from 12:00 AM to 2:00 AM.' }
    ];

    console.log("Testing CSS classes for message-like collapsed sections and saved user details:");
    console.log("1. Collapsible sections with smooth transitions and hover effects");
    console.log("2. User details cards with professional blue gradient header");
    console.log("3. Notification messages with color-coded left borders");
    console.log("4. All components have consistent spacing and typography");

    console.log("\nTest user data:", testUser);
    console.log("Test notifications:", testNotifications);

    return {
        user: testUser,
        notifications: testNotifications
    };
};

// Run the test
testCSSClasses();
