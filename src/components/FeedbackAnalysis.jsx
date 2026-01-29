import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Download, 
  MessageSquare, 
  BarChart3, 
  Tag,
  User,
  Briefcase,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Area,
  AreaChart
} from 'recharts'; 
import { motion as Motion, AnimatePresence } from "framer-motion";

const FeedbackAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState('All');
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ITEMS_PER_LOAD = 4;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/all-feedback");
        const json = await res.json();

        // IMPORTANT: your API response has { feedback: [...] }
        setFeedbackData(json.feedback || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load feedback data");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const normalizeSentiment = (s) => {
    if (!s) return "Neutral";
    const val = s.toString().toLowerCase().trim();

    if (val.includes("pos")) return "Positive";
    if (val.includes("neg")) return "Negative";
    return "Neutral";
  };

  // --- DYNAMIC DATA PROCESSING ---
  const stats = useMemo(() => {
    const data = feedbackData.map(item => ({
      ...item,
      sentiment: normalizeSentiment(item.sentiment)
    }));

    // 1. Calculate Sentiments
    const pos = data.filter(i => i.sentiment === "Positive").length;
    const neu = data.filter(i => i.sentiment === "Neutral").length;
    const neg = data.filter(i => i.sentiment === "Negative").length;

    const serviceGroups = data.reduce((acc, curr) => {
      const service = curr.service || "Unknown";
      const sentiment = curr.sentiment;
      const confidence = typeof curr.confidence === "number" ? curr.confidence : 1;

      if (!acc[service]) {
        acc[service] = {
          name: service,
          score: 0,
          count: 0
        };
      }

      const weight =
        sentiment === "Positive" ? 1 :
        sentiment === "Neutral" ? 0.5 :
        -1;

      acc[service].score += weight * confidence;
      acc[service].count += 1;

      return acc;
    }, {});

    const ratings = Object.values(serviceGroups)
      .filter(s => s.count >= 3)
      .map(s => {
        const normalized = (s.score / s.count + 1) / 2;
        const rating = Math.max(0, Math.min(5, normalized * 5));
        return {
          question: s.name,
          rating: parseFloat(rating.toFixed(2)),
          count: s.count
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    // 🔥 FIXED TIMELINE LOGIC (Replacing .time with .date)
    const timeData = data.reduce((acc, curr) => {
      if (!curr.date) return acc;
      
      const dateObj = new Date(curr.date);
      // Check if date is valid before processing
      if (isNaN(dateObj.getTime())) return acc;

      // Extract hour and AM/PM for the timeline chart
      let hours = dateObj.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      const formattedHour = `${hours} ${ampm}`; 
      
      acc[formattedHour] = (acc[formattedHour] || 0) + 1;
      return acc;
    }, {});

    const timeline = Object.entries(timeData)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => {
        const parseTime = (h) => {
          let [num, p] = h.split(' ');
          let val = parseInt(num);
          if (p === 'PM' && val !== 12) val += 12;
          if (p === 'AM' && val === 12) val = 0;
          return val;
        };
        return parseTime(a.hour) - parseTime(b.hour);
      });

    return {
      sentimentArr: [
        { name: 'Positive', value: pos, color: '#10B981' },
        { name: 'Neutral', value: neu, color: '#F59E0B' },
        { name: 'Negative', value: neg, color: '#EF4444' },
      ],
      questionRatings: ratings,
      timeline: timeline,
      totalEntries: data.length,
      feedback: data
    };
  }, [feedbackData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-8 space-y-10 animate-pulse">

        {/* --- HEADER SKELETON --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-48 bg-slate-200 rounded-lg" />
          </div>
          <div className="h-12 w-40 bg-slate-200 rounded-2xl" />
        </div>

        {/* --- TOP VISUALS SKELETON --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Service Performance Bar Chart Skeleton */}
          <div className="lg:col-span-8 bg-slate-200 rounded-[3rem] h-112 relative" />

          {/* Sentiment Pie & Timeline Skeleton */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex-1 bg-slate-200 rounded-[3rem] h-56" />
            <div className="flex-1 bg-slate-200 rounded-[3rem] h-56" />
          </div>
        </div>

        {/* --- ACTION BAR SKELETON --- */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="h-12 w-full md:w-80 bg-slate-200 rounded-xl" />
          <div className="flex-1 md:w-auto flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 w-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>

        {/* --- FEEDBACK TABLE SKELETON --- */}
        <div className="overflow-y-auto max-h-[77vh]">
          <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden">

            {/* Table Header */}
            <div className="flex px-10 py-6 gap-6 border-b border-slate-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-32 bg-slate-200 rounded" />
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center px-10 py-6 gap-6">
                  <div className="h-10 w-10 bg-slate-200 rounded-xl" />
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-4 flex-1 bg-slate-200 rounded" />
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    );
  };

if (error) {
  return (
    <div className="flex items-center justify-center h-[60vh] text-rose-500 font-bold">
      {error}
    </div>
  );
}

  const feedbackList = Array.isArray(stats.feedback) ? stats.feedback : [];

    const filteredFeedback = feedbackList.filter(item => {
      const matchesSearch = 
        item.client?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.text?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesFilter = filter === 'All' || item.sentiment === filter;
      
      return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    const sortedFeedback = [...filteredFeedback].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    const visibleFeedbacks = sortedFeedback.slice(0, visibleCount);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10 animate-in fade-in duration-700 overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Feedback Analysis</h2>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            Comprehensive sentiment tracking and service performance metrics.
          </p>
        </div>
      </div>

      {/* --- TOP VISUALS (Now Dynamic) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Premium Service Performance Bar Chart */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-700 group relative overflow-hidden flex flex-col">
          
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/40 blur-[100px] rounded-full -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)]" />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Service Performance</h3>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">
                    Average Sentiment Intensity (1.0 — 5.0)
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 hover:bg-white hover:text-blue-600 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <BarChart3 size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full min-h-100 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={stats.questionRatings} 
                  margin={{ top: 0, right: 10, left: -30, bottom: 0 }}
                  barGap={12}
                >
                  <defs>
                    {/* Ultra-Smooth Gradients */}
                    <linearGradient id="barGradientPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="barGradientNeu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                    <linearGradient id="barGradientNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                    {/* Glass effect filter */}
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                      <feOffset dx="0" dy="4" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.1" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Very subtle grid lines to keep it clean */}
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" strokeOpacity={0.8} />
                  
                  <XAxis 
                    dataKey="question" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                    dy={15}
                    interval={0}
                  />
                  
                  <YAxis 
                    domain={[0, 5]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }}
                    ticks={[0, 1, 2, 3, 4, 5]}
                  />
                  
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', radius: 16 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Rank</p>
                            <p className="text-sm font-black text-slate-900 mb-2">{payload[0].payload.question}</p>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
                              <span className="text-lg font-black text-slate-900">{payload[0].value.toFixed(1)}</span>
                              <span className="text-[10px] font-bold text-slate-400">/ 5.0 Rating</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Bar 
                    dataKey="rating" 
                    radius={[20, 20, 20, 20]} 
                    barSize={40}
                    animationDuration={2000}
                    animationBegin={200}
                  >
                    {stats.questionRatings.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.rating >= 4 ? 'url(#barGradientPos)' : 
                          entry.rating >= 3 ? 'url(#barGradientNeu)' : 
                          'url(#barGradientNeg)'
                        } 
                        filter="url(#shadow)"
                        className="hover:brightness-110 transition-all duration-300"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sentiment Pie & Keywords */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex-1 bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col items-center group transition-all duration-500 hover:shadow-xl">
            <div className="flex justify-between w-full mb-2">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Sentiment Weight</h3>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>

            <div className="h-56 w-full relative">
              {/* Central Stat Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                  {stats.totalEntries > 0
                    ? Math.round(
                        (stats.sentimentArr.find(s => s.name === 'Positive')?.value / stats.totalEntries) * 100
                      )
                    : 0}%
                </span>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Positive</span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="piePos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                    <linearGradient id="pieNeu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                    <linearGradient id="pieNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#F87171" />
                    </linearGradient>
                  </defs>
                  <Pie 
                    data={stats.sentimentArr} 
                    innerRadius={65} 
                    outerRadius={85} 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                    cornerRadius={40} // Makes the ends of the segments rounded
                    startAngle={90}
                    endAngle={450}
                  >
                    {stats.sentimentArr.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#pie${entry.name.substring(0, 3)})`}
                        className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none" 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                            {payload[0].name}: {payload[0].value}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Modern Legend Pills */}
            <div className="grid grid-cols-3 gap-3 w-full mt-4">
              {stats.sentimentArr.map((s) => (
                <div 
                  key={s.name} 
                  className="relative overflow-hidden group/pill bg-white border border-slate-100 p-3 rounded-[1.25rem] transition-all duration-300 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1"
                >
                  {/* Subtle background glow that matches sentiment color */}
                  <div className={`absolute -right-2 -top-2 w-8 h-8 opacity-10 rounded-full blur-xl transition-opacity group-hover/pill:opacity-20 ${
                    s.name === 'Positive' ? 'bg-emerald-500' : s.name === 'Negative' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />

                  <div className="relative flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        s.name === 'Positive' ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 
                        s.name === 'Negative' ? 'bg-rose-500 shadow-[0_0_8px_#EF4444]' : 
                        'bg-amber-500 shadow-[0_0_8px_#F59E0B]'
                      }`} />
                      <span className="text-[13px] font-black text-slate-900 tabular-nums tracking-tighter">
                        {Math.round((s.value / stats.totalEntries) * 100)}%
                      </span>
                    </div>
                    
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {s.name}
                    </div>
                  </div>

                  {/* Progress line at the bottom of the pill */}
                  <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        s.name === 'Positive' ? 'bg-emerald-500' : 
                        s.name === 'Negative' ? 'bg-rose-500' : 
                        'bg-amber-500'
                      }`}
                      style={{ width: `${(s.value / stats.totalEntries) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Volume Timeline (Area Chart) */}
          <div className="flex-1 bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-blue-500/10 border border-slate-800">
            
            {/* Decorative Ambient Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BarChart3 size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none mb-1">Activity Monitor</h3>
                    <p className="text-sm font-bold text-slate-200">Feedback Volume</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Live Timeline</span>
                </div>
              </div>

              {/* Chart Area */}
              <div className="h-52 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 9, fontWeight: 800 }}
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl shadow-2xl">
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{payload[0].payload.hour}</p>
                              <p className="text-lg font-black text-white">{payload[0].value} <span className="text-[10px] text-blue-400 uppercase">Entries</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3B82F6" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorVolume)" 
                      animationDuration={2500}
                      strokeLinecap="round"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Footer Meta-Data */}
              <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">System Status</p>
                  <p className="text-[10px] font-bold text-slate-400 italic">
                    Capturing data across {stats.totalEntries} global points
                  </p>
                </div>
                
                {/* Dynamic Peak Chip */}
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Peak Hour</p>
                  <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                    {stats.timeline.length > 0 
                      ? [...stats.timeline].sort((a,b) => b.count - a.count)[0].hour 
                      : '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- UNIFIED FEEDBACK CONSOLE --- */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)]">
        
        {/* --- PREMIUM COMPACT HEADER & ACTION BAR --- */}
        <div className="relative p-6 lg:p-8 border-b border-slate-100/80 bg-linear-to-br from-white via-slate-50/20 to-white space-y-6">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-blue-500/15 to-transparent" />
          {/* --- ULTRA-PREMIUM COMPACT HEADER --- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
            {/* Left Section: Branding & Title */}
            <div className="relative space-y-3">
              {/* Minimalist Live Indicator */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-slate-900/2 backdrop-blur-md rounded-full border border-slate-200/60 shadow-xs group cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] group-hover:text-blue-600 transition-colors">
                  Live <span className="text-slate-300 mx-0.5 font-light">|</span> Console
                </span>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tightest leading-none">
                  Citizen <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-tr from-blue-700 via-blue-500 to-indigo-400">Feedback</span>
                    <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-blue-500/5 -skew-x-12 z-0"></span>
                  </span>
                </h3>
                <p className="text-[13px] font-medium text-slate-400/90 tracking-tight leading-relaxed flex items-center gap-2">
                  <span className="w-4 h-px bg-slate-200"></span>
                  Operational intelligence & service performance metrics.
                </p>
              </div>
            </div>

            {/* Right Section: Glassmorphic Stats Display */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100/40 backdrop-blur-xl rounded-4xl border border-white shadow-2xl shadow-slate-200/50">
              {/* Total Logs Card */}
              <div className="flex items-center gap-4 pl-5 pr-6 py-2.5 bg-white rounded-[1.6rem] shadow-sm border border-slate-100">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1">Insights</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-900 tabular-nums tracking-tighter">
                      {filteredFeedback.length.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Logs</span>
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex flex-col items-center justify-center px-5 py-2">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">System</span>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- ENHANCED ACTION BAR: SEARCH & INTELLIGENT FILTERS --- */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 pt-2">
            
            {/* Modern Search Concept */}
            <div className="relative group flex-1 md:flex-none md:w-80">
              {/* Subtle Outer Glow on Focus */}
              <div className="absolute -inset-1 bg-blue-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-md" />
              
              <div className="relative flex items-center bg-slate-100/50 backdrop-blur-sm border border-slate-200/60 rounded-xl transition-all duration-300 group-focus-within:bg-white group-focus-within:border-blue-500 group-focus-within:shadow-[0_0_20px_rgba(59,130,246,0.06)]">
                <Search className="ml-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={15} />
                <input 
                  type="text"
                  placeholder="Search citizen records..."
                  className="w-full bg-transparent pl-3 pr-4 py-2.5 text-[13px] font-semibold text-slate-700 focus:outline-none placeholder:text-slate-400/80 tracking-tight"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Keyboard Shortcut Indicator (Optional Detail) */}
                <div className="hidden sm:flex items-center gap-1 mr-3 px-1.5 py-0.5 border border-slate-200 rounded text-[9px] font-black text-slate-400 bg-white shadow-xs">
                  <span className="opacity-70">⌘</span>K
                </div>
              </div>
            </div>

            {/* --- PREMIUM SEGMENTED CONTROL WITH FLUID ANIMATION --- */}
            <div className="relative flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200/40 w-full md:w-auto overflow-hidden shadow-inner">
              {['All', 'Positive', 'Neutral', 'Negative'].map((type) => {
                const isActive = filter === type;
                
                // Premium color mapping for the text and dots
                const theme = {
                  All: 'text-blue-600',
                  Positive: 'text-emerald-600',
                  Neutral: 'text-amber-600',
                  Negative: 'text-rose-600',
                };

                const dotColors = {
                  All: 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]',
                  Positive: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
                  Neutral: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
                  Negative: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]',
                };

                return (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`relative flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-300 flex items-center justify-center gap-2 group/btn outline-none ${
                      isActive ? theme[type] : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {/* The Animated "Slider" Background */}
                    {isActive && (
                      <Motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-200/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Content remains on top of the moving pill */}
                    <span className="relative z-10 flex items-center gap-2">
                      {/* Animated Status Dot */}
                      <Motion.div 
                        animate={{ 
                          scale: isActive ? [1, 1.2, 1] : 1,
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                          isActive ? dotColors[type] : 'bg-slate-300 group-hover/btn:bg-slate-400'
                        }`} 
                      />
                      
                      <span className="relative">{type}</span>
                    </span>

                    {/* Subtle Indicator for Active State */}
                    <AnimatePresence>
                      {isActive && (
                        <Motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full opacity-40 z-20"
                        />
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div
            className="overflow-y-auto overflow-x-hidden max-h-[77vh]"
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

              if (scrollTop + clientHeight >= scrollHeight - 50) {
                setVisibleCount((prev) =>
                  Math.min(prev + 10, sortedFeedback.length)
                );
              }
            }}
          >
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-white">
                {/* Adjusted widths to handle the new content balance */}
                <th className="w-[30%] px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Citizen & Service</th>
                <th className="w-[12%] px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-100">Sentiment</th>
                <th className="w-[15%] px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-100">AI Confidence</th>
                <th className="w-[28%] px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Feedback Message</th>
                <th className="w-[15%] px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right border-b border-slate-100">Date Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleFeedbacks.length > 0 ? (
                visibleFeedbacks.map((item) => (
                  <tr key={item.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                    
                    {/* Citizen Details + Service Type Combined - Premium Modern Design */}
                    <td className="px-10 py-7 align-middle">
                      <div className="flex items-center gap-5 group/citizen">
                        {/* Profile Icon with Depth */}
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm z-10 relative">
                            <User size={20} strokeWidth={2.5} />
                          </div>
                          {/* Decorative background shadow element */}
                          <div className="absolute inset-0 bg-blue-100 rounded-2xl blur-0 group-hover:blur-md opacity-0 group-hover:opacity-40 transition-all duration-500" />
                        </div>

                        <div className='flex flex-col gap-2 overflow-hidden'>
                          {/* Name and ID Header */}
                          <div className="flex flex-col">
                            <div className="text-[13px] font-black text-slate-900 leading-none tracking-tight truncate group-hover:text-blue-700 transition-colors">
                              {item.client}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                System ID: <span className="text-slate-500 font-black">{item.id}</span>
                              </span>
                            </div>
                          </div>
                          
                          {/* Service Badge - Fixed for Long Text */}
                          <div className={`
                            inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 w-fit max-w-45
                            ${item.service.toLowerCase().includes('marriage') 
                              ? 'bg-blue-50/50 border-blue-200 text-blue-600 group-hover:bg-blue-100' 
                              : 'bg-slate-50 border-slate-200/60 text-slate-500 group-hover:bg-slate-100'}
                          `}>
                            <div className={`p-1 rounded-full ${item.service.toLowerCase().includes('marriage') ? 'bg-blue-200/50' : 'bg-slate-200/50'}`}>
                              <Briefcase size={10} strokeWidth={3} className="shrink-0" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-wider truncate">
                              {item.service}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sentiment Status - Premium Minimalist Dot Design */}
                    <td className="px-6 py-7 align-middle text-center">
                      <div className="flex justify-center">
                        <div className={`
                          relative inline-flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 group-hover:shadow-md
                          ${item.sentiment.toLowerCase() === 'positive' 
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' 
                            : item.sentiment.toLowerCase() === 'negative' 
                            ? 'bg-rose-50/80 border-rose-200 text-rose-800' 
                            : 'bg-amber-50/80 border-amber-200 text-amber-800'}
                        `}>
                          {/* Premium Multi-Layer Dot */}
                          <div className="relative flex items-center justify-center w-2.5 h-2.5">
                            {/* Outer Glow/Pulse Layer */}
                            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                              item.sentiment.toLowerCase() === 'positive' ? 'bg-emerald-500' : 
                              item.sentiment.toLowerCase() === 'negative' ? 'bg-rose-500' : 'bg-amber-500'
                            }`} />
                            
                            {/* Inner Solid Core */}
                            <div className={`relative w-1.5 h-1.5 rounded-full border shadow-sm ${
                              item.sentiment.toLowerCase() === 'positive' ? 'bg-emerald-500 border-emerald-400' : 
                              item.sentiment.toLowerCase() === 'negative' ? 'bg-rose-500 border-rose-400' : 'bg-amber-500 border-amber-400'
                            }`} />
                          </div>

                          {/* Label */}
                          <span className="text-[8px] font-black uppercase tracking-[0.15em] leading-none">
                            {item.sentiment}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* AI Confidence - Dynamic Color Intelligence */}
                    <td className="px-6 py-7 align-middle">
                      {(() => {
                        const score = parseFloat(item.confidence);
                        const colorClass = score >= 0.9 
                          ? 'from-emerald-500 to-teal-600' 
                          : score >= 0.7 
                          ? 'from-amber-400 to-orange-500' 
                          : 'from-rose-500 to-red-600';
                        
                        const textClass = score >= 0.9 
                          ? 'text-emerald-600' 
                          : score >= 0.7 
                          ? 'text-amber-600' 
                          : 'text-rose-600';

                        const bgShadow = score >= 0.9 
                          ? 'shadow-emerald-200/50' 
                          : score >= 0.7 
                          ? 'shadow-amber-200/50' 
                          : 'shadow-rose-200/50';

                        return (
                          <div className="flex flex-col items-center gap-2.5 group/conf">
                            <div className="flex items-center gap-3 w-full max-w-30">
                              {/* Progress Track */}
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner relative">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg bg-linear-to-r ${colorClass} ${bgShadow}`} 
                                  style={{ width: `${score * 100}%` }}
                                >
                                  {/* Glossy Overlay */}
                                  <div className="absolute inset-0 bg-white/20 h-[40%] top-0" />
                                </div>
                              </div>

                              {/* Numerical Percentage */}
                              <span className={`text-[12px] font-black tabular-nums tracking-tight transition-colors ${textClass}`}>
                                {(score * 100).toFixed(1)}<span className="text-[9px] ml-0.5 opacity-70">%</span>
                              </span>
                            </div>

                            {/* Status Label */}
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${score >= 0.9 ? 'bg-emerald-500' : score >= 0.7 ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                                Certainty Score
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Feedback Message - Enhanced Premium Version */}
                    <td className="px-6 py-7 align-middle">
                      <div className="relative pl-4 border-l-2 border-slate-100 group-hover:border-blue-400 transition-colors duration-500">
                        {/* Decorative Quotation Mark */}
                        <span className="absolute -top-2 -left-1 text-2xl text-slate-500 font-serif leading-none select-none group-hover:text-blue-100 transition-colors">
                          “
                        </span>
                        
                        <div className="flex flex-col gap-1">
                          <p className="text-[13px] text-slate-700 font-semibold leading-relaxed tracking-tight line-clamp-2 group-hover:line-clamp-none transition-all duration-500 ease-in-out">
                            {item.text}
                          </p>
                          
                          {/* Subtle "Read More" hint that only shows on hover if text is long */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="h-px w-4 bg-blue-400"></div>
                            <span className="text-[9px] font-black uppercase tracking-tighter text-blue-500">
                              Full Review
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time Logged - Premium Timeline Style */}
                    <td className="px-10 py-7 text-right align-middle">
                      <div className="flex flex-col items-end gap-2 group/date">
                        {/* Date Row: Bold & Primary */}
                        <div className="flex items-center gap-2 text-slate-900">
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] font-black tracking-tight leading-none">
                              {item.date ? formatDate(item.date).split(',')[0] : 'N/A'}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                              {item.date ? formatDate(item.date).split(',')[1] : ''}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover/date:bg-blue-600 group-hover/date:text-white transition-colors duration-300">
                            <Calendar size={14} className="shrink-0" />
                          </div>
                        </div>
                        
                        {/* Time Row: Modern Pill Badge */}
                        <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg group-hover/date:border-blue-200 group-hover/date:bg-white transition-all duration-300">
                          <Clock size={10} className="text-blue-500 shrink-0" />
                          <span className="text-[9px] font-black text-slate-600 tabular-nums tracking-wider uppercase">
                            {item.date ? formatDate(item.date).split(',').pop().trim() : '--:--'}
                          </span>
                        </div>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="py-32 text-center flex flex-col items-center justify-center">
                      <div className="w-24 h-24 bg-slate-50 rounded-4xl flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                        <Search size={40} className="text-slate-200" />
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Data Not Found</h4>
                      <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium">
                        We couldn't find any feedback matching your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {visibleCount < sortedFeedback.length && (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              {/* Animated Pulse Ring */}
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                <div className="relative w-3 h-3 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Processing Activity
                </span>
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-500 italic">
                    Fetching more insights...
                  </span>
                  <span className="h-px w-8 bg-slate-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalysis;