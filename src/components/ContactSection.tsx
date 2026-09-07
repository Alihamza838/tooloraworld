import React, { useState } from 'react';
import { useToolora } from '../context/TooloraContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Sparkles, 
  User, 
  HelpCircle,
  FileText,
  Activity,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactTicket {
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  priority: string;
  dateString: string;
}

export default function ContactSection() {
  const { theme, setActiveToolId, setShowBlog, setShowAbout, setShowContact } = useToolora();

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<ContactTicket | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    // Simple Field Validation
    if (!name.trim()) {
      setErrorText('Please specify your name so we know who to address.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorText('Please provide a valid electronic email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorText('Please provide a short summary subject.');
      return;
    }
    if (!message.trim() || message.trim().length < 15) {
      setErrorText('Please provide a detailed inquiry message (minimum 15 characters).');
      return;
    }
    if (!agreePrivacy) {
      setErrorText('You must acknowledge that all submissions are processed under sandboxed secure pathways.');
      return;
    }

    // Begin simulated active transmission with high-fidelity transition state
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = `TLR-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTicket: ContactTicket = {
        ticketId,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        category,
        message: message.trim(),
        priority,
        dateString: new Date().toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setSubmittedTicket(newTicket);
      
      // Trigger success fireworks
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      // Reset Fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setAgreePrivacy(false);
    }, 1800);
  };

  const handleStartNew = () => {
    setSubmittedTicket(null);
  };

  return (
    <div id="contact-us-container" className="space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* Editorial Mini Headline */}
      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-wider uppercase border border-emerald-100/50 dark:border-emerald-900/10 font-mono">
          <MessageSquare className="w-3 h-3 text-emerald-500 animate-pulse" /> CUSTOMER SUCCESS RELAY
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight font-display">
          Let’s build something secure together.
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
          In need of custom tools, offline license expansions, or technical sandbox support? Drop our engineers a secure ticket and we will route assistance immediately.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!submittedTicket ? (
          /* ACTIVE SUBMISSION FORM PANEL */
          <motion.div
            key="contact-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          >
            
            {/* The Left Side Form Card */}
            <form 
              onSubmit={handleSubmit}
              className="relative p-6 sm:p-8 bg-white dark:bg-[#0c0c0e] border border-slate-200/85 dark:border-zinc-850/60 rounded-3xl shadow-sm lg:col-span-2 space-y-5 overflow-hidden"
            >
              {/* Spinner transmission blocks overlay */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 z-25 backdrop-blur-xs flex flex-col items-center justify-center gap-4 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-full border-4 border-orange-150 border-t-orange-600 animate-spin" />
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-widest font-mono">Transmitting Ticket...</p>
                    <p className="text-[10px] text-slate-450 dark:text-zinc-500 mt-1 font-sans">Locking payload into AES virtual terminal channels</p>
                  </div>
                </div>
              )}

              {/* Form title */}
              <div className="border-b border-slate-100 dark:border-zinc-850 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">SECURE PAYLOAD DISPATCH</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-150">Open Support Ticket</h3>
              </div>

              {/* Display error message banner if matches validation */}
              {errorText && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/55 dark:border-rose-900/20 rounded-xl text-xs text-rose-600 dark:text-rose-450 font-bold flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="user-name" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono block">Your Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-3.5 h-3.5 text-slate-405" />
                    </div>
                    <input
                      id="user-name"
                      type="text"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-600 transition-all font-medium text-slate-800 dark:text-zinc-100"
                      placeholder="e.g. Liam Devlin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="user-email" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono block">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-3.5 h-3.5 text-slate-405" />
                    </div>
                    <input
                      id="user-email"
                      type="email"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-600 transition-all font-medium text-slate-800 dark:text-zinc-100"
                      placeholder="e.g. security@firm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Type Selection */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="user-category" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono block">Inquiry Type</label>
                  <select
                    id="user-category"
                    className="w-full px-3 py-2 text-xs bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-505 transition-all text-slate-750 dark:text-zinc-200 font-medium cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="technical">Technical Support</option>
                    <option value="feature">Custom Tool Suggestion</option>
                    <option value="enterprise">Offline PWA Licensing</option>
                    <option value="other">General Inquiries</option>
                  </select>
                </div>

                {/* Severity Priority Level */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="user-priority" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono block">Operational Urgency</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((lvl) => {
                      const isActive = priority === lvl;
                      const activeClasses = lvl === 'high' 
                        ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400' 
                        : lvl === 'medium'
                        ? 'bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-950/20 dark:border-orange-900/40 dark:text-orange-400'
                        : 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-300';
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPriority(lvl)}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors border cursor-pointer ${isActive ? activeClasses : 'bg-transparent border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-950/40'}`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Subject */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="user-subject" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono block">Subject Title</label>
                <input
                  id="user-subject"
                  type="text"
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-slate-800 dark:text-zinc-100"
                  placeholder="Summarize the core assistance need"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="user-message" className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono block">Detailed Message Description</label>
                <textarea
                  id="user-message"
                  rows={5}
                  className="w-full px-3 py-2 text-xs bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-slate-800 dark:text-zinc-100 leading-relaxed"
                  placeholder="Provide precise requirements. Mention file size parameters or filter behaviors if relevant to help our engineers optimize code faster..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Privacy agreement lock */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-850 flex items-start gap-2.5">
                <input
                  id="privacy-chk"
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-0.5 accent-orange-500 rounded cursor-pointer shrink-0"
                />
                <label htmlFor="privacy-chk" className="text-[10px] text-slate-500 dark:text-zinc-450 leading-normal cursor-pointer font-medium select-none">
                  Check this to confirm you understand that submissions are processed completely over SSL, matching our strict local on-device confidentiality ethos.
                </label>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-650 dark:hover:bg-orange-550 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-3xs cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Secure Packet</span>
              </button>

            </form>

            {/* The Right Side Quick Contact FAQ Card */}
            <div className="space-y-6">
              
              {/* Box 1: Team & Response times */}
              <div className="bg-white dark:bg-[#0c0c0e] border border-slate-200/80 dark:border-zinc-850/60 rounded-2xl p-5 shadow-3xs text-left space-y-4">
                <h4 className="text-xs font-bold text-slate-850 dark:text-zinc-100 uppercase tracking-wider font-display border-b border-slate-100 dark:border-zinc-850 pb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-500" /> Operational Status
                </h4>
                
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider block">AVERAGE SYSTEM RESPONSE</span>
                    <p className="font-extrabold text-slate-750 dark:text-zinc-250">✦ Within 4 Operational Hours</p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono tracking-wider block">SUPPORT REACH</span>
                    <p className="text-slate-550 dark:text-zinc-400 font-normal leading-relaxed">
                      All tickets are routed directly to tool design staff located in secure physical container networks. No third-party ticketing platforms interfere.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2: Secure Channel info */}
              <div className="bg-white dark:bg-[#0c0c0e] border border-slate-200/80 dark:border-zinc-850/60 rounded-2xl p-5 shadow-3xs text-left space-y-3">
                <h4 className="text-xs font-bold text-slate-805 dark:text-zinc-100 uppercase tracking-wider font-display">
                  Alternative Pathway
                </h4>
                <p className="text-xs text-slate-550 dark:text-zinc-400 leading-normal font-normal">
                  Prefer directly launching mail clients instead? Address our general mailbox route:
                </p>
                <a 
                  href="mailto:tooloraio386@gmail.com" 
                  className="block p-2.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-205 dark:border-zinc-850 select-all font-mono text-[10px] font-bold text-orange-600 dark:text-orange-400 text-center hover:underline"
                >
                  tooloraio386@gmail.com
                </a>
              </div>

            </div>

          </motion.div>
        ) : (
          /* HIGH-ESTHETIC SUCCESS TICKET RECAP SHEET */
          <motion.div
            key="success-ticket"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 sm:p-10 bg-white dark:bg-[#0c0c0e] border border-slate-200/85 dark:border-zinc-855/70 rounded-3xl shadow-lg max-w-2xl mx-auto space-y-6 text-center select-none"
          >
            <div className="mx-auto w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded-2xl border border-emerald-150 dark:border-emerald-900/20 shadow-3xs animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">SECURE DISPATCH CONFIRMED</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-zinc-50 tracking-tight font-display">
                Ticket Generated Successfully
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-450 max-w-md mx-auto leading-relaxed">
                Thank you. Your inquiry packet has been safely compiled, assigned a routing token, and sent securely to our development core team buffers.
              </p>
            </div>

            {/* Structured Ticket Receipt */}
            <div className="text-left bg-slate-50 dark:bg-zinc-950 rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-850 space-y-4 max-w-md mx-auto font-sans">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-850 pb-2">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">TICKET DATA SPEC</span>
                <span className="text-[9.5px] font-bold bg-orange-50 dark:bg-orange-950 text-orange-650 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30 px-2 py-0.5 rounded-md font-mono">
                  {submittedTicket.ticketId}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[10px] text-zinc-400 font-mono tracking-wider block">CONTACT</span>
                  <span className="col-span-2 font-bold text-slate-800 dark:text-zinc-200 truncate">{submittedTicket.name} ({submittedTicket.email})</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[10px] text-zinc-400 font-mono tracking-wider block">SUBJECT</span>
                  <span className="col-span-2 font-bold text-slate-800 dark:text-zinc-200 truncate">{submittedTicket.subject}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[10px] text-zinc-400 font-mono tracking-wider block">CATEGORY</span>
                  <span className="col-span-2 capitalize font-semibold text-slate-700 dark:text-zinc-350">{submittedTicket.category}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[10px] text-zinc-400 font-mono tracking-wider block">URGENCY</span>
                  <span className="col-span-2 uppercase font-black tracking-wider text-rose-500 text-[10px]">{submittedTicket.priority}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-dotted border-zinc-200 dark:border-zinc-850">
                  <span className="text-[10px] text-zinc-400 font-mono tracking-wider block">TIMESTAMP</span>
                  <span className="col-span-2 font-mono text-[10px] font-bold text-slate-500">{submittedTicket.dateString}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={handleStartNew}
                className="px-4 py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Submit Another Inquiry
              </button>
              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  setActiveToolId(null);
                  setShowBlog(false);
                  setShowAbout(false);
                  setShowContact(false);
                }}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-705 dark:text-zinc-300 border border-slate-205 dark:border-zinc-850 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Return Home
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
