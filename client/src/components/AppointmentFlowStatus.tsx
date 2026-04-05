import React from 'react';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

interface AppointmentFlowStatusProps {
    currentStatus: string;
    className?: string;
}

const steps = [
    { key: 'booked', label: 'Booked' },
    { key: 'checked_in', label: 'Arrival' },
    { key: 'vitals_done', label: 'Vitals' },
    { key: 'consulting', label: 'Consultation' },
    { key: 'dispensed', label: 'Prescription' },
    { key: 'completed', label: 'Dispensing' }
];

const AppointmentFlowStatus: React.FC<AppointmentFlowStatusProps> = ({ currentStatus, className }) => {
    const currentIndex = steps.findIndex(s => s.key === currentStatus);
    const normalizedIndex = (currentStatus === 'completed' || currentStatus === 'dispensed') ? steps.length - 1 : (currentIndex === -1 ? 0 : currentIndex);

    return (
        <div className={cn("flex items-center w-full min-w-[320px] gap-1", className)}>
            {steps.map((step, index) => {
                const isCompleted = index < normalizedIndex || currentStatus === 'completed' || currentStatus === 'dispensed';
                const isCurrent = index === normalizedIndex;

                return (
                    <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center group relative cursor-default">
                            {/* Marker */}
                            <div className={cn(
                                "h-5 w-5 rounded-full flex items-center justify-center transition-all duration-500",
                                isCompleted ? "bg-emerald-500 text-white" :
                                    isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-50 animate-pulse" :
                                        "bg-slate-100 text-slate-300"
                            )}>
                                {isCompleted ? <Check className="h-2.5 w-2.5 stroke-[4px]" /> : <div className="h-1 w-1 rounded-full bg-current" />}
                            </div>
                            
                            {/* Label - Absolute positioning to prevent taking up row height */}
                            <div className="absolute -bottom-5 w-max">
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-tighter transition-colors duration-300",
                                    isCurrent ? "text-blue-600" : isCompleted ? "text-emerald-600" : "text-slate-300"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        </div>

                        {/* Connector */}
                        {index < steps.length - 1 && (
                            <div className="h-[2px] flex-1 bg-slate-100 rounded-full overflow-hidden mx-0.5">
                                <div className={cn(
                                    "h-full transition-all duration-700 ease-in-out",
                                    isCompleted ? "w-full bg-emerald-500" : (isCurrent ? "w-1/2 bg-blue-600" : "w-0")
                                )} />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default AppointmentFlowStatus;
