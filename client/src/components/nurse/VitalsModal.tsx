import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { apiCall } from '../../utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../hooks/use-toast';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';

interface VitalsModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: any;
}

const VitalsModal: React.FC<VitalsModalProps> = ({ isOpen, onClose, appointment }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [vitals, setVitals] = useState({
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        spO2: '',
        respiratoryRate: '',
        weight: '',
        notes: ''
    });

    const flowMutation = useMutation({
        mutationFn: (vitalsId: string) =>
            apiCall(`/flow/vitals-done/${appointment._id}`, {
                method: 'POST',
                body: JSON.stringify({ vitalsId })
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            toast({
                title: "Vitals Recorded",
                description: `Patient ${appointment.patientId.name} is now ready for Dr. ${appointment.doctorId.name}`,
            });
            onClose();
        }
    });

    const saveVitalsMutation = useMutation({
        mutationFn: (vitalsData: any) =>
            apiCall('/vitals', {
                method: 'POST',
                body: JSON.stringify({
                    patientId: appointment.patientId._id,
                    appointmentId: appointment._id,
                    ...vitalsData
                })
            }),
        onSuccess: (data) => {
            flowMutation.mutate(data._id);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveVitalsMutation.mutate(vitals);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-[2.5rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-2">
                        <Activity className="h-6 w-6 text-blue-600" />
                        Record Vitals: {appointment?.patientId?.name}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Blood Pressure (mmHg)</Label>
                            <div className="relative">
                                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    className="pl-10 h-11 rounded-xl bg-slate-50 border-2 font-bold"
                                    placeholder="120/80"
                                    value={vitals.bloodPressure}
                                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Heart Rate (bpm)</Label>
                            <div className="relative">
                                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                                <Input
                                    className="pl-10 h-11 rounded-xl bg-slate-50 border-2 font-bold"
                                    placeholder="72"
                                    value={vitals.heartRate}
                                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Temperature (°F)</Label>
                            <div className="relative">
                                <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                                <Input
                                    className="pl-10 h-11 rounded-xl bg-slate-50 border-2 font-bold"
                                    placeholder="98.6"
                                    value={vitals.temperature}
                                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">SpO2 (%)</Label>
                            <div className="relative">
                                <Wind className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                                <Input
                                    className="pl-10 h-11 rounded-xl bg-slate-50 border-2 font-bold"
                                    placeholder="98"
                                    value={vitals.spO2}
                                    onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Chief Complaint / Notes</Label>
                        <Input
                            className="h-11 rounded-xl bg-slate-50 border-2 font-medium"
                            placeholder="How is the patient feeling?"
                            value={vitals.notes}
                            onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-black rounded-2xl shadow-lg shadow-blue-100"
                            disabled={saveVitalsMutation.isPending || flowMutation.isPending}
                        >
                            {saveVitalsMutation.isPending ? "SAVING..." : "SAVE & NOTIFY DOCTOR"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default VitalsModal;
