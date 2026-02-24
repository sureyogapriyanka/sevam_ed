import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { Clock } from "lucide-react";

export default function QueueDisplayBoard() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch queue data every 30 seconds for failover/refresh
    const { data: queue = [] } = useQuery<any[]>({
        queryKey: ["/api/queue"],
        refetchInterval: 30000
    });

    const nowServing = queue.find(q => q.status === "in-consultation");
    const nextTokens = queue.filter(q => q.status === "waiting").slice(0, 5);

    return (
        <div className="fixed inset-0 bg-[#0a1628] text-white flex flex-col font-sans overflow-hidden">
            {/* Top Bar */}
            <div className="h-32 border-b-2 border-blue-900/50 flex items-center justify-between px-16 bg-[#0d1b2e]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black">
                        S
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter">SevaOnline Hospital</h1>
                        <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-sm">OPD TOKEN DISPLAY SYSTEM</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-5xl font-black font-mono">
                        {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </h2>
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">
                        {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex px-12 py-12 gap-12">
                {/* Left Panel - NOW SERVING */}
                <div className="w-[60%] flex flex-col items-center justify-center bg-blue-950/30 rounded-[3rem] border-4 border-blue-900/30 relative">
                    <div className="absolute top-12 text-4xl font-black text-yellow-400 tracking-[0.2em] uppercase">
                        NOW SERVING
                    </div>

                    {nowServing ? (
                        <div className="text-center space-y-8 animate-in zoom-in-95 duration-700">
                            <h3 className="text-[280px] font-black leading-none text-yellow-400 drop-shadow-[0_0_50px_rgba(250,204,21,0.3)] animate-pulse">
                                {nowServing.tokenNumber || "T-000"}
                            </h3>
                            <div className="space-y-2">
                                <p className="text-6xl font-black text-white uppercase">DR. {nowServing.doctorId?.name || "MEDICAL OFFICER"}</p>
                                <p className="text-3xl font-bold text-blue-400 uppercase tracking-widest">CHAMBER NO. {nowServing.roomNumber || "04"}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-6 opacity-50">
                            <h3 className="text-9xl font-black text-slate-700 italic">VACANT</h3>
                            <p className="text-2xl font-bold text-slate-500 uppercase">Waiting for next patient...</p>
                        </div>
                    )}

                    {/* Emergency Indicator */}
                    {nowServing?.priority === 'emergency' && (
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-40 bg-red-600/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                            <div className="text-red-500 text-6xl font-black animate-ping">🚨 EMERGENCY CASE 🚨</div>
                        </div>
                    )}
                </div>

                {/* Right Panel - NEXT IN QUEUE */}
                <div className="w-[40%] flex flex-col">
                    <h4 className="text-3xl font-black text-slate-400 mb-8 px-4 flex items-center justify-between">
                        NEXT TOKENS
                        <span className="text-sm font-bold bg-blue-900/50 px-4 py-1 rounded-full text-blue-300">WAITING LIST</span>
                    </h4>

                    <div className="space-y-6">
                        {nextTokens.map((token, idx) => (
                            <div
                                key={token.id}
                                className={`flex items-center justify-between p-8 rounded-[2rem] border-l-8 transition-all ${token.priority === 'emergency'
                                    ? 'bg-red-950/40 border-l-red-500 border-2 border-red-900/50'
                                    : 'bg-blue-900/20 border-l-blue-500 border border-blue-800/20'
                                    }`}
                            >
                                <div className="flex items-center gap-8">
                                    <span className="text-6xl font-black text-white">{token.tokenNumber || `T-${String(idx + 1).padStart(3, '0')}`}</span>
                                    <div>
                                        <p className="text-3xl font-black text-white truncate max-w-[200px]">
                                            {(token.patientId?.userId?.name || token.patientName || "Patient").split(' ')[0]}
                                        </p>
                                        <p className="text-lg font-bold text-blue-400 uppercase tracking-widest">
                                            DR. {(token.doctorId?.name || "MD").split(' ').pop()}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-4 h-4 rounded-full ${token.priority === 'emergency' ? 'bg-red-500 animate-ping' : 'bg-blue-400'}`}></div>
                            </div>
                        ))}

                        {nextTokens.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <Clock className="h-20 w-20 mb-4" />
                                <p className="text-xl font-bold italic">Queue is clear</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Ticker */}
            <div className="h-20 bg-blue-600 flex items-center relative overflow-hidden">
                <div className="absolute h-full px-12 bg-blue-700 flex items-center z-10 shadow-[20px_0_40px_rgba(0,0,0,0.3)]">
                    <span className="text-2xl font-black text-white uppercase tracking-tighter">ANNOUNCEMENTS</span>
                </div>
                <div className="whitespace-nowrap flex items-center animate-ticker pl-[240px]">
                    <span className="text-2xl font-bold text-blue-50 mx-20">Welcome to SevaOnline Hospital ― India's Premium Clinic Chain</span>
                    <span className="text-2xl font-bold text-blue-50 mx-20">Please maintain silence in the waiting area ― Mobile phones on silent</span>
                    <span className="text-2xl font-bold text-blue-50 mx-20">Carry your digital prescriptions and previous medical reports for faster consults</span>
                    <span className="text-2xl font-bold text-blue-50 mx-20">No smoking on hospital premises ― Statutory Warning applies</span>
                    <span className="text-2xl font-bold text-blue-50 mx-20">Emergency Numbers: Ambulance - 108 | Hospital Help - 022-XXXX-XXXX</span>
                </div>
            </div>

            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                .animate-ticker {
                    animation: ticker 40s linear infinite;
                }
            `}</style>
        </div>
    );
}
