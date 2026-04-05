import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Star, 
  Send,
  RefreshCw,
  X,
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Plus,
  ShieldCheck,
  Maximize2,
  Users,
  Settings,
  Shield
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  avatar: string;
  status?: string;
  isOwn?: boolean;
}

interface Channel {
  id: string;
  name: string;
  icon: string;
  unread: number;
}

interface Member {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
}

interface SevaMedConnectProps {
  currentUser?: {
    name: string;
    avatar: string;
  };
  initialChannel?: string;
  title?: React.ReactNode;
  isPatient?: boolean;
}

const DEFAULT_CHANNELS: Channel[] = [
  { id: "general", name: "General", icon: "#", unread: 0 },
  { id: "ops", name: "Hospital-Ops", icon: "🏥", unread: 0 },
  { id: "pharmacy", name: "Pharmacy-Chat", icon: "💊", unread: 0 }
];

const DEFAULT_MEMBERS: Member[] = [
  { id: 1, name: "Dr. Anjali Verma", role: "Chief of Cardiology", avatar: "AV", status: "online" },
  { id: 2, name: "Dr. Rajiv Malhotra", role: "Sr. Neurologist", avatar: "RM", status: "busy" },
  { id: 3, name: "Dr. Nalini Iyer", role: "Pediatric Head", avatar: "NI", status: "online" },
  { id: 4, name: "Dr. Arjun Nair", role: "Orthopedic Surgeon", avatar: "AN", status: "offline" },
  { id: 5, name: "Nurse Kavita Desai", role: "Head Nurse", avatar: "NK", status: "online" },
  { id: 6, name: "Rajesh Kumar", role: "Pharmacy Lead", avatar: "RK", status: "offline" }
];

