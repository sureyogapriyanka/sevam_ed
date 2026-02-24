import React from 'react';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

interface AppointmentFlowStatusProps {
    currentStatus: string;
    className?: string;
}

const steps = [
    { key: 'booked', label: 'Booked' },
    { key: 'checked_in', label: 'Checked In' },
    { key: 'vitals_done', label: 'Vitals' },
    { key: 'consulting', label: 'Consultation' },
    { key: 'consulted', label: 'Consulted' },
    { key: 'billing', label: 'Billing' },
    { key: 'completed', label: 'Completed' }
];

const AppointmentFlowStatus: React.FC<AppointmentFlowStatusProps> = ({ currentStatus, className }) => {
    const currentIndex = steps.findIndex(s => s.key === currentStatus);

    // For statuses like 'consulted', we treat it as near completion
    // For unknown or final statuses
    const normalizedIndex = currentStatus === 'dispensed' ? steps.length - 1 : currentIndex;

    return (
        <div className={cn("flex items-center w-full", className)}>
            {steps.map((step, index) => {
                const isCompleted = index < normalizedIndex || currentStatus === 'completed' || currentStatus === 'dispensed';
                const isCurrent = index === normalizedIndex;

                return (
                    <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center relative flex-1">
                            <div className={cn(
                                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300",
                                isCompleted ? "bg-green-500 border-green-600 text-white" :
                                    isCurrent ? "bg-blue-600 border-blue-700 text-white ring-4 ring-blue-100" :
                                        "bg-slate-100 border-slate-200 text-slate-400"
                            )}>
                                {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                            </div>
                            <span className={cn(
                                "text-[9px] mt-1 font-semibold uppercase tracking-tighter text-center",
                                isCurrent ? "text-blue-700" : isCompleted ? "text-green-700" : "text-slate-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "h-[2px] mb-4 flex-1 transition-all duration-300",
                                isCompleted ? "bg-green-500" : "bg-slate-200"
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default AppointmentFlowStatus;
