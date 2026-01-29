import { useState, useEffect } from "react";
import {
  Smile,
  Frown,
  TrendingUp,
  Activity,
  BarChart2,
  Info,
  ClipboardList,
  MessageSquare,
  Download,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import axios from "axios";

// --- 2. ICON HELPER ---
const getIcon = (name, size = 24) => {
  const icons = {
    Info: <Info size={size} />,
    ClipboardList: <ClipboardList size={size} />,
    ClipboardCheck: <ClipboardList size={size} />, // Fallback to ClipboardList
    Frown: <Frown size={size} />,
    MessageSquare: <MessageSquare size={size} />,
    BarChart: <BarChart2 size={size} />, // Mapping 'BarChart' to BarChart2
    Smile: <Smile size={size} />,
    TrendingUp: <TrendingUp size={size} />,
  };
  return icons[name] || <Activity size={size} />;
};

const KPICard = ({
  title,
  value,
  total,
  trend,
  iconName,
  variant,
  statusLabel,
  onSentimentSelect,
  isSentimentCard = false,
  activeSentiment, 
}) => {
  const colors = {
    green: "bg-green-50 text-green-600 ring-green-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    red: "bg-red-50 text-red-600 ring-red-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
  };

  const isPositive = trend.includes("+") || ["Moderate", "Stable", "Improving", "Optimal"].includes(trend);
  const trendColor = isPositive ? "bg-green-100/50 text-green-700" : "bg-red-100/50 text-red-700";

  return (
    <div className="group bg-white p-6 sm:p-7 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden relative flex flex-col justify-between min-h-60">
      
      {/* 1. Header & Icon Section */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ring-1 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${colors[variant] || colors.blue}`}>
            {getIcon(iconName, 28)}
          </div>
          
          <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm border border-white/50 ${trendColor}`}>
            {trend}
          </div>
        </div>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
          {title}
        </p>
        
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
            {value}
          </span>
          {total && (
            <span className="text-sm font-bold text-slate-300 tabular-nums">{total}</span>
          )}
        </div>
      </div>

      {/* 2. Sentiment Controls Section (Premium Layout) */}
      <div className="relative z-10 mt-6">
        {isSentimentCard ? (
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter Analysis</span>
                <span className="h-px flex-1 bg-slate-100 ml-3"></span>
             </div>
             
             <div className="grid grid-cols-3 gap-2">
            {["positive", "neutral", "negative"].map((type) => {
              const isActive = activeSentiment === type;
              
              // Dynamic Styles base sa State
              const typeColors = {
                positive: isActive 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100",
                neutral: isActive 
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-200" 
                  : "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100",
                negative: isActive 
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-200" 
                  : "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100",
              };

              return (
                <button
                  key={type}
                  onClick={() => onSentimentSelect(type)}
                  className={`
                    relative py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all duration-300 border
                    ${typeColors[type]}
                    ${isActive ? '-translate-y-0.5 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}
                  `}
                >
                  {type}
                </button>
              );
            })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {statusLabel || "Performance"}
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* 3. Aesthetic Background Glow */}
      <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-20 transition-colors duration-500 
        ${variant === 'green' ? 'bg-emerald-400' : variant === 'red' ? 'bg-rose-400' : 'bg-blue-400'} 
        group-hover:opacity-40`} 
      />
    </div>
  );
};

// --- 4. MAIN COMPONENT ---
const AdminOverview = () => {
  const [activeFilter, setActiveFilter] = useState("1 Daily");
  const [dashboardDatabase, setDashboardDatabase] = useState({});
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSentiment, setSelectedSentiment] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, feedbackRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/dashboard"),
          axios.get("http://127.0.0.1:5000/api/recent-feedback"),
        ]);

        setDashboardDatabase(dashRes.data);
        setFeedbackData(feedbackRes.data.feedback || feedbackRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to sync system data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-8 space-y-10">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center animate-pulse">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-40 bg-slate-200 rounded-lg" />
          </div>
          <div className="h-12 w-48 bg-slate-200 rounded-2xl" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-200 rounded-4xl animate-pulse"
            />
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 h-96 bg-slate-200 rounded-[2.5rem] animate-pulse" />
          <div className="col-span-8 h-96 bg-slate-200 rounded-[2.5rem] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-3xl border border-red-100 mb-4">
          <Activity size={40} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
          System Offline
        </h2>
        <p className="text-slate-500 text-sm max-w-xs mb-6 font-medium">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const currentView = dashboardDatabase[activeFilter];
  if (!currentView) return null;

  const performanceData = Object.entries(currentView.averages).map(
    ([name, score]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      score: score,
      color: currentView.strong_dimensions.includes(name)
        ? "#10B981"
        : "#EF4444",
    }),
  );

  const goodCount = performanceData.filter((item) => item.score >= 3.0).length;
  const poorCount = performanceData.filter((item) => item.score < 3.0).length;

  const awarenessTrend = [
    { time: "CC1", score: currentView.charter_awareness.cc1 },
    { time: "CC2", score: currentView.charter_awareness.cc2 },
    { time: "CC3", score: currentView.charter_awareness.cc3 },
  ];

  const filteredFeedback =
    selectedSentiment === "all"
      ? feedbackData
      : feedbackData.filter(
          (item) =>
            item.sentiment?.toLowerCase() === selectedSentiment.toLowerCase()
        );

  const handleSentimentSelect = (type) => {
    const newSentiment = selectedSentiment === type ? "all" : type;
      setSelectedSentiment(newSentiment);

    const tableSection = document.getElementById('feedback');
    if (tableSection) {
      tableSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 overflow-x-hidden">
      {/* Main Container - Matched max-width and vertical padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10 animate-in fade-in duration-700">
        {/* --- HEADER & FILTERS --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              System Dashboard
            </h2>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              Showing analysis for:{" "}
              <span className="text-blue-600 font-bold">{activeFilter}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Time Filter Pill - Styled like the buttons in FeedbackAnalysis */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              {["1 Daily", "7 Weekly", "30 Monthly"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeFilter === filter
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentView.kpi.map((kpi) => (
            <KPICard
              key={kpi.id}
              {...kpi}
              iconName={kpi.icon}
              statusLabel={kpi.statusLabel}
              isSentimentCard={kpi.title.toLowerCase().includes("sentiment")}
              activeSentiment={selectedSentiment}
              onSentimentSelect={handleSentimentSelect}
            />
          ))}
        </div>

        {/* --- ANALYTICS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Sentiment & Awareness (col-span-4) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Sentiment Analysis Card - Modern Refined Version */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center transition-all hover:shadow-md group relative overflow-hidden">
              {/* Header Section */}
              <div className="w-full flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Sentiment Weight
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    Public Perception
                  </p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl group-hover:rotate-12 transition-transform">
                  <Smile size={18} className="text-slate-400" />
                </div>
              </div>

              {/* Main Chart Section */}
              <div className="h-60 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentView.sentiment.map((s) => ({
                        ...s,
                        color:
                          s.name === "Positive"
                            ? "#10b981"
                            : s.name === "Neutral"
                              ? "#f59e0b"
                              : "#f43f5e",
                      }))}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {currentView.sentiment.map((entry, index) => {
                        const cellColor =
                          entry.name === "Positive"
                            ? "#10b981"
                            : entry.name === "Neutral"
                              ? "#f59e0b"
                              : "#f43f5e";
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={cellColor}
                            cornerRadius={12}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 px-3 py-2 rounded-xl shadow-xl border border-slate-800">
                              <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                {payload[0].name}:{" "}
                                <span
                                  style={{ color: payload[0].payload.color }}
                                >
                                  {payload[0].value}%
                                </span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Label - Dynamic Color based on dominant sentiment */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                    {currentView.sentiment.find((s) => s.name === "Positive")
                      ?.value || 0}
                    %
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Positive
                    </span>
                  </div>
                </div>
              </div>

              {/* Legend Grid - Modern Pill Style with Dynamic Colors */}
              <div className="grid grid-cols-3 gap-3 mt-8 w-full pt-6 border-t border-slate-50">
                {currentView.sentiment.map((s) => {
                  const activeColor =
                    s.name === "Positive"
                      ? "text-emerald-500"
                      : s.name === "Neutral"
                        ? "text-amber-500"
                        : "text-rose-500";
                  const dotColor =
                    s.name === "Positive"
                      ? "bg-emerald-500"
                      : s.name === "Neutral"
                        ? "bg-amber-500"
                        : "bg-rose-500";

                  return (
                    <div
                      key={s.name}
                      className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                      <span className={`text-sm font-black ${activeColor}`}>
                        {s.value}%
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-1 h-1 rounded-full ${dotColor}`} />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                          {s.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtle Background Detail */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
            </div>

            {/* Awareness Trend Card - Modern White Version */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md group">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Activity size={16} className="text-blue-600" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                      Growth Trend
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter pl-9">
                    Awareness Index
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-black border border-green-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>

              {/* Chart Section - Refined with better padding and colors */}
              <div className="h-44 w-full -ml-4">
                <ResponsiveContainer width="110%" height="100%">
                  <AreaChart
                    data={awarenessTrend}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorAwareModern"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3B82F6"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>
                    {/* Subtle grid lines for a professional look */}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <Tooltip
                      cursor={{ stroke: "#3B82F6", strokeWidth: 1 }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="url(#colorAwareModern)"
                      activeDot={{
                        r: 6,
                        fill: "#3B82F6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Mini Footer - Dynamic Update */}
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                    Avg Score
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {currentView.charter_awareness.overall}%
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    currentView.kpi[0].trend.includes("+") ||
                    currentView.kpi[0].trend === "Stable"
                      ? "text-blue-600 bg-blue-50"
                      : "text-amber-600 bg-amber-50"
                  }`}
                >
                  {currentView.kpi[0].trend}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Service Dimensions (col-span-8) */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md h-full flex flex-col">
              {/* Header & Score Badges - Showing all 8 Dimensions */}
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                      Service Quality Dimensions
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      Full Analysis of 8 Key Metrics
                    </p>
                  </div>
                  <BarChart3
                    className="text-blue-500 bg-blue-50 p-2 rounded-xl hidden md:block"
                    size={40}
                  />
                </div>

                {/* Dynamic Badges - Professional Dashboard Style */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {performanceData.map((item) => (
                    <div
                      key={item.name}
                      className="relative group p-5 bg-white border border-slate-100 rounded-4xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100 hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Background Accent Pill - Subtle decoration */}
                      <div className="absolute -top-6 -right-6 w-16 h-16 bg-slate-50 rounded-full group-hover:bg-blue-50/50 transition-colors" />

                      <div className="relative flex flex-col items-start gap-3">
                        {/* Top Label & Icon-like Dot */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${item.score >= 3 ? "bg-[#10B981]" : "bg-red-500"}`}
                          />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            {item.name}
                          </span>
                        </div>

                        {/* Score Display */}
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-3xl font-black tracking-tighter ${item.score >= 3 ? "text-slate-900" : "text-red-500"}`}
                          >
                            {item.score.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase">
                            / 5.0
                          </span>
                        </div>

                        {/* Progress Bar Mini - Visual reinforcement */}
                        <div className="w-full h-1.5 bg-slate-50 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${item.score >= 3 ? "bg-[#10B981]" : "bg-red-400"}`}
                            style={{ width: `${(item.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Chart Section - 8 Bars */}
              <div className="grow h-64 w-full -mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
                    barGap={8}
                  >
                    <CartesianGrid
                      strokeDasharray="8 8"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 9, fontWeight: 800 }}
                      interval={0}
                      dy={5}
                    />
                    <YAxis
                      domain={[0, 5]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#cbd5e1", fontSize: 11, fontWeight: 600 }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc", radius: 10 }}
                      contentStyle={{
                        borderRadius: "20px",
                        border: "none",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
                        padding: "12px 16px",
                      }}
                    />
                    <Bar dataKey="score" radius={[10, 10, 10, 10]} barSize={28}>
                      {performanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="transition-all duration-500 hover:opacity-80"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Footer Stats - Summary of the 8 Dimensions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <div className="group flex-1 bg-slate-900 p-5 rounded-4xl flex items-center gap-4 transition-all hover:scale-[1.02]">
                  <div className="w-12 h-12 bg-white/10 text-green-400 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Strength Areas
                    </p>
                    <p className="text-xl font-black text-white">
                      {goodCount}{" "}
                      <span className="text-xs text-slate-500">of 8</span>
                    </p>
                  </div>
                </div>

                <div className="group flex-1 bg-white border border-slate-200 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-red-200">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Action Required
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {poorCount}{" "}
                      <span className="text-xs text-slate-400">Dimensions</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          {/* Table Header Section */}
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Recent Feedback Activity
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                Live Citizen Responses
              </p>
            </div>
          </div>

          <div className="px-4 pb-4 mt-2 w-full overflow-hidden scroll-mt-40" id="feedback">
            {filteredFeedback.length > 0 ? (
            <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-slate-500">
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] opacity-60">Citizen</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] opacity-60">Feedback Detail</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] opacity-60">Department</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] opacity-60">Sentiment</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] opacity-60">AI Confidence</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] opacity-60 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="before:leading-[1em] before:content-['-'] before:block before:invisible">
              {filteredFeedback.map((item) => (
                <tr key={item.id} className="group transition-all duration-300 hover:-translate-y-0.5">
                  
                  {/* 1. CITIZEN - Premium Profile Section */}
                  <td className="px-6 py-5 bg-white border-y border-l border-slate-200/60 rounded-l-2xl group-hover:border-indigo-200 group-hover:bg-slate-50/30 transition-all duration-300 w-[20%] min-w-50">
                    <div className="flex items-center gap-4">
                      {/* Avatar Container with Depth */}
                      <div className="relative shrink-0">
                        <div className="h-12 w-12 rounded-2xl bg-slate-400/30 flex items-center justify-center relative overflow-hidden group-hover:shadow-xl group-hover:shadow-indigo-500/20 transition-all duration-500">
                          {/* Subtle Background Pattern/Gradient */}
                          <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-blue-600 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* The Initial */}
                          <span className="relative z-10 text-white font-black text-lg tracking-tight italic">
                            {item.client ? item.client.charAt(0).toUpperCase() : "G"}
                          </span>
                          
                          {/* Glass Overlay for shine */}
                          <div className="absolute inset-0 bg-white/10 opacity-20 group-hover:rotate-12 transition-transform duration-700" />
                        </div>

                        {/* Online/Verified Pulse Indicator */}
                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                          <span className="absolute h-full w-full rounded-full bg-emerald-400 animate-ping opacity-75" />
                          <div className="relative h-4 w-4 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm" />
                        </div>
                      </div>

                      {/* Identity Details */}
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-black text-slate-800 truncate tracking-tight group-hover:text-indigo-600 transition-colors">
                            {item.client || "General Public"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 tabular-nums bg-slate-100 px-1.5 py-0.5 rounded-md">
                            #{item.id}
                          </span>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                            </svg>
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tight">Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. FEEDBACK TEXT - Premium Statement Styling */}
                  <td className="px-8 py-5 bg-white border-y border-slate-200/60 group-hover:border-indigo-200 group-hover:bg-slate-50/30 transition-all duration-300 w-[30%]">
                    <div className="relative flex items-start gap-4">
                      
                      {/* Elegant Vertical Accent Line */}
                      <div className="absolute -left-4 top-1 bottom-1 w-0.75 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-linear-to-b from-indigo-500 to-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {/* Label for context */}
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em] leading-none">
                          Citizen Remark
                        </span>

                        <div className="relative">
                          <p className="text-[13px] text-slate-500 font-medium leading-[1.6] tracking-tight group-hover:text-slate-900 transition-colors duration-300 antialiased italic">
                            <span className="text-indigo-400/50 font-serif text-xl mr-1 select-none">“</span>
                            {item.text}
                            <span className="text-indigo-400/50 font-serif text-xl ml-1 select-none">”</span>
                          </p>
                        </div>
                        
                        {/* Interactive Tag - Optional/Extra Premium Detail */}
                        <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <span className="h-1 w-1 rounded-full bg-indigo-400" />
                          <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">
                            Analyzed by BERT
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 3. SERVICE - Premium Department Badge */}
                  <td className="px-6 py-5 bg-white border-y border-slate-200/60 group-hover:border-indigo-200 group-hover:bg-slate-50/30 transition-all duration-300 w-[20%]">
                    <div className="flex flex-col gap-2">
                      {/* Minimalist Sub-header */}
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em] leading-none">
                        Department
                      </span>

                      <div className="relative w-fit group/badge">
                        {/* Subtle Glow Effect on Hover */}
                        <div className="absolute inset-0 bg-indigo-400/20 blur-md rounded-lg opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg transition-all duration-300 group-hover/badge:border-indigo-300 group-hover/badge:-translate-y-0.5">
                          {/* Department Icon Placeholder */}
                          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-50 group-hover/badge:bg-indigo-50 transition-colors">
                            <svg className="w-3 h-3 text-slate-400 group-hover/badge:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>

                          {/* The Service Text */}
                          <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide whitespace-nowrap group-hover/badge:text-indigo-700 transition-colors">
                            {item.service}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 4. SENTIMENT - High-Fidelity AI Insight Badge */}
                  <td className="px-6 py-5 bg-white border-y border-slate-200/60 group-hover:border-indigo-200 group-hover:bg-slate-50/30 transition-all duration-300 w-[15%]">
                    <div className="flex flex-col gap-2">
                      {/* Minimalist Sub-header */}
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em] leading-none">
                        BERT Insight
                      </span>

                      <div className="relative w-fit">
                        {/* Dynamic Glow Layer - Changes color based on sentiment */}
                        <div className={`absolute inset-0 blur-md opacity-20 transition-all duration-500 rounded-full
                          ${item.sentiment?.toLowerCase() === 'positive' ? 'bg-emerald-400' : 
                            item.sentiment?.toLowerCase() === 'neutral' ? 'bg-amber-400' : 
                            'bg-rose-400'}
                        `} />

                        <div className={`
                          relative inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border shadow-sm transition-all duration-300
                          ${item.sentiment?.toLowerCase() === 'positive' 
                            ? 'bg-emerald-50/40 border-emerald-200/50 text-emerald-700 shadow-emerald-100/20' 
                            : item.sentiment?.toLowerCase() === 'neutral' 
                              ? 'bg-amber-50/40 border-amber-200/50 text-amber-700 shadow-amber-100/20' 
                              : 'bg-rose-50/40 border-rose-200/50 text-rose-700 shadow-rose-100/20'}
                          group-hover:translate-x-1
                        `}>
                          {/* Animated Status Dot */}
                          <div className="relative flex items-center justify-center">
                            <span className={`absolute h-2 w-2 rounded-full opacity-75 animate-ping
                              ${item.sentiment?.toLowerCase() === 'positive' ? 'bg-emerald-400' : 
                                item.sentiment?.toLowerCase() === 'neutral' ? 'bg-amber-400' : 
                                'bg-rose-400'}
                            `} />
                            <div className={`relative h-2 w-2 rounded-full shadow-inner
                              ${item.sentiment?.toLowerCase() === 'positive' ? 'bg-emerald-500' : 
                                item.sentiment?.toLowerCase() === 'neutral' ? 'bg-amber-500' : 
                                'bg-rose-500'}
                            `} />
                          </div>

                          <span className="text-[10px] font-black uppercase tracking-widest antialiased">
                            {item.sentiment}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 5. AI CONFIDENCE - Precision Gauge Styling */}
                  <td className="px-6 py-5 bg-white border-y border-slate-200/60 group-hover:border-indigo-200 group-hover:bg-slate-50/30 transition-all duration-300 w-[15%]">
                    <div className="flex flex-col gap-2.5 w-28">
                      {/* Label & Score Header */}
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em] leading-none mb-1">
                            Accuracy
                          </span>
                          <span className={`text-[13px] font-black tabular-nums tracking-tight transition-colors duration-500
                            ${parseFloat(item.confidence) >= 0.90 ? 'text-emerald-600' : 
                              parseFloat(item.confidence) >= 0.70 ? 'text-amber-600' : 
                              'text-rose-600'}
                          `}>
                            {Math.round(parseFloat(item.confidence) * 100)}%
                          </span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest pb-0.5">
                          BERT v2
                        </span>
                      </div>

                      {/* Premium Progress Track */}
                      <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        {/* Background "Glow" for the progress fill */}
                        <div 
                          className={`absolute inset-0 blur-[2px] opacity-40 transition-all duration-700
                            ${parseFloat(item.confidence) >= 0.90 ? 'bg-emerald-400' : 
                              parseFloat(item.confidence) >= 0.70 ? 'bg-amber-400' : 
                              'bg-rose-400'}
                          `}
                          style={{ width: `${parseFloat(item.confidence) * 100}%` }}
                        />
                        
                        {/* Primary Progress Fill */}
                        <div 
                          className={`relative h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]
                            ${parseFloat(item.confidence) >= 0.90 ? 'bg-linear-to-r from-emerald-400 to-emerald-600' : 
                              parseFloat(item.confidence) >= 0.70 ? 'bg-linear-to-r from-amber-400 to-amber-600' : 
                              'bg-linear-to-r from-rose-400 to-rose-600'}
                          `}
                          style={{ width: `${parseFloat(item.confidence) * 100}%` }}
                        />
                      </div>

                      {/* Subtle status caption */}
                      <span className={`text-[7px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100
                        ${parseFloat(item.confidence) >= 0.90 ? 'text-emerald-500' : 
                          parseFloat(item.confidence) >= 0.70 ? 'text-amber-500' : 
                          'text-rose-500'}
                      `}>
                        {parseFloat(item.confidence) >= 0.90 ? 'High Reliability' : 
                        parseFloat(item.confidence) >= 0.70 ? 'Moderate Score' : 
                        'Low Confidence'}
                      </span>
                    </div>
                  </td>

                 {/* 6. TIMESTAMP - Premium Chronological Finish */}
                <td className="px-6 py-5 bg-white border-y border-r border-slate-200/60 rounded-r-2xl text-right group-hover:border-indigo-200 group-hover:bg-slate-50/30 transition-all duration-300 w-[15%]">
                  <div className="flex flex-col items-end gap-2">
                    {/* Label */}
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em] leading-none">
                      Timeline
                    </span>

                    <div className="flex flex-col items-end">
                      {/* Time Badge */}
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 group-hover:border-indigo-100 group-hover:bg-white transition-all duration-300">
                        <svg className="w-3 h-3 text-indigo-400 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[10px] font-black text-slate-800 tabular-nums tracking-tight whitespace-nowrap">
                          {new Date(item.date).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            hour12: true 
                          })}
                        </span>
                      </div>
                      
                      {/* Date & Live Status */}
                      <div className="flex items-center gap-2 mt-1.5 pr-1">
                        <span className="text-[8px] font-bold text-slate-400 tabular-nums tracking-wide">
                          {new Date(item.date).toLocaleDateString([], { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        
                        {/* Refined Live Status Indicator */}
                        <div className="flex items-center justify-center relative w-2 h-2">
                          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                          <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                </tr>
              ))}
            </tbody>
          </table>
            ) : (
              (() => {
                const theme = {
                  all: { text: "indigo", bg: "indigo", glow: "bg-indigo-400", border: "border-indigo-100" },
                  positive: { text: "emerald", bg: "emerald", glow: "bg-emerald-400", border: "border-emerald-100" },
                  neutral: { text: "amber", bg: "amber", glow: "bg-amber-400", border: "border-amber-100" },
                  negative: { text: "rose", bg: "rose", glow: "bg-rose-400", border: "border-rose-100" },
                }[selectedSentiment?.toLowerCase()] || { text: "indigo", bg: "indigo", glow: "bg-indigo-400", border: "border-indigo-100" };

                return (
                  <div className="relative group overflow-hidden flex flex-col items-center justify-center py-32 px-6 bg-linear-to-b from-slate-50/50 to-white rounded-[3.5rem] border border-slate-200/60 shadow-[0_20px_50px_-20px_rgba(226,232,240,0.5)] transition-all duration-700">
                    
                    {/* 1. Dynamic Mesh Background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden opacity-30">
                      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${theme.glow} blur-[100px] rounded-full animate-pulse`} />
                      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[100px] rounded-full animate-pulse delay-700" />
                    </div>

                    {/* 2. Central Visual Unit */}
                    <div className="relative mb-10">
                      {/* Concentric Rotating Rings */}
                      <div className="absolute inset-0 -m-6 border border-slate-200/50 rounded-[3rem] animate-[spin_20s_linear_infinite]" />
                      <div className={`absolute inset-0 -m-10 border ${theme.border}/40 rounded-[3.5rem] animate-[spin_30s_linear_infinite_reverse]`} />
                      
                      {/* Floating Icon Container */}
                      <div className="relative h-28 w-28 rounded-[2.5rem] bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] flex items-center justify-center border border-slate-100 group-hover:scale-105 group-hover:rotate-3 transition-all duration-700">
                        
                        {/* Dynamic Scanning Laser Line */}
                        <div className={`absolute inset-x-4 h-0.5 bg-linear-to-r from-transparent via-${theme.text}-500 to-transparent top-0 animate-[scan_3s_ease-in-out_infinite]`} />
                        
                        <svg 
                          className={`w-12 h-12 text-slate-300 group-hover:text-${theme.text}-500 transition-colors duration-500`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="1.2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        
                        {/* Dynamic Status Indicators */}
                        <div className="absolute -bottom-2 -right-2 flex gap-1 bg-white p-2 rounded-xl shadow-lg border border-slate-50">
                          <div className={`h-2 w-2 rounded-full transition-all duration-500 ${selectedSentiment === 'positive' || selectedSentiment === 'all' ? 'bg-emerald-400 animate-bounce' : 'bg-slate-200 opacity-40'}`} />
                          <div className={`h-2 w-2 rounded-full transition-all duration-500 delay-150 ${selectedSentiment === 'neutral' || selectedSentiment === 'all' ? 'bg-amber-400 animate-bounce' : 'bg-slate-200 opacity-40'}`} />
                          <div className={`h-2 w-2 rounded-full transition-all duration-500 delay-300 ${selectedSentiment === 'negative' || selectedSentiment === 'all' ? 'bg-rose-400 animate-bounce' : 'bg-slate-200 opacity-40'}`} />
                        </div>
                      </div>
                    </div>

                    {/* 3. Dynamic Text Content */}
                    <div className="text-center space-y-4 max-w-md relative">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${theme.text}-50 border border-${theme.text}-100 mb-2 transition-colors duration-500`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${theme.text}-400 opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 bg-${theme.text}-500`}></span>
                        </span>
                        <span className={`text-[8px] font-black text-${theme.text}-600 uppercase tracking-[0.15em]`}>
                          {selectedSentiment === 'all' ? 'System Scanning' : `${selectedSentiment} analysis active`}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none italic uppercase">
                        No {selectedSentiment !== 'all' ? selectedSentiment : ''} Records Found
                      </h3>
                      
                      <p className="text-[13px] text-slate-400 font-medium leading-[1.8] tracking-wide px-8">
                        Our <span className={`text-${theme.text}-600 font-bold italic transition-colors`}>BERT Engine</span> has analyzed all incoming data streams but couldn't locate any feedback categorized as <span className="lowercase font-bold text-slate-600">{selectedSentiment === 'all' ? 'recent entries' : selectedSentiment}</span> at this moment.
                      </p>
                    </div>
                    
                    <style jsx>{`
                      @keyframes scan {
                        0%, 100% { top: 15%; opacity: 0; }
                        50% { top: 85%; opacity: 1; }
                      }
                      @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                );
              })()
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
