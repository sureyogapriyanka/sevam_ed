import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ClipboardList, Plus, Trash2, Save, FileText, Activity, Stethoscope } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MedicalReportFormProps {
    appointmentId: string;
    patientName: string;
    doctorName: string;
    onSubmit: (data: any) => void;
}

const HISTORY_OPTIONS = [
    "Breathing Problems", "Stroke", "Depression", "Pregnant", "Bone/joint Problems", "Bowel/Bladder",
    "Heart Problems", "Kidney Problems", "History of heavy alcohol use", "Current Wound/Skin Problems",
    "Gallbladder/Liver", "Drug use", "Pacemaker", "Electrical implants", "Smoking", "Tumor/Cancer",
    "Anxiety attacks", "Headaches", "Diabetes", "Sleep Apnea"
];

const MedicalReportForm: React.FC<MedicalReportFormProps> = ({ appointmentId, patientName, doctorName, onSubmit }) => {
    const [formData, setFormData] = useState({
        onsetTime: '',
        describeProblem: '',
        history: [] as string[],
        surgeries: [{ name: '', year: '', complications: '' }],
        medications: [{ name: '', dose: '', duration: '', reason: '' }],
        allergies: { latex: false, iodine: false, bromine: false, other: '' },
        additionalComments: ''
    });

    const toggleHistory = (item: string) => {
        setFormData(prev => ({
            ...prev,
            history: prev.history.includes(item) 
                ? prev.history.filter(i => i !== item) 
                : [...prev.history, item]
        }));
    };

    const addSurgery = () => setFormData(prev => ({ ...prev, surgeries: [...prev.surgeries, { name: '', year: '', complications: '' }] }));
    const removeSurgery = (index: number) => setFormData(prev => ({ ...prev, surgeries: prev.surgeries.filter((_, i) => i !== index) }));

    const addMedication = () => setFormData(prev => ({ ...prev, medications: [...prev.medications, { name: '', dose: '', duration: '', reason: '' }] }));
    const removeMedication = (index: number) => setFormData(prev => ({ ...prev, medications: prev.medications.filter((_, i) => i !== index) }));

    return (
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white max-w-5xl mx-auto border-t-8 border-blue-600">
            <CardContent className="p-12 space-y-12">
                {/* HEADER */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Stethoscope size={24} />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">SevaMed <span className="text-blue-600">Clinical</span></h1>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">Formal Medical Report Blueprint · Ref: {appointmentId}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <h2 className="text-4xl font-black text-slate-100 uppercase tracking-tighter absolute right-12 top-12 opacity-5 pointer-events-none">REPORT</h2>
                        <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl">
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Report Date</p>
                             <p className="text-sm font-black text-slate-800">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* PATIENT INFO */}
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-50/50 w-fit px-3 py-1 rounded-full">
                            <ClipboardList size={12} /> Case Presentation
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Problem Onset</Label>
                                <Input 
                                    className="h-12 rounded-xl border-slate-200 mt-2 font-bold focus:ring-blue-500" 
                                    placeholder="When did your problem start?"
                                    value={formData.onsetTime}
                                    onChange={e => setFormData({...formData, onsetTime: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</Label>
                                <textarea 
                                    className="w-full min-h-[100px] rounded-xl border border-slate-200 mt-2 p-4 font-bold text-sm focus:ring-blue-500 outline-none transition-all focus:border-blue-500"
                                    placeholder="Describe current problem..."
                                    value={formData.describeProblem}
                                    onChange={e => setFormData({...formData, describeProblem: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 w-fit px-3 py-1 rounded-full">
                            Patient Identification
                        </div>
                        <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</span>
                                <span className="font-black text-slate-900 uppercase">{patientName}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Consulting Doctor</span>
                                <span className="font-black text-blue-600">Dr. {doctorName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Auth ID</span>
                                <span className="font-mono text-[10px] text-slate-500">{appointmentId.slice(0, 8)}...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MEDICAL HISTORY */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-50/50 w-fit px-3 py-1 rounded-full">
                        <Activity size={12} /> Clinical History Checklist
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        {HISTORY_OPTIONS.map(item => (
                            <div key={item} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => toggleHistory(item)}>
                                <Checkbox 
                                    id={item} 
                                    checked={formData.history.includes(item)}
                                    className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                                <label className="text-xs font-bold text-slate-600 cursor-pointer group-hover:text-slate-900 transition-colors">{item}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SURGERIES */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 w-fit px-3 py-1 rounded-full">
                            Surgeries & Hospitalizations
                        </div>
                        <Button variant="ghost" size="sm" onClick={addSurgery} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 rounded-xl">
                            <Plus size={14} className="mr-1" /> Add Entry
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Procedure/Hospital</TableHead>
                                <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Year</TableHead>
                                <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Complications</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formData.surgeries.map((s, i) => (
                                <TableRow key={i} className="border-slate-50 group">
                                    <TableCell><Input className="border-none shadow-none focus-visible:ring-0 font-bold p-0 text-sm" value={s.name} onChange={e => { const list = [...formData.surgeries]; list[i].name = e.target.value; setFormData({...formData, surgeries: list}) }} placeholder="Appendectomy..." /></TableCell>
                                    <TableCell><Input className="border-none shadow-none focus-visible:ring-0 font-bold p-0 text-sm" value={s.year} onChange={e => { const list = [...formData.surgeries]; list[i].year = e.target.value; setFormData({...formData, surgeries: list}) }} placeholder="2022" /></TableCell>
                                    <TableCell><Input className="border-none shadow-none focus-visible:ring-0 font-bold p-0 text-sm" value={s.complications} onChange={e => { const list = [...formData.surgeries]; list[i].complications = e.target.value; setFormData({...formData, surgeries: list}) }} placeholder="None" /></TableCell>
                                    <TableCell><Button variant="ghost" size="sm" onClick={() => removeSurgery(i)} className="opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 size={14} /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* MEDICATIONS */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-50/50 w-fit px-3 py-1 rounded-full">
                            Current Recommended Medications
                        </div>
                        <Button variant="ghost" size="sm" onClick={addMedication} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 rounded-xl">
                            <Plus size={14} className="mr-1" /> Add Medicine
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {formData.medications.map((m, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                                <Button variant="ghost" size="sm" onClick={() => removeMedication(i)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-rose-500 hover:bg-rose-100 h-8 w-8 p-0 rounded-full"><Trash2 size={14} /></Button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Medicine Name</Label>
                                        <Input className="h-10 rounded-xl border-slate-200 mt-1 font-bold" value={m.name} onChange={e => { const list = [...formData.medications]; list[i].name = e.target.value; setFormData({...formData, medications: list}) }} placeholder="Paracetamol..." />
                                    </div>
                                    <div>
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dose/Freq</Label>
                                        <Input className="h-10 rounded-xl border-slate-200 mt-1 font-bold" value={m.dose} onChange={e => { const list = [...formData.medications]; list[i].dose = e.target.value; setFormData({...formData, medications: list}) }} placeholder="1-0-1" />
                                    </div>
                                    <div>
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration (Days)</Label>
                                        <Input className="h-10 rounded-xl border-slate-200 mt-1 font-bold" value={m.duration} onChange={e => { const list = [...formData.medications]; list[i].duration = e.target.value; setFormData({...formData, medications: list}) }} placeholder="5" />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reason / Diagnosis</Label>
                                        <Input className="h-10 rounded-xl border-slate-200 mt-1 font-bold" value={m.reason} onChange={e => { const list = [...formData.medications]; list[i].reason = e.target.value; setFormData({...formData, medications: list}) }} placeholder="Fever / Infection..." />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SIGNATURE SECTION */}
                <div className="pt-10 border-t border-slate-100 flex justify-between items-end">
                    <div className="space-y-4 max-w-sm">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Final Physician Notes
                        </div>
                        <textarea 
                            className="w-full min-h-[80px] rounded-xl border border-slate-200 p-4 font-bold text-xs ring-offset-background outline-none transition-all focus:ring-2 focus:ring-blue-500"
                            placeholder="Additional comments or instructions..."
                            value={formData.additionalComments}
                            onChange={e => setFormData({...formData, additionalComments: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            className="h-14 px-8 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-slate-50"
                            onClick={() => window.print()}
                        >
                            <FileText size={18} className="mr-2" /> Draft Preview
                        </Button>
                        <Button 
                            className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95"
                            onClick={() => onSubmit(formData)}
                        >
                            <Save size={18} className="mr-2" /> Finalize Report & PDF
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MedicalReportForm;
