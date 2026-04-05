import React, { useState } from 'react';

// CollapsibleSection component using the new CSS classes
const CollapsibleSection = ({ title, children, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="collapsible-section">
            <div
                className="collapsible-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <div className={`collapsible-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                {children}
            </div>
        </div>
    );
};

// UserDetailsCard component using the new CSS classes
const UserDetailsCard = ({ user }) => {
    return (
        <div className="user-details-card">
            <div className="user-details-header">
                <h3 className="text-lg font-semibold">User Details</h3>
            </div>
            <div className="user-details-content">
                <div className="user-details-row">
                    <span className="user-details-label">Name:</span>
                    <span className="user-details-value">{user.name}</span>
                </div>
                <div className="user-details-row">
                    <span className="user-details-label">Email:</span>
                    <span className="user-details-value">{user.email}</span>
                </div>
                <div className="user-details-row">
                    <span className="user-details-label">Phone:</span>
                    <span className="user-details-value">{user.phone}</span>
                </div>
                <div className="user-details-row">
                    <span className="user-details-label">Role:</span>
                    <span className="user-details-value">{user.role}</span>
                </div>
            </div>
        </div>
    );
};

// NotificationMessage component using the new CSS classes
const NotificationMessage = ({ type = 'info', title, message, onDismiss }) => {
    return (
        <div className={`notification-message ${type}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    <p className="text-gray-600 mt-1">{message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-gray-400 hover:text-gray-600 ml-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

// Example usage in a dashboard component
const DashboardExample = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'success', title: 'Profile Updated', message: 'Your profile has been successfully updated.' },
        { id: 2, type: 'warning', title: 'Appointment Reminder', message: 'You have an appointment tomorrow at 10:00 AM.' },
        { id: 3, type: 'info', title: 'New Feature', message: 'Check out our new telemedicine feature.' }
    ]);

    const user = {
        name: 'Dr. John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        role: 'Doctor'
    };

    const handleDismiss = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {/* Notification Messages */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
                {notifications.map(notification => (
                    <NotificationMessage
                        key={notification.id}
                        type={notification.type}
                        title={notification.title}
                        message={notification.message}
                        onDismiss={() => handleDismiss(notification.id)}
                    />
                ))}
            </div>

            {/* User Details Card */}
            <div className="mb-8">
                <UserDetailsCard user={user} />
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
                <CollapsibleSection title="Patient Information" defaultExpanded={true}>
                    <p className="text-gray-600">
                        Detailed patient information including medical history, current medications,
                        and recent visits. This section can be collapsed to save space.
                    </p>
                </CollapsibleSection>

                <CollapsibleSection title="Appointment History">
                    <p className="text-gray-600">
                        List of past appointments with dates, doctors, and outcomes.
                        This section is collapsed by default to keep the interface clean.
                    </p>
                </CollapsibleSection>

                <CollapsibleSection title="Medical Records">
                    <p className="text-gray-600">
                        Access to medical records, test results, and prescriptions.
                        Only authorized personnel can view this information.
                    </p>
                </CollapsibleSection>
            </div>
        </div>
    );
};

export default DashboardExample;
