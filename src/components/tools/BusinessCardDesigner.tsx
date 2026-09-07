import React, { useState } from 'react';

export default function BusinessCardDesigner() {
  const [name, setName] = useState('Ali Hamza');
  const [role, setRole] = useState('Founder & Full-Stack Architect');
  const [email, setEmail] = useState('contact@toolora.world');
  const [phone, setPhone] = useState('+1 (555) 349-2810');
  const [company, setCompany] = useState('Toolora Inc.');

  return (
    <div className="space-y-5 max-w-2xl text-left">
      <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
        Business Card Designer
      </h3>
      <p className="text-xs text-slate-500 dark:text-zinc-400">
        Design elegant business cards with live rendering and print directly from your browser.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ['Full Name', name, setName],
          ['Job Title', role, setRole],
          ['Email Address', email, setEmail],
          ['Phone Number', phone, setPhone],
          ['Company / Brand', company, setCompany],
        ].map(([label, val, setter]) => (
          <div key={label as string}>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              {label as string}
            </span>
            <input
              type="text"
              value={val as string}
              onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
              style={{ fontSize: '16px' }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] text-sm text-slate-800 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-orange-500/30 transition"
            />
          </div>
        ))}
      </div>

      <div className="border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] rounded-2xl p-5 flex items-center justify-center min-h-[250px]">
        <div
          className="rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden text-left bg-[#0F172A] border border-[#1E293B]"
          style={{ width: '360px', height: '200px', flexShrink: 0 }}
        >
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl bg-orange-500/20" />
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-base font-black text-white leading-tight">
                {name}
              </h4>
              <p className="text-[10px] text-orange-300 tracking-wide mt-0.5 font-bold uppercase">
                {role}
              </p>
              <p className="text-[9px] text-zinc-400 font-medium">
                {company}
              </p>
            </div>
            <span className="text-xs text-white font-black w-7 h-7 rounded-lg inline-flex items-center justify-center text-[10px] bg-orange-600 shadow-md">
              {company.charAt(0) || 'T'}
            </span>
          </div>
          <div className="border-t border-zinc-800/80 pt-3 space-y-0.5 text-[9px] text-zinc-300 font-mono">
            <p>✉ {email}</p>
            <p>☎ {phone}</p>
            <p className="text-orange-400 uppercase tracking-widest text-[7px] font-bold mt-1">
              Verified Sandbox Asset • Toolora.world
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="w-full min-h-[44px] py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-[0.98] shadow-sm"
      >
        Print Card Layout (3.5" x 2")
      </button>
    </div>
  );
}