export default function SevaMedConnect({ 
  currentUser = { name: "Admin", avatar: "AD" },
  initialChannel = "general",
  title,
  isPatient = false
}: SevaMedConnectProps) {
  const [activeChannel, setActiveChannel] = useState(initialChannel);
  const [activeStaff, setActiveStaff] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const selfViewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/users/chat/staff', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
           const data = await response.json();
           setStaff(data);
        }
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      }
    };
    fetchStaff();
  }, []);

  const startCall = async (type: 'voice' | 'video') => {
    setCallType(type);
    setIsCalling(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: type === 'video', 
        audio: true 
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  useEffect(() => {
    if (isCalling && stream) {
      if (videoRef.current) videoRef.current.srcObject = stream;
      if (selfViewRef.current) selfViewRef.current.srcObject = stream;
    }
  }, [isCalling, stream]);

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCalling(false);
    setStream(null);
    streamRef.current = null;
  };
  
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message: Message = {
        id: chatMessages.length + 1,
        sender: currentUser.name,
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: currentUser.avatar,
        isOwn: true
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <MessageSquare size={20} />
          </div>
          {title ? (
            <div className="flex items-center">{title}</div>
          ) : (
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">SevaMed <span className="text-blue-600">Connect</span></h1>
          )}
        </div>
        <div className="flex items-center gap-2">
           <Badge className="bg-blue-600 text-white border-none font-black px-4 py-1.5 shadow-lg shadow-blue-100 flex items-center gap-2">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
              System Online
           </Badge>
           <Button variant="ghost" size="icon" className="text-slate-400 bg-white shadow-sm border border-slate-100 rounded-xl hover:bg-slate-50"><RefreshCw size={18} /></Button>
        </div>
      </div>

      {/* DUAL-PANE CHAT INTERFACE */}
      <div className="flex-1 flex gap-6 overflow-hidden p-2">
        
        {/* 1. LEFT SIDEBAR: ORGANIZATIONAL STRUCTURE */}
        <div className="w-80 bg-slate-50/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col border border-slate-200/60 overflow-hidden">
           <div className="p-8 border-b border-slate-200/40 bg-white/40">
              <div className="flex flex-col gap-1 mb-6">
                 <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Workspace</h2>
                 <h1 className="text-xl font-black text-slate-900 uppercase">General <span className="text-slate-400 font-light">Hub</span></h1>
              </div>
              <div className="relative mb-2">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                 <input 
                   placeholder="Search Workspace..." 
                   className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
              {/* Channels Section */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">Channels</h3>
                 <div className="space-y-1">
                    {(isPatient ? [
                      { id: "general", name: "General Support", icon: "🏥", unread: 0 },
                      { id: "doctors", name: "My Doctors", icon: "👨‍⚕️", unread: 2 }
                    ] : DEFAULT_CHANNELS).map(ch => (
                       <button 
                          key={ch.id}
                          onClick={() => { setActiveChannel(ch.id); setActiveStaff(null); }}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl transition-all group relative",
                            activeChannel === ch.id && !activeStaff                            ? "bg-blue-600 text-white shadow-xl shadow-blue-200/50" 
                            : "text-slate-600 hover:bg-white hover:shadow-md hover:shadow-slate-200/20"
                          )}
                       >
                          <div className="flex items-center gap-4">
                             <span className={cn("font-bold text-lg", activeChannel === ch.id ? "text-blue-100" : "text-slate-400")}>{ch.icon}</span>
                             <span className="text-xs font-black uppercase tracking-tight">{ch.name}</span>
                          </div>
                          {ch.unread > 0 && (
                             <Badge className={cn("rounded-lg text-[9px] font-black px-2 py-0.5", activeChannel === ch.id ? "bg-white text-blue-600" : "bg-blue-600 text-white")}>
                                {ch.unread}
                             </Badge>
                          )}
                          {activeChannel === ch.id && (
                             <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full"></div>
                          )}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Members Section */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-2">Team Directory</h3>
                 <div className="space-y-1">
                    {DEFAULT_MEMBERS.map(m => (
                       <button 
                          key={m.id}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md hover:shadow-slate-200/20 transition-all group"
                        >
                          <div className="relative shrink-0">
                             <div className={cn(
                                "h-11 w-11 rounded-2xl flex items-center justify-center font-black text-xs transition-colors",
                                "bg-white border border-slate-100 text-slate-400 group-hover:border-blue-100 group-hover:text-blue-600 shadow-sm"
                             )}>
                                {m.avatar}
                             </div>
                             <div className={cn(
                                "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-4 border-slate-50 group-hover:border-white transition-all",
                                m.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                                m.status === 'busy' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-slate-300'
                             )}></div>
                          </div>
                          <div className="flex flex-col items-start overflow-hidden">
                             <span className="text-[11px] font-black text-slate-900 truncate w-full text-left uppercase tracking-tight">{m.name}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{m.role}</span>
                          </div>
                       </button>
                    ))}
                 </div>
              </div>
           </div>
            
           <div className="p-6 border-t border-slate-200/40 bg-white/40">
              <Button 
                 onClick={() => setIsNewChatOpen(true)} 
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-6 border-b-4 border-blue-800 shadow-xl active:translate-y-[2px] active:border-b-0 transition-all flex items-center justify-center gap-3"
              >
                 <div className="bg-white/20 p-1.5 rounded-lg">
                    <Plus size={20} className="text-white" />
                 </div>
                 <span className="font-black uppercase tracking-widest text-sm">New Session</span>
              </Button>
           </div>
        </div>

        {/* 2. MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-200/60 overflow-hidden relative">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.02),transparent)] pointer-events-none"></div>
           
           {/* Chat Header */}
           <div className="p-6 bg-slate-50/50 border-b border-white flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-100">
                    {activeStaff ? activeStaff.name.charAt(0).toUpperCase() : ((isPatient ? [
                      { id: "general", name: "General Support", icon: "🏥", unread: 0 },
                      { id: "doctors", name: "My Doctors", icon: "👨‍⚕️", unread: 2 }
                    ] : DEFAULT_CHANNELS).find(c => c.id === activeChannel)?.icon || "#")}
                 </div>
                 <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                       {activeStaff ? activeStaff.name : ((isPatient ? [
                      { id: "general", name: "General Support", icon: "🏥", unread: 0 },
                      { id: "doctors", name: "My Doctors", icon: "👨‍⚕️", unread: 2 }
                    ] : DEFAULT_CHANNELS).find(c => c.id === activeChannel)?.name || activeChannel)}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 italic">
                       {activeStaff ? `Direct Session: ${activeStaff.role}` : "Discussion for all organizational matters"}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-2 relative">
                 <Button onClick={() => startCall('voice')} variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 bg-white shadow-sm border border-slate-100 rounded-xl"><Phone size={18} /></Button>
                 <Button onClick={() => startCall('video')} variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 bg-white shadow-sm border border-slate-100 rounded-xl"><Video size={18} /></Button>
                 <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 bg-white shadow-sm border border-slate-100 rounded-xl"><Search size={18} /></Button>
                 <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                 <Button onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} variant="ghost" size="icon" className="text-slate-400 bg-white shadow-sm border border-slate-100 rounded-xl"><MoreVertical size={18} /></Button>
                 
                 {isMoreMenuOpen && (
                   <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-bold">
                         <Star size={16} /> Favorite Chat
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-bold">
                         <Shield size={16} /> Encryption Info
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-bold">
                         <X size={16} /> Block Contact
                      </Button>
                   </div>
                 )}
              </div>
           </div>

           {/* Message area */}
           <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white selection:bg-blue-100 relative z-10">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={cn(
                   "flex gap-4 group transition-all duration-300",
                   msg.isOwn ? "flex-row-reverse" : "flex-row"
                )}>
                   {/* Avatar */}
                   <div className="shrink-0 pt-1">
                      <div className={cn(
                         "h-10 w-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm overflow-hidden relative",
                         msg.isOwn ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"
                      )}>
                         {msg.avatar}
                         {msg.status === 'online' && !msg.isOwn && (
                            <div className="absolute top-0 right-0 h-2 w-2 bg-emerald-500 rounded-full border border-white"></div>
                         )}
                      </div>
                   </div>

                   {/* Content */}
                   <div className={cn(
                      "flex flex-col space-y-1.5",
                      msg.isOwn ? "items-end" : "items-start"
                   )}>
                      <div className="flex items-baseline gap-2">
                         <span className="text-[10px] font-black uppercase text-slate-900 tracking-tight">{msg.sender}</span>
                         <span className="text-[10px] font-bold text-slate-300">{msg.time}</span>
                      </div>
                      <div className={cn(
                         "px-6 py-4 rounded-[1.8rem] text-sm font-medium leading-relaxed max-w-[85%] shadow-sm transition-all",
                         msg.isOwn 
                         ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100/50 hover:shadow-lg hover:shadow-blue-200/50" 
                         : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-slate-100/50"
                      )}>
                         {msg.message}
                      </div>
                   </div>
                </div>
              ))}
              
              {/* Day Separator */}
              <div className="flex items-center gap-6 py-4">
                 <div className="h-[1px] flex-1 bg-slate-100"></div>
                 <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Today</span>
                 <div className="h-[1px] flex-1 bg-slate-100"></div>
              </div>
           </div>

           {/* Chat Input */}
           <div className="p-6 bg-slate-50/50 border-t border-white relative z-10">
              <div className="bg-white rounded-3xl p-2 shadow-2xl shadow-slate-200/50 border border-slate-100 flex items-center gap-3">
                 <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-50 rounded-2xl"><Paperclip size={18} /></Button>
                 <textarea 
                   className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-4 py-3 placeholder:text-slate-300 resize-none h-12"
                   placeholder="Type your message here..."
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   onKeyPress={handleKeyPress}
                 />
                 <div className="flex items-center gap-2 pr-2">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 transition-colors"><Star size={18} /></Button>
                    <Button 
                       onClick={handleSendMessage}
                       disabled={!newMessage.trim()}
                       className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
                    >
                       <Send size={16} />
                       <span className="hidden sm:inline">Send</span>
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* CALL OVERLAY */}
      {isCalling && (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center animate-in fade-in duration-500">
            {/* SEVAMED COMPLEX VISUAL LAYERS - REFINED FOR LIGHT THEME */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               {/* Bell-shaped architectural layer */}
               <svg className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[150%] h-[150%] text-blue-100/10 opacity-30" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                  <path d="M0,1000 C200,800 400,0 500,0 C600,0 800,800 1000,1000 Z" fill="currentColor" />
               </svg>
               
               {/* Skewed glass layers */}
               <div className="absolute top-1/4 -left-1/4 w-[150%] h-64 bg-blue-100/20 backdrop-blur-3xl -rotate-12 skew-x-12 border-y border-blue-200/20"></div>
               <div className="absolute bottom-1/4 -right-1/4 w-[150%] h-96 bg-white/40 backdrop-blur-2xl rotate-12 -skew-x-12 border-y border-blue-100/30"></div>

              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
            </div>

           <div className="relative w-full h-full flex flex-col p-8 z-10">
              {/* TOP HEADER */}
              <div className="flex justify-between items-center mb-8 px-4">
                 <div className="flex items-center gap-6">
                    <div className="h-14 w-14 bg-white border border-blue-100 rounded-2xl flex items-center justify-center shadow-md">
                       <ShieldCheck className="text-blue-500" size={28} />
                    </div>
                    <div>
                       <h2 className="text-slate-900 font-black text-xl tracking-tight uppercase">SevaMed <span className="text-blue-500">Video Session</span></h2>
                       <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">End-to-End Encrypted</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 bg-white border border-blue-100 px-6 py-3 rounded-2xl shadow-sm group transition-all hover:bg-emerald-50">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Live Video Session</span>
                 </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 relative flex items-center justify-center">
                 {/* REMOTE VIEW (Blurry/Placeholder for demo) */}
                 <div className="w-full h-full rounded-[4rem] border-[3px] border-blue-100 bg-white shadow-[0_20px_50px_rgba(37,99,235,0.05)] transition-all group overflow-hidden">
                    {callType === 'video' ? (
                       <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover blur-[1px] opacity-60 grayscale-0"
                       />
                    ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center">
                          <div className="h-48 w-48 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                             <Phone size={64} className="text-blue-400" />
                          </div>
                          <h3 className="text-4xl font-black text-slate-300 uppercase tracking-widest">Awaiting Remote Stream...</h3>
                       </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 pointer-events-none">
                       <h1 className="text-5xl font-black text-blue-600/10 uppercase tracking-tighter italic">SevaMed</h1>
                       <p className="text-blue-400/20 font-bold tracking-[0.5em] text-sm uppercase">Secure Internal Channel</p>
                    </div>
                 </div>

                 {/* SELF VIEW (PIP) - MINIKAM STYLE */}
                 <div className="absolute bottom-12 right-12 w-96 aspect-video rounded-[2.5rem] overflow-hidden border-[4px] border-blue-100 shadow-[0_20px_80px_rgba(37,99,235,0.35)] z-20 group hover:scale-[1.05] transition-all">
                    {callType === 'video' && !isCameraOff ? (
                       <video 
                          ref={selfViewRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover"
                       />
                    ) : (
                       <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center">
                          <div className="h-16 w-16 bg-white border border-blue-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
                             <VideoOff size={24} className="text-slate-500" />
                          </div>
                          <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Camera Off</span>
                       </div>
                    )}
                    <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full border border-white/20">
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">You</span>
                    </div>
                    <div className="absolute inset-0 border-[6px] border-white/10 pointer-events-none rounded-[2.5rem]"></div>
                 </div>
              </div>

              {/* BOTTOM CONTROL BAR - ZOOM STYLE */}
              <div className="mt-12 flex justify-center pb-8">
                 <div className="bg-white/90 backdrop-blur-xl border border-blue-100 px-10 py-6 rounded-[3rem] flex items-center gap-10 shadow-[0_20px_50px_rgba(37,99,235,0.1)] ring-1 ring-blue-50">
                    <div className="flex items-center gap-8 border-r border-white/10 pr-10">
                       <div className="flex flex-col items-center gap-2">
                          <Button 
                             onClick={() => setIsMuted(!isMuted)}
                             className={cn(
                                "h-16 w-16 rounded-2xl transition-all border-2",
                                isMuted ? "bg-rose-50 border-rose-200 text-rose-500 shadow-lg shadow-rose-500/5" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                             )}
                          >
                             {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                          </Button>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mute</span>
                       </div>
                       
                       <div className="flex flex-col items-center gap-2">
                          <Button 
                             onClick={() => setIsCameraOff(!isCameraOff)}
                             className={cn(
                                "h-16 w-16 rounded-2xl transition-all border-2",
                                isCameraOff ? "bg-rose-50 border-rose-200 text-rose-500 shadow-lg shadow-rose-500/5" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                             )}
                          >
                             {isCameraOff ? <VideoOff size={24} /> : <VideoIcon size={24} />}
                          </Button>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stop Video</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="flex flex-col items-center gap-2">
                           <Button 
                              onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
                              className={cn(
                                 "h-16 w-16 rounded-2xl transition-all border-2 flex items-center justify-center",
                                 isParticipantsOpen ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20" : "bg-slate-50 border border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                              )}
                           >
                             <Users size={24} />
                          </Button>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participants</span>
                       </div>
                       <div className="flex flex-col items-center gap-2">
                          <Button className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600">
                             <Maximize2 size={24} />
                          </Button>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fullscreen</span>
                       </div>
                    </div>

                    <div className="pl-10 border-l border-white/10">
                       <Button 
                          onClick={endCall}
                          className="px-10 h-16 rounded-2xl bg-rose-600 border-b-4 border-rose-800 text-white font-black uppercase tracking-[0.2em] shadow-xl hover:bg-rose-700 active:translate-y-[2px] active:border-b-0 transition-all flex items-center gap-3"
                       >
                          <PhoneOff size={20} />
                          End Call
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* NEW CHAT MODAL */}
      {isNewChatOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">New Internal Session</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Select a staff member to initiate chat</p>
                 </div>
                 <Button onClick={() => setIsNewChatOpen(false)} variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-400 hover:bg-slate-200">
                    <X size={24} />
                 </Button>
              </div>
              
              <div className="p-8">
                 <div className="relative mb-8">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                       type="text"
                       placeholder="Search by ID, Name or Role..."
                       className="w-full h-16 pl-14 pr-8 bg-slate-100/50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl font-bold text-slate-700 outline-none transition-all placeholder:text-slate-400"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>

                 <div className="max-h-[400px] overflow-y-auto pr-4 space-y-2 custom-scrollbar">
                    {staff.filter(s => 
                       s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       s.role.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(m => (
                       <button 
                          key={m._id}
                          onClick={() => {
                             setActiveStaff(m);
                             setActiveChannel("");
                             setIsNewChatOpen(false);
                          }}
                          className="w-full group flex items-center justify-between p-4 rounded-3xl hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-200"
                       >
                          <div className="flex items-center gap-4">
                             <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-all">
                                {m.name.split(' ').map((n: string) => n[0]).join('')}
                             </div>
                             <div className="text-left">
                                <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-all">{m.name}</h4>
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.role}</span>
                                   <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                                   <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{m.department || 'General'}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {m._id.slice(-6).toUpperCase()}</span>
                             <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                                <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                                <span className="text-[8px] font-black text-emerald-600 uppercase">Available</span>
                             </div>
                          </div>
                       </button>
                    ))}
                 </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3 justify-center">
                 <ShieldCheck className="text-emerald-500" size={16} />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Powered by SevaMed Secure Infrastructure</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
