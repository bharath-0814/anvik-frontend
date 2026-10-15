import React, { useState } from 'react';
import { 
  Fingerprint, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (govtId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [govtId, setGovtId] = useState('LEA-IND-8812');
  const [password, setPassword] = useState('Cybercrime@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(govtId || 'LEA-IND-8812');
    }, 400);
  };

  const handleQuickDemoFill = () => {
    setGovtId('GOV-ANVIK-084');
    setPassword('Cybercrime@2026');
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#FBF9F4] text-slate-800 flex flex-col select-none overflow-x-hidden">
      {/* 1. TOP DARK RESTRICTED PORTAL BAR */}
      <div className="h-9 px-6 bg-[#06131A] text-white flex items-center justify-between text-[11px] font-medium border-b border-black shrink-0">
        <div className="flex items-center gap-2">
          {/* Indian Flag Emoji & Label */}
          <span className="text-sm">🇮🇳</span>
          <span className="font-bold tracking-wider text-slate-200 uppercase text-[10px] sm:text-[11px]">
            FINANCIAL CRIME INVESTIGATION PORTAL
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] tracking-wider">
          <Lock className="w-3 h-3 text-slate-400" />
          <span className="uppercase">RESTRICTED ACCESS</span>
        </div>
      </div>

      {/* 2. SUB-HEADER / BRAND IDENTITY BAR */}
      <div className="px-8 py-5 border-b border-[#E8E4D8] flex items-center justify-between bg-[#FBF9F4]/90 shrink-0">
        <div className="flex items-center gap-3.5">
          {/* Biometric Fingerprint Logo */}
          <div className="w-10 h-10 rounded-xl bg-[#007065]/10 border border-[#007065]/20 flex items-center justify-center text-[#007065]">
            <Fingerprint className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
              ANVIK
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1">
              FINANCIAL INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Secure Workspace Status Pill */}
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Secure workspace</span>
        </div>
      </div>

      {/* 3. MAIN CONTENT: 2-COLUMN HERO (FORM ON LEFT, CONSTELLATION GRAPH ON RIGHT) */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-8 md:py-12 gap-12 max-w-7xl mx-auto w-full">
        {/* LEFT COLUMN: HERO HEADINGS & LOGIN CREDENTIALS FORM */}
        <div className="w-full lg:w-[460px] flex flex-col justify-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#007065] mb-3">
            <span className="w-6 h-0.5 bg-[#007065]" />
            <span>CONNECT. INVESTIGATE. UNDERSTAND.</span>
          </div>

          {/* Huge Title */}
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            ANVIK
          </h1>

          {/* Subheading */}
          <div className="text-base sm:text-lg text-slate-500 font-normal leading-snug mb-8">
            <p>Every transaction tells a story.</p>
            <p>See how they connect.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Government ID Field */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Government ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Fingerprint className="w-4 h-4 stroke-[2]" />
                </div>
                <input
                  type="text"
                  required
                  value={govtId}
                  onChange={(e) => setGovtId(e.target.value)}
                  placeholder="Enter your Government ID"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDD8CA] bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007065] focus:ring-1 focus:ring-[#007065] transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 stroke-[2]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-20 py-3 rounded-xl border border-[#DDD8CA] bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007065] focus:ring-1 focus:ring-[#007065] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1.5 text-slate-500 hover:text-[#007065] text-xs font-semibold select-none transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-4 h-4 text-slate-500" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-slate-500" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#006352] hover:bg-[#005143] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
              >
                <span>{isSubmitting ? 'Authenticating credentials...' : 'Login to workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-fill Pill */}
          <div className="mt-4 pt-4 border-t border-[#E8E4D8] flex items-center justify-between text-xs text-slate-500">
            <span>LEA Demo Credentials:</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[#007065] font-semibold hover:underline cursor-pointer"
            >
              Fill LEA Demo Access
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: NETWORK CONSTELLATION GRAPHIC */}
        <div className="w-full lg:flex-1 max-w-lg aspect-square relative flex items-center justify-center">
          <svg viewBox="0 0 500 500" className="w-full h-full select-none">
            <defs>
              {/* Subtle background dot pattern */}
              <pattern id="login-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.1" fill="#E2DFD7" fillOpacity="0.45" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#login-dot-grid)" opacity="0.6" />

            {/* Connecting Constellation Network Lines */}
            <g stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" opacity="0.8">
              <line x1="250" y1="250" x2="160" y2="180" />
              <line x1="250" y1="250" x2="360" y2="160" />
              <line x1="250" y1="250" x2="380" y2="290" />
              <line x1="250" y1="250" x2="220" y2="380" />
              <line x1="250" y1="250" x2="130" y2="330" />
            </g>

            <g stroke="#94A3B8" strokeWidth="1.2">
              <line x1="160" y1="180" x2="130" y2="330" />
              <line x1="160" y1="180" x2="210" y2="100" />
              <line x1="210" y1="100" x2="360" y2="160" />
              <line x1="360" y1="160" x2="420" y2="230" />
              <line x1="420" y1="230" x2="380" y2="290" />
              <line x1="380" y1="290" x2="430" y2="380" />
              <line x1="380" y1="290" x2="220" y2="380" />
              <line x1="220" y1="380" x2="130" y2="330" />
            </g>

            {/* Orbit / Concentric Radar Rings around Central Intelligence Node */}
            <circle cx="290" cy="230" r="75" fill="none" stroke="#007065" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <circle cx="290" cy="230" r="110" fill="none" stroke="#007065" strokeWidth="0.8" opacity="0.15" />

            {/* Satellite Circular Nodes */}
            {/* Node 1: Left */}
            <circle cx="160" cy="180" r="8" fill="#FFFFFF" stroke="#007065" strokeWidth="2" />
            {/* Node 2: Top */}
            <circle cx="210" cy="100" r="6" fill="#FFFFFF" stroke="#007065" strokeWidth="1.5" />
            {/* Node 3: Top-Right */}
            <circle cx="360" cy="160" r="7" fill="#FFFFFF" stroke="#007065" strokeWidth="2" />
            {/* Node 4: Far Right */}
            <circle cx="420" cy="230" r="6" fill="#FFFFFF" stroke="#007065" strokeWidth="1.5" />
            {/* Node 5: Lower Right */}
            <circle cx="430" cy="380" r="6" fill="#FFFFFF" stroke="#007065" strokeWidth="1.5" />
            {/* Node 6: Bottom */}
            <circle cx="220" cy="380" r="7" fill="#FFFFFF" stroke="#007065" strokeWidth="1.5" />
            {/* Node 7: Bottom Left */}
            <circle cx="130" cy="330" r="6" fill="#FFFFFF" stroke="#007065" strokeWidth="1.5" />

            {/* Node: TRANSACTION (Left of Central) */}
            <g transform="translate(230, 220)">
              <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#007065" strokeWidth="2" />
              <text x="18" y="-3" fontSize="8" fontWeight="700" fill="#64748B" letterSpacing="0.08em">
                TRANSACTION
              </text>
            </g>

            {/* Central Node: INTELLIGENCE Shield Core */}
            <g transform="translate(290, 230)">
              {/* Outer Glow Halo */}
              <circle cx="0" cy="0" r="28" fill="#007065" fillOpacity="0.12" />
              <circle cx="0" cy="0" r="20" fill="#007065" />
              <g transform="translate(-8, -8)" className="text-white">
                <ShieldCheck className="w-4 h-4 stroke-[2.2] text-white" />
              </g>

              {/* Tag Label: INTELLIGENCE */}
              <text x="26" y="3" fontSize="8" fontWeight="700" fill="#64748B" letterSpacing="0.08em">
                INTELLIGENCE
              </text>
            </g>

            {/* Node: Amber Alert Node (CONNECTION) */}
            <g transform="translate(320, 340)">
              <circle cx="0" cy="0" r="7" fill="#D97706" stroke="#FEF3C7" strokeWidth="2" />
              <text x="14" y="3" fontSize="8" fontWeight="700" fill="#64748B" letterSpacing="0.08em">
                CONNECTION
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
