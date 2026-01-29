import React from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  History, 
  Settings2, 
  Calendar,
  ChevronRight,
  Archive,
  Share2,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Reports = () => {
  // Mock Data for Historical Trends
  const historicalData = [
    { month: 'Jul', score: 3.8 },
    { month: 'Aug', score: 4.0 },
    { month: 'Sep', score: 3.9 },
    { month: 'Oct', score: 4.2 },
    { month: 'Nov', score: 4.1 },
    { month: 'Dec', score: 4.4 },
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Satisfaction Report', type: 'PDF', date: 'Jan 01, 2026', size: '2.4 MB' },
    { id: 2, name: 'Q4 Sentiment Analysis Log', type: 'Excel', date: 'Dec 31, 2025', size: '1.8 MB' },
    { id: 3, name: 'Service Performance Summary', type: 'PDF', date: 'Dec 15, 2025', size: '3.1 MB' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10 animate-in fade-in duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Reports</h2>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Archive size={18} className="text-blue-600" />
            Official records and documentation for formal decision-making.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-2xl text-sm font-black text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Settings2 size={18} /> Generate Custom Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- CUSTOM REPORT GENERATOR PANEL --- */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Report Configuration</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase">Date Range</label>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    Last 90 Days
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase">Include Metrics</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Sentiment Score', 'Response Volume', 'Service Ratings'].map((metric) => (
                    <label key={metric} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                  <FileText size={16} /> Export as PDF
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                  <FileSpreadsheet size={16} className="text-green-600" /> Export as CSV
                </button>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <Clock className="absolute -right-4 -bottom-4 text-white/10" size={120} />
            <h4 className="text-lg font-black mb-2">Auto-Archive</h4>
            <p className="text-sm text-blue-100 leading-relaxed font-medium">
              Systems reports are automatically archived on the 1st of every month at 00:00 UTC.
            </p>
          </div>
        </div>

        {/* --- HISTORICAL DATA & FILE LIST --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Historical Trend Chart */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Historical Quality Index</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Satisfaction Trends (6 Months)</p>
              </div>
              <History className="text-slate-300" size={24} />
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide domain={[0, 5]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Reports List */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-lg font-bold text-slate-900">Recent Official Records</h3>
              <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View Archive</button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentReports.map((file) => (
                <div key={file.id} className="p-8 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl shadow-sm ${file.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                      {file.type === 'PDF' ? <FileText size={24} /> : <FileSpreadsheet size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm mb-1">{file.name}</h4>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                        <span>{file.date}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{file.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all">
                      <Share2 size={18} />
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Reports;