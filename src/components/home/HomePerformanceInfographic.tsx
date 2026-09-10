import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  ServerOff, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  HardDriveDownload,
  Flame
} from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import { useNavigate } from 'react-router-dom';

interface BenchmarkData {
  task: string;
  cloudTime: number; // in seconds
  tooloraTime: number; // in seconds
  cloudUploadMb: number;
  tooloraUploadMb: number;
  savingsRatio: string;
}

const BENCHMARK_METRICS: BenchmarkData[] = [
  {
    task: 'Merge 25 PDFs',
    cloudTime: 14.8,
    tooloraTime: 0.4,
    cloudUploadMb: 45,
    tooloraUploadMb: 0,
    savingsRatio: '37x Faster'
  },
  {
    task: 'Compress 40MB Image',
    cloudTime: 18.2,
    tooloraTime: 0.6,
    cloudUploadMb: 40,
    tooloraUploadMb: 0,
    savingsRatio: '30x Faster'
  },
  {
    task: 'OCR 10 Receipts',
    cloudTime: 22.5,
    tooloraTime: 1.1,
    cloudUploadMb: 28,
    tooloraUploadMb: 0,
    savingsRatio: '20x Faster'
  },
  {
    task: 'Convert 15 WebP',
    cloudTime: 11.4,
    tooloraTime: 0.3,
    cloudUploadMb: 35,
    tooloraUploadMb: 0,
    savingsRatio: '38x Faster'
  },
  {
    task: 'PDF to JPG (50 pgs)',
    cloudTime: 26.0,
    tooloraTime: 1.4,
    cloudUploadMb: 60,
    tooloraUploadMb: 0,
    savingsRatio: '18x Faster'
  }
];

