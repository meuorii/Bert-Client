import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added this
import { 
  Lock, Mail, Eye, EyeOff, ShieldCheck, 
  Loader2, Check, ArrowRight, ShieldAlert
} from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL');
  const [modalStatus, setModalStatus] = useState('idle'); 
  const [modalMessage, setModalMessage] = useState('');
  
  // Added missing formData state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    document.title = "Admin Login | LGU Iba";
  }, []);

  useEffect(() => {
    const statuses = ['SYSTEM SCAN', 'ENCRYPTING', 'OPERATIONAL'];
    let i = 0;
    const interval = setInterval(() => {
      setSystemStatus(statuses[i % statuses.length]);
      i++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handler to update the state as you type
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const closeModal = () => {
    setModalStatus('idle');
    setModalMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setModalStatus('loading');
    setModalMessage('Establishing secure connection...');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setModalStatus('success');
        setModalMessage('Access Granted. Redirecting to Core Dashboard...');
        localStorage.setItem('adminUser', JSON.stringify(result.data));
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setModalStatus('error');
        setModalMessage(result.message || 'Authorization Denied: Invalid Security Key');
      }
    } catch {
      setModalStatus('error');
      setModalMessage('Network Protocol Error: Cannot reach Iba-Secure-Node');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100/50 font-sans p-4 lg:p-0">

      {modalStatus !== 'idle' && (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-6">

        <div 
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl transition-opacity duration-700 animate-in fade-in" 
          onClick={modalStatus === 'error' ? closeModal : undefined} 
        />
        
        <div className={`relative w-full max-w-sm overflow-hidden rounded-[48px] bg-white/90 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white transition-all duration-500
          ${modalStatus === 'error' ? 'animate-shake' : 'animate-in zoom-in-95 slide-in-from-bottom-10 duration-500'}
        `}>
          
          <div className={`h-2 w-full transition-all duration-700 relative overflow-hidden ${
            modalStatus === 'loading' ? 'bg-slate-100' : 
            modalStatus === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`}>
            {modalStatus === 'loading' && (
              <div className="absolute inset-0 bg-linear-to-r from-blue-400 via-indigo-600 to-blue-400 bg-size[200%_100%] animate-shimmer" />
            )}
          </div>
          
          <div className="p-12">
            <div className="flex flex-col items-center text-center">
              

              <div className="relative mb-10">
                <div className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 opacity-40 ${
                  modalStatus === 'loading' ? 'bg-blue-400' : 
                  modalStatus === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                }`} />
                
                <div className={`relative z-10 w-28 h-28 flex items-center justify-center rounded-[35%] transition-all duration-700 border-2 shadow-2xl ${
                  modalStatus === 'loading' ? 'bg-white border-blue-100 text-blue-600' : 
                  modalStatus === 'success' ? 'bg-white border-emerald-100 text-emerald-600 scale-110' : 
                  'bg-white border-red-100 text-red-600'
                }`}>
                  
                  {modalStatus === 'loading' && (
                    <div className="relative flex items-center justify-center">
                      <Loader2 size={48} strokeWidth={1.5} className="animate-spin" />
                      <div className="absolute inset-0 border-b-2 border-blue-600 rounded-full animate-[spin_0.8s_linear_infinite]" />
                    </div>
                  )}

                  {modalStatus === 'success' && (
                    <div className="animate-in zoom-in-50 duration-500">
                      <ShieldCheck size={52} strokeWidth={1.5} />
                    </div>
                  )}

                  {modalStatus === 'error' && (
                    <div className="animate-in shake-x duration-500">
                      <ShieldAlert size={52} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>
              
              {/* TEXT SECTION: Using variable weights for premium feel */}
              <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                {modalStatus === 'loading' && <span className="flex gap-1">Validating<span className="animate-pulse">...</span></span>}
                {modalStatus === 'success' && <>Access <span className="font-light italic text-slate-400">Granted</span></>}
                {modalStatus === 'error' && <>Access <span className="font-light italic text-slate-400">Denied</span></>}
              </h3>
              
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-12 px-2 opacity-80 uppercase tracking-wider">
                {modalMessage}
              </p>

              {/* ACTION SECTION */}
              <div className="w-full">
                {modalStatus === 'error' && (
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); closeModal(); }}
                    className="w-full py-4.5 bg-slate-950 text-white text-[11px] font-black rounded-[20px] transition-all hover:bg-red-600 active:scale-95 shadow-2xl shadow-slate-900/20 tracking-[0.3em]"
                  >
                    RE-AUTHORIZE
                  </button>
                )}

                {modalStatus === 'loading' && (
                  <div className="flex items-center justify-center gap-3">
                    <div className="px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
                      <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase animate-pulse">
                        Scanning Identity
                      </span>
                    </div>
                  </div>
                )}

                {modalStatus === 'success' && (
                  <div className="space-y-4 w-full">
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full origin-left animate-[loading-bar_2s_ease-in-out]" />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] tracking-[0.25em]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      ENTRY AUTHORIZED
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
      
      {/* MODERN PREMIUM BACKGROUND ENGINE */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#f8fafc]">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute -top-[15%] -right-[5%] w-[60%] h-[60%] rounded-full 
          bg-linear-to-br from-blue-400/20 to-indigo-500/10 blur-[140px] animate-pulse duration-[10s]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full 
          bg-linear-to-tr from-slate-300/30 to-blue-200/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px 
          bg-linear-to-r from-transparent via-blue-500/10 to-transparent rotate-35 scale-150" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row shadow-[0_48px_100px_-20px_rgba(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden bg-white/90 backdrop-blur-2xl border border-white/20">
  
        {/* LEFT PANEL: The "Command Center" */}
        <div className="lg:w-[40%] p-10 lg:p-14 bg-[#020617] relative overflow-hidden flex flex-col justify-between min-h-150">
          {/* Animated Mesh Gradient Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[100px]" />
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-20">
              <div className="relative">
                {/* Multi-layered Logo Ring */}
                <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-cyan-400 blur-md opacity-40 animate-spin-slow" />
                <div className="relative p-0.5 rounded-2xl bg-linear-to-b from-white/20 to-transparent border border-white/10 backdrop-blur-md">
                  <div className="bg-[#020617] rounded-[14px] p-2">
                    <img 
                      src="/lgu-iba-logo.jpg" 
                      alt="LGU Iba"
                      className="w-12 h-12 object-contain rounded-full"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=IBA"; }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight italic">
                  LGU <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">IBA</span>
                </h1>
                <p className="text-[10px] text-blue-400/80 font-black tracking-[0.3em] uppercase">
                  Systems Administration
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-medium text-white leading-[1.1] tracking-tight">
                Municipal <br /> 
                <span className="font-light italic text-slate-400">Intelligence</span>
              </h2>
              <div className="h-1 w-12 bg-linear-to-r from-blue-500 to-transparent rounded-full" />
              <p className="text-slate-400 text-sm leading-relaxed max-w-70 font-light">
                Accessing the centralized governance engine for real-time sentiment and analytics.
              </p>
            </div>
          </div>

          {/* System Status Bento Card */}
          <div className="relative z-10">
            <div className="p-6 rounded-3xl bg-white/3 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Protocol Active</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400">{systemStatus}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] text-slate-500 uppercase font-bold">
                  <span>Neural Link</span>
                  <span>98.2%</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-linear-to-r from-blue-600 to-cyan-400 h-full w-[98%] transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: The Formal Portal */}
        <div className="lg:w-[60%] p-8 lg:p-20 bg-slate-50/50 backdrop-blur-xl flex flex-col justify-center relative">
          <div className="max-w-md mx-auto w-full relative z-10">
            <div className="mb-12">
              <h3 className="text-3xl font-semibold text-slate-900 tracking-tight">Welcome Back</h3>
              <p className="text-slate-500 mt-2 text-sm font-light">Authenticated access required for Core Admin.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Administrator Email</label>
                <div className="group relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    name="email"
                    type="email" 
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none placeholder:text-slate-300"
                    placeholder="Enter your official gov email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Security Key</label>
                <div className="group relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-slate-900 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none placeholder:text-slate-300"
                    placeholder="Enter authorization key"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer h-4 w-4 opacity-0 absolute cursor-pointer" />
                    <div className="h-4 w-4 bg-white border border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all" />
                    <Check size={12} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform left-0.5" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium group-hover:text-slate-800 transition-colors">Trust this device</span>
                </label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline">Reset Credentials</button>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-[#0F172A] hover:bg-blue-600 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl shadow-slate-200 hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                Authorize Access
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-12 flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <ShieldCheck className="text-blue-600" size={20} />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                <span className="text-blue-700 font-bold">End-to-End Encryption Active.</span> All administrative actions are recorded under the Municipal Security Act of 2024.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;