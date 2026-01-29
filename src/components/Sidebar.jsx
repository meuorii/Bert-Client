import React, { useState } from "react"; // Added useState
import { useNavigate } from "react-router-dom"; 
import {
  LayoutDashboard,
  Search,
  BarChart2,
  BrainCircuit,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Loader2 // Added for the modal icon
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  // State to manage modal visibility
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const adminData = JSON.parse(localStorage.getItem("adminUser")) || {
    fullname: "Admin User",
    email: "admin@iba.gov.ph",
  };

  const menuItems = [
    {
      id: "overview",
      name: "Dashboard Overview",
      icon: <LayoutDashboard size={20} />,
      description: "System-wide summary",
    },
    { 
      id: 'analysis', 
      name: 'Feedback Analysis', 
      icon: <Search size={20} />,
      description: 'BERT sentiment deep-dive'
    },
    {
      id: "service",
      name: "Service Performance",
      icon: <BarChart2 size={20} />,
      description: "Department rankings",
    },
    {
      id: "ai",
      name: "AI Insights",
      icon: <BrainCircuit size={20} />,
      description: "Recommendations Agent",
    },
  ];

  const handleSignOut = () => {
      setIsExiting(true); // Trigger the success/loading state
      setTimeout(() => {
        localStorage.removeItem("adminUser");
        navigate("/login");
      }, 2000);
    };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-50">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex flex-col items-center text-center group">
            <div className="relative mb-4">
              <div className="absolute -inset-2 bg-blue-600/20 rounded-full blur-xl group-hover:bg-blue-600/30 transition duration-500 opacity-70"></div>
              <div className="relative w-24 h-24 rounded-full border-2 border-slate-700 p-1 bg-slate-900 group-hover:border-blue-500 transition-colors duration-500 overflow-hidden">
                <img
                  src="/lgu-iba-logo.jpg"
                  alt="LGU Iba Logo"
                  className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <h1 className="text-white font-black text-sm leading-tight tracking-[0.05em] uppercase">
                Municipality of Iba
              </h1>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-tight">
                Local Government Service Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`}>
                  {item.icon}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className={`text-[10px] ${activeTab === item.id ? "text-blue-100" : "text-slate-500"}`}>
                    {item.description}
                  </p>
                </div>
              </div>
              {activeTab === item.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>

        {/* Footer / User Profile & Logout */}
        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
              <span className="text-xs font-bold text-blue-400">
                {adminData.fullname.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{adminData.fullname}</p>
              <p className="text-xs text-slate-500 truncate">{adminData.email}</p>
            </div>
          </div>

          <button 
            onClick={() => setShowLogoutModal(true)} // Open modal instead of logging out
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          {/* High-End Glass Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-700"
            onClick={() => !isExiting && setShowLogoutModal(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] w-full max-w-105 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out">
            
            {/* Decorative Top Gradient Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-1000 ${isExiting ? 'bg-emerald-500' : 'bg-red-500'}`} />

            <div className="p-10 pt-12">
              {!isExiting ? (
                /* --- CONFIRMATION STATE --- */
                <div className="flex flex-col items-center">
                  {/* Elegant Icon Presentation */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-red-500/10 rounded-4xl blur-2xl animate-pulse"></div>
                    <div className="relative w-24 h-24 rounded-4xl bg-white border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center group">
                      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <LogOut className="text-red-500" size={32} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  {/* Typography Section */}
                  <div className="text-center space-y-3 mb-10">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                      Sign Out
                    </h3>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed px-4">
                      Are you sure you want to end your session?
                    </p>
                  </div>
                  
                  {/* Action Buttons: High-Contrast Layout */}
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={handleSignOut}
                      className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-all duration-300 active:scale-[0.97] shadow-2xl shadow-slate-900/20"
                    >
                      Sign Out
                    </button>
                    
                    <button
                      onClick={() => setShowLogoutModal(false)}
                      className="w-full py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-400 font-semibold text-base transition-all duration-300 border border-transparent hover:border-slate-100"
                    >
                      Stay Logged In
                    </button>
                  </div>
                </div>
              ) : (
                /* --- SUCCESS EXIT STATE --- */
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="relative mb-10">
                    {/* Background Glows */}
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                    
                    {/* Main Circle Container */}
                    <div className="relative w-28 h-28 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(16,185,129,0.2)]">
                      
                      {/* Animated SVG Checkmark */}
                      <svg 
                        className="w-16 h-16 text-emerald-500" 
                        viewBox="0 0 52 52" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle 
                          className="opacity-10"
                          cx="26" cy="26" r="25" 
                          fill="currentColor" 
                        />
                        <path 
                          className="checkmark-path"
                          d="M14 27l7.5 7.5L38 18" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{
                            strokeDasharray: 100,
                            strokeDashoffset: 100,
                            animation: 'checkmark 0.8s ease-out forwards 0.2s'
                          }}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                        Success
                      </h3>
                      <p className="text-slate-400 font-medium">
                        Session closed securely.
                      </p>
                    </div>
                    
                    {/* Redirecting Badge */}
                    <div className="inline-flex items-center gap-3 py-2.5 px-6 bg-slate-950 rounded-full shadow-lg shadow-slate-200">
                      <Loader2 className="text-white animate-spin" size={16} strokeWidth={3} />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                        Redirecting
                      </span>
                    </div>
                  </div>

                  {/* Injected CSS for the Animation */}
                  <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes checkmark {
                      to {
                        stroke-dashoffset: 0;
                      }
                    }
                  `}} />
                </div>
              )}
            </div>

            {/* Premium Institutional Footer */}
            <div className="bg-slate-50/50 py-6 border-t border-slate-100 flex flex-col items-center gap-1">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                Municipality of Iba
              </p>
              <p className="text-[8px] text-slate-300 font-medium">
                Local Government Service Portal • v2.0
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;