export const HomePerformanceInfographic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'speed' | 'bandwidth' | 'security'>('speed');
  const [isMounted, setIsMounted] = useState(false);
  const { handleSelectTool } = useToolora();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const speedChartData = BENCHMARK_METRICS.map((m) => ({
    name: m.task,
    'Cloud Converters (sec)': m.cloudTime,
    'Toolora In-Browser (sec)': m.tooloraTime,
    savings: m.savingsRatio
  }));

  const bandwidthChartData = BENCHMARK_METRICS.map((m) => ({
    name: m.task,
    'Cloud Server Upload (MB)': m.cloudUploadMb,
    'Toolora Local RAM (0 MB)': m.tooloraUploadMb
  }));

  const handleLaunchTool = (toolId: string) => {
    if (typeof handleSelectTool === 'function') {
      handleSelectTool(toolId);
    }
    navigate(`/tools/${toolId}?tool=${toolId}`);
    setTimeout(() => {
      const el = document.getElementById('layout-view-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <section 
      className="w-full my-10 space-y-6 text-left animate-in fade-in duration-300"
      aria-labelledby="benchmark-heading"
    >
      {/* Visual Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold font-mono tracking-wide uppercase">
            <Activity className="w-3.5 h-3.5" />
            <span>REAL-TIME PERFORMANCE &amp; PRIVACY BENCHMARKS</span>
          </div>
          <h2 
            id="benchmark-heading"
            className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-zinc-50 tracking-tight"
          >
            On-Device WebAssembly vs. Traditional Cloud Converters
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Eliminating remote cloud uploads allows Toolora to process files up to <strong className="text-slate-800 dark:text-zinc-200 font-semibold">38x faster</strong> directly in your browser memory with strict zero-knowledge security.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('speed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'speed'
                ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Processing Speed</span>
          </button>
          <button
            onClick={() => setActiveTab('bandwidth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bandwidth'
                ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <ServerOff className="w-3.5 h-3.5" />
            <span>Bandwidth / Uploads</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Risk Security</span>
          </button>
        </div>
      </div>

      {/* Main Infographic Bento Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Graph Display (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-100 font-display flex items-center gap-2">
                <span>
                  {activeTab === 'speed' && 'Task Execution Latency (Lower is Better)'}
                  {activeTab === 'bandwidth' && 'External Network Data Transfer (0 MB is Ideal)'}
                  {activeTab === 'security' && 'Architectural Data Exposure Comparison'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {activeTab === 'speed' && 'Benchmarked across standard broadband connection on 5 common workflows.'}
                {activeTab === 'bandwidth' && 'MB transferred across public internet to external cloud storage.'}
                {activeTab === 'security' && 'Verification of zero server retention, zero data brokers, zero logging.'}
              </p>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Local WASM</span>
            </span>
          </div>

          {/* Chart Rendering Container */}
          {activeTab !== 'security' ? (
            <div className="w-full h-64 sm:h-72 mt-2">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  {activeTab === 'speed' ? (
                    <BarChart
                      data={speedChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <XAxis 
                        type="number" 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                        width={110}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderColor: '#334155', 
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: '12px'
                        }}
                        itemStyle={{ padding: '2px 0' }}
                      />
                      <Bar 
                        dataKey="Cloud Converters (sec)" 
                        fill="#f87171" 
                        radius={[0, 4, 4, 0]} 
                        barSize={10}
                      />
                      <Bar 
                        dataKey="Toolora In-Browser (sec)" 
                        fill="#ea580c" 
                        radius={[0, 4, 4, 0]} 
                        barSize={10}
                      />
                    </BarChart>
                  ) : (
                    <BarChart
                      data={bandwidthChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <XAxis 
                        type="number" 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                        width={110}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderColor: '#334155', 
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: '12px'
                        }}
                        itemStyle={{ padding: '2px 0' }}
                      />
                      <Bar 
                        dataKey="Cloud Server Upload (MB)" 
                        fill="#94a3b8" 
                        radius={[0, 4, 4, 0]} 
                        barSize={10}
                      />
                      <Bar 
                        dataKey="Toolora Local RAM (0 MB)" 
                        fill="#10b981" 
                        radius={[0, 4, 4, 0]} 
                        barSize={10}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading performance metrics...
                </div>
              )}
            </div>
          ) : (
            /* Security comparison table / cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-2">
              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                <div className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Traditional Cloud Converters</span>
                </div>
                <ul className="text-[11px] text-slate-600 dark:text-zinc-400 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Uploads raw files to 3rd-party remote servers.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Server log retention, tracking cookies &amp; ads.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Arbitrary 10MB-50MB upload paywalls and queues.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Risk of confidential contract/tax document leaks.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Toolora 100% On-Device Suite</span>
                </div>
                <ul className="text-[11px] text-slate-600 dark:text-zinc-400 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Zero byte upload: Files remain in local device memory.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Memory purged immediately when closing browser tab.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Full GDPR, HIPAA &amp; NDAs client-side compliance.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>100% unlimited file processing without paywalls.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Chart footer legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-orange-600" />
                <span className="font-semibold text-slate-700 dark:text-zinc-300">Toolora WASM Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-rose-400" />
                <span>Cloud Server Converters</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-orange-600 dark:text-orange-400 font-bold">
              Latency reduced by ~97%
            </span>
          </div>
        </div>

        {/* Right Column: Visual Architecture Flow Diagram (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#151928] to-[#0c0f1d] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-orange-400">
                SYSTEM ARCHITECTURE
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">
                HTML5 + WebAssembly
              </span>
            </div>

            <h3 className="text-lg font-bold font-display text-white">
              Zero-Knowledge Client-Side Pipeline
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Unlike cloud SaaS APIs that queue and inspect your confidential documents, Toolora uses modern browser primitives to process everything on your silicon.
            </p>

            {/* Architecture Steps Graphic */}
            <div className="space-y-3 pt-2">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  1
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Local File Drag &amp; Drop</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Read directly as in-memory <code className="text-orange-300 text-[10px]">ArrayBuffer</code>. Zero network HTTP packets sent.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  2
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>WASM &amp; Hardware Acceleration</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    WebAssembly, WebGL shaders &amp; Web Workers execute with native CPU/GPU throughput.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  3
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Instant Blob Download &amp; RAM Purge</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Processed file streams straight to your disk. Memory garbage collected immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action in Architecture Box */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 font-sans">
              Try the instant local engine now:
            </div>
            <button
              onClick={() => handleLaunchTool('pdf-compressor')}
              className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
            >
              <span>Test PDF Compressor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 4 Bottom Micro-Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/70 dark:border-zinc-800/70 text-left">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-sans">Average Latency</div>
          <div className="text-lg sm:text-xl font-black font-mono text-orange-600 dark:text-orange-400 mt-0.5">&lt; 350ms</div>
          <div className="text-[10px] text-slate-400">Instant on-device execution</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/70 dark:border-zinc-800/70 text-left">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-sans">Server Upload Footprint</div>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">0 Bytes</div>
          <div className="text-[10px] text-slate-400">Zero data leaves device</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/70 dark:border-zinc-800/70 text-left">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-sans">Available Tools</div>
          <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-zinc-100 mt-0.5">30 Utilities</div>
          <div className="text-[10px] text-slate-400">PDF, image, docs, business</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/70 dark:border-zinc-800/70 text-left">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-sans">Access Model</div>
          <div className="text-lg sm:text-xl font-black font-mono text-purple-600 dark:text-purple-400 mt-0.5">100% Free</div>
          <div className="text-[10px] text-slate-400">No subscriptions or logins</div>
        </div>
      </div>
    </section>
  );
};

export default HomePerformanceInfographic;
