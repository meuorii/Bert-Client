import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Sparkles,
  AlertTriangle,
  BrainCircuit,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  BarChart3,
  Fingerprint,
  Search,
  Brain,
  ShieldAlert,
} from "lucide-react";

const AiInsights = () => {
  const [activeFilter, setActiveFilter] = useState("daily");
  const [insightData, setInsightData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/recommendations",
        );
        setInsightData(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentData = useMemo(() => {
    if (!insightData) return null;

    const selectedPeriod = insightData[activeFilter];
    if (!selectedPeriod || !selectedPeriod.summary) return null;

    const detailedPlaybook = [];
    const recommendationsGroup = selectedPeriod.recommendations || {};

    Object.entries(recommendationsGroup).forEach(([category, items]) => {
      items.forEach((item) => {
        detailedPlaybook.push({
          ...item,
          categoryName: category,
        });
      });
    });

    const rawSentiment =
      selectedPeriod.summary.sentiment_score ||
      (selectedPeriod.summary.overall_severity === "Critical" ? 0.25 : 0.75);

    return {
      dateRange: `${selectedPeriod.start_date} - ${selectedPeriod.end_date}`,
      severity: selectedPeriod.summary.overall_severity,
      inferenceStrength: selectedPeriod.summary.confidence_score,
      sentimentScore: Math.round(rawSentiment * 100),
      playbook: detailedPlaybook,
    };
  }, [activeFilter, insightData]);

  if (loading || !currentData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10 animate-pulse">
        {/* --- HEADER & FILTERS SKELETON --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-3">
            <div className="h-9 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-80 bg-slate-100 rounded-md" />
          </div>
          <div className="h-10 w-48 bg-slate-200 rounded-xl" />
        </div>

        {/* --- TOP VISUALS SKELETON --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Neural Signal Analysis Card Skeleton (8 Columns) */}
          <div className="lg:col-span-8 p-10 rounded-[3rem] border border-slate-200 bg-white space-y-8">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-slate-200 rounded" />
                  <div className="h-3 w-56 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-8 w-24 bg-slate-100 rounded-2xl" />
            </div>
            <div className="space-y-4 pt-4">
              <div className="h-10 w-3/4 bg-slate-200 rounded-lg" />
              <div className="h-24 w-full bg-slate-50 rounded-3xl" />
            </div>
          </div>

          {/* Service Integrity Index Card Skeleton (4 Columns) */}
          <div className="lg:col-span-4 p-10 rounded-[3rem] bg-slate-900 flex flex-col justify-between">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/20 rounded" />
              </div>
            </div>
            <div className="py-6">
              <div className="h-20 w-32 bg-white/20 rounded-xl mb-4" />
              <div className="h-3 w-40 bg-white/10 rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-3 w-full bg-white/5 rounded-full" />
              <div className="h-3 w-2/3 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>

        {/* --- STRATEGIC PLAYBOOK SKELETON --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden">
          <div className="px-10 py-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-7 w-48 bg-slate-200 rounded-lg" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded-lg" />
          </div>

          {/* Repeated Playbook Item Skeletons */}
          {[1, 2].map((i) => (
            <div key={i} className="p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-slate-50">
              <div className="lg:col-span-5 space-y-6">
                <div className="h-4 w-32 bg-slate-100 rounded" />
                <div className="h-12 w-full bg-slate-200 rounded-xl" />
                <div className="h-16 w-3/4 bg-slate-100 rounded-xl" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-slate-100 rounded-full" />
                  <div className="h-8 w-24 bg-slate-100 rounded-full" />
                </div>
              </div>
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 bg-slate-50 rounded-4xl" />
                  <div className="h-40 bg-slate-900/5 rounded-" />
                </div>
                <div className="h-32 bg-slate-50 rounded-3xl" />
              </div>
            </div>
          ))}
        </div>

        {/* --- SYSTEM DIAGNOSTICS STATUS BAR SKELETON --- */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-40 bg-slate-100 border border-slate-200 rounded-2xl" />
          ))}
          <div className="ml-auto h-6 w-32 bg-slate-50 rounded-full" />
        </div>
      </div>
    );
  }

  const filters = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-10 animate-in fade-in duration-700">
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Recommendation Agent
          </h2>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Fingerprint size={18} className="text-blue-600" />
            Neural processing of citizen sentiment and operational bottlenecks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeFilter === f.id
                    ? "bg-white text-slate-900 shadow-md transform scale-105"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- TOP VISUALS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- NEURAL SIGNAL ANALYSIS CARD --- */}
        {(() => {
          const rawStrength = Number(currentData?.inferenceStrength);
          const hasData =
            !isNaN(rawStrength) && currentData?.inferenceStrength !== undefined;

          // Imbes na loading, ito ang default display values
          const displayStrength = hasData
            ? (rawStrength * 100).toFixed(1)
            : "0.0";
          const displaySeverity = currentData?.severity || "Standard";

          return (
            <div
              className={`lg:col-span-8 p-10 rounded-[3rem] border transition-all duration-700 relative overflow-hidden group ${
                hasData && currentData?.sentimentScore < 50
                  ? "bg-linear-to-br from-red-50/50 to-white border-red-200 shadow-xl shadow-red-500/5"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                <Brain size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${hasData && currentData?.sentimentScore < 50 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"}`}
                      >
                        <Activity size={20} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        Neural Signal Analysis
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${hasData ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                      />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                        Recommendation Agent Inference Engine v2.4 • System Live
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all duration-500 ${
                      displaySeverity === "Critical"
                        ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/40"
                        : "bg-slate-50 text-slate-500 border-slate-100"
                    }`}
                  >
                    <AlertTriangle
                      size={14}
                      strokeWidth={3}
                      className={
                        displaySeverity === "Critical" ? "animate-pulse" : ""
                      }
                    />
                    {displaySeverity} Priority
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-opacity-70">
                      Detection Summary
                    </h4>
                    <p className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                      {hasData ? (
                        <>
                          Trend detected:{" "}
                          <span className="text-slate-300">
                            Signal Reliability
                          </span>{" "}
                          is
                        </>
                      ) : (
                        <>
                          System status:{" "}
                          <span className="text-slate-300">
                            Baseline Reliability
                          </span>{" "}
                          is
                        </>
                      )}
                      <span
                        className={`ml-3 font-mono inline-flex items-baseline ${
                          hasData && currentData?.sentimentScore < 50
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {displayStrength}
                        <span className="text-lg ml-1 opacity-50">%</span>
                      </span>
                    </p>
                  </div>

                  <div
                    className={`relative group/quote transition-all duration-500 ${
                      hasData && currentData?.sentimentScore < 50
                        ? "bg-white/60 backdrop-blur-md border-red-200 shadow-md shadow-red-500/10"
                        : "bg-slate-50 border-slate-100"
                    } border-l-[6px] ${hasData && currentData?.sentimentScore < 50 ? "border-red-500" : "border-slate-300"} p-8 rounded-3xl rounded-tl-none`}
                  >
                    <div className="absolute -top-4 -left-3 text-slate-200 group-hover/quote:scale-110 transition-transform">
                      <Zap size={32} fill="currentColor" />
                    </div>

                    <p
                      className={`text-base leading-relaxed font-bold italic tracking-tight ${
                        hasData && currentData?.sentimentScore < 50
                          ? "text-red-950"
                          : "text-slate-600"
                      }`}
                    >
                      {hasData ? (
                        <>
                          "System identifies{" "}
                          {currentData?.severity?.toLowerCase()} operational
                          bottlenecks.
                          <span className="mx-2 opacity-30 text-slate-400 font-normal">
                            |
                          </span>
                          Core diagnostic:{" "}
                          <span
                            className={
                              currentData?.sentimentScore < 50
                                ? "underline decoration-red-200 decoration-2 underline-offset-4"
                                : "text-blue-700"
                            }
                          >
                            {currentData?.playbook?.[0]?.issue}
                          </span>
                          "
                        </>
                      ) : (
                        "No significant neural trends detected for the selected period. System remains in nominal monitoring state with standard data ingestion active."
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-6">
                      <div className="flex -space-x-2 opacity-50">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Verified against{" "}
                        <span className="text-slate-600 underline underline-offset-2 italic font-serif">
                          Municipal Registry
                        </span>
                      </p>
                    </div>
                    <div className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest">
                      Standard Mode
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* --- SERVICE INTEGRITY INDEX CARD --- */}
        {(() => {
          const score = Number(currentData?.sentimentScore) || 0;
          const hasData =
            !isNaN(Number(currentData?.sentimentScore)) &&
            currentData?.sentimentScore !== undefined;
          const isCritical = score < 50 && hasData;

          return (
            <div
              className={`lg:col-span-4 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group transition-all duration-700 ${
                isCritical
                  ? "bg-slate-950 ring-1 ring-red-500/30"
                  : "bg-slate-900 border border-white/5"
              }`}
            >
              {/* Background Mesh Gradient */}
              <div
                className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-40 transition-colors duration-1000 ${
                  isCritical ? "bg-red-600/40" : "bg-blue-600/20"
                }`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-2xl backdrop-blur-md border ${
                        isCritical
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-white/5 border-white/10 text-blue-400"
                      }`}
                    >
                      <Fingerprint size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        Public Integrity
                      </h3>
                      <h4 className="text-sm font-bold text-slate-200">
                        Citizen Sentiment
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 my-4">
                <div className="flex items-baseline gap-2">
                  <h2
                    className={`text-8xl font-black tracking-tighter tabular-nums transition-all duration-500 ${
                      isCritical
                        ? "text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                        : "text-white"
                    }`}
                  >
                    {score}
                  </h2>
                  <span
                    className={`text-3xl font-bold opacity-40 ${isCritical ? "text-red-400" : "text-blue-400"}`}
                  >
                    %
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-3 flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isCritical ? "bg-red-500 animate-pulse" : "bg-blue-500"}`}
                  />
                  {hasData
                    ? "Aggregate Neural Scoring"
                    : "Nominal Tracking Active"}
                </p>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                      Stability Index
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        isCritical
                          ? "text-red-400 border-red-500/30 bg-red-500/5 animate-pulse"
                          : "text-blue-400 border-blue-500/30 bg-blue-500/5"
                      }`}
                    >
                      {hasData
                        ? score >= 80
                          ? "Optimal"
                          : "Needs Review"
                        : "Standby"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {score}/100
                  </span>
                </div>

                <div className="h-3 bg-white/5 rounded-full p-1 border border-white/5 shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-[1.5s] cubic-bezier(0.34, 1.56, 0.64, 1) ${
                      isCritical
                        ? "bg-linear-to-r from-red-600 via-red-500 to-orange-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        : "bg-linear-to-r from-blue-600 via-blue-400 to-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <p className="text-[9px] text-center font-bold text-slate-600 uppercase tracking-widest pt-2">
                  Real-time Sentiment Extraction
                </p>
              </div>

              {/* Visual background icon */}
              <BarChart3
                size={160}
                className={`absolute -right-12 -bottom-12 opacity-[0.03] transition-all duration-1000 group-hover:opacity-[0.08] group-hover:rotate-0 -rotate-12 pointer-events-none ${
                  isCritical ? "text-red-500" : "text-blue-500"
                }`}
              />
            </div>
          );
        })()}
      </div>

      {/* --- STRATEGIC PLAYBOOK (Modern Premium Redesign) --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden group/playbook">
        {/* Modern Header with Gradient Text */}
        <div className="px-10 py-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-amber-400/20 rounded-full blur animate-pulse"></div>
              <div className="relative p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Zap className="text-amber-500 fill-amber-500" size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
                Strategic Playbook
              </h3>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Agent Neural Intervention Protocols
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Active Analysis
              </p>
              <p className="text-xs font-bold text-slate-900">
                {currentData.playbook.length} Issues Identified
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100/80 bg-white">
          {currentData.playbook.map((item, idx) => (
            <div
              key={idx}
              className="p-10 lg:p-14 hover:bg-slate-50/40 transition-all duration-700 group relative overflow-hidden"
            >
              {/* Background Accent Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
                {/* Left Column: Context & Branding */}
                <div className="lg:col-span-5 relative space-y-10">
                  {/* Subtle ID Watermark - adds a technical/premium layer */}
                  <div className="absolute -top-6 -left-4 text-[64px] font-black text-slate-100/50 select-none pointer-events-none font-mono tracking-tighter group-hover:text-blue-100/40 transition-colors duration-700">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <div className="relative space-y-8">
                    <div className="flex items-start gap-6">
                      {/* Dynamic Status Indicator Block */}
                      <div className="relative shrink-0 mt-1">
                        <div
                          className={`w-1.5 h-16 rounded-full transition-all duration-500 ${
                            item.severity === "Critical"
                              ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                              : "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                          }`}
                        />
                        {/* Glowing dot on top of the line */}
                        <div
                          className={`absolute -top-1 -left-0.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                            item.severity === "Critical"
                              ? "bg-red-500"
                              : "bg-blue-600"
                          }`}
                        />
                      </div>

                      <div className="space-y-3">
                        {/* Breadcrumb-style Category */}
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {item.categoryName}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-black text-blue-600/70 uppercase tracking-[0.2em] font-mono">
                            Protocol Unit {String(idx + 1).padStart(3, "0")}
                          </span>
                        </div>

                        <h4 className="text-4xl font-black text-slate-900 leading-[1.05] tracking-tight group-hover:translate-x-1 transition-transform duration-500">
                          {item.issue}
                        </h4>

                        <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
                          Automated diagnostic identified a{" "}
                          {item.severity?.toLowerCase() || "standard"}{" "}
                          complexity gap in current service operations.
                        </p>
                      </div>
                    </div>

                    {/* Tag Cloud for Statuses */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Priority Badge */}
                      <div
                        className={`flex items-center gap-2.5 py-2.5 px-5 rounded-2xl border backdrop-blur-md transition-all duration-500 ${
                          item.severity === "Critical"
                            ? "bg-red-50/40 text-red-700 border-red-200/50 shadow-sm"
                            : "bg-blue-50/40 text-blue-700 border-blue-200/50 shadow-sm"
                        }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-2 h-2 rounded-full ${item.severity === "Critical" ? "bg-red-500" : "bg-blue-600"}`}
                          />
                          <div
                            className={`absolute inset-0 w-2 h-2 rounded-full animate-ping ${item.severity === "Critical" ? "bg-red-400" : "bg-blue-400"}`}
                          />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-wider">
                          {item.severity || "Standard"} Priority
                        </span>
                      </div>

                      {/* Neural Link Badge */}
                      <div className="flex items-center gap-2.5 py-2.5 px-5 rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-md text-[11px] font-black text-slate-600 uppercase tracking-wider hover:border-blue-300 transition-colors cursor-help">
                        <BrainCircuit size={15} className="text-blue-500" />
                        <span>Neural Verified</span>
                      </div>

                      {/* Accuracy Score Badge */}
                      <div className="flex items-center gap-2 py-2.5 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                        <Zap
                          size={14}
                          className="fill-slate-300 text-slate-300"
                        />
                        <span>{Math.round(item.confidence * 100)}% Match</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Insights & Execution */}
                <div className="lg:col-span-7 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Root Cause Card - The "Light" Intelligence Card */}
                    <div className="group/card relative p-8 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                      {/* Decorative Glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover/card:bg-amber-500/10 transition-colors" />

                      <div className="relative space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-2xl text-amber-600 group-hover/card:bg-amber-500 group-hover/card:text-white group-hover/card:scale-110 transition-all duration-500">
                              <Search size={18} className="stroke-[2.5px]" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-amber-600/80 uppercase tracking-[0.2em] leading-none mb-1">
                                Causality Analysis
                              </span>
                              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                Diagnostic Origin
                              </span>
                            </div>
                          </div>
                          {/* Subtle Indicator */}
                          <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-amber-400 group-hover/card:w-full transition-all duration-1000" />
                          </div>
                        </div>

                        <div className="pt-2">
                          <p className="text-[15px] text-slate-600 leading-relaxed font-semibold tracking-tight">
                            {item.root_cause}
                          </p>
                        </div>

                        {/* Footer Label */}
                        <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                          <div className="w-4 h-px bg-slate-200" />
                          Agent-Engineered Insights
                        </div>
                      </div>
                    </div>

                    {/* Impact Card - The "Dark" High-Contrast Card */}
                    <div className="group/card relative p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl hover:bg-slate-950 hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                      {/* Subtle Grid Pattern Overlay */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                      <div className="relative space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 group-hover/card:bg-blue-500 group-hover/card:text-white group-hover/card:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                              <Zap
                                size={18}
                                className="stroke-[2.5px] fill-current"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none mb-1">
                                Systemic Consequence
                              </span>
                              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                Ecosystem Impact
                              </span>
                            </div>
                          </div>
                          {/* Animated Pulse Dot */}
                          <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/5 rounded-full border border-blue-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter text-nowrap">
                              Active Impact
                            </span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <p className="text-[15px] text-slate-300 leading-relaxed font-medium tracking-tight">
                            {item.impact}
                          </p>
                        </div>

                        {/* Footer Label */}
                        <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                          <div className="w-4 h-px bg-slate-800" />
                          High-Confidence Projection
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Protocols */}
                  <div className="space-y-8">
                    {/* Section Header with Dynamic Counter */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Activity
                            size={16}
                            className="text-blue-600 relative z-10"
                          />
                          <div className="absolute inset-0 bg-blue-400/20 blur-lg animate-pulse" />
                        </div>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">
                          Strategic Protocols
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-linear-to-r from-slate-200 via-slate-100 to-transparent" />
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        {item.actions.length} TASKS READY
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {item.actions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          className="group/btn relative flex items-start justify-between gap-4 bg-white hover:bg-slate-900 border border-slate-200/70 hover:border-slate-900 p-5 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1 active:scale-[0.98]"
                        >
                          {/* Hover Background Pattern */}
                          <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-[0.05] transition-opacity duration-500 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] rounded-3xl" />

                          <div className="flex items-start gap-4 relative z-10">
                            {/* Step Numbering / Icon Container */}
                            <div className="relative shrink-0">
                              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:border-blue-500 transition-all duration-500 shadow-sm">
                                <span className="text-[10px] font-black text-slate-400 group-hover/btn:text-white transition-colors">
                                  {String(aIdx + 1).padStart(2, "0")}
                                </span>
                              </div>
                              {/* Connection line between steps (optional visual) */}
                              <div
                                className={`absolute top-10 left-4 w-px h-4 bg-slate-100 group-hover/btn:bg-blue-900/20 transition-colors ${aIdx === item.actions.length - 1 ? "hidden" : ""}`}
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[14px] font-bold text-slate-800 group-hover/btn:text-white text-left leading-tight transition-colors duration-300">
                                {action}
                              </span>
                              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-all duration-700 translate-y-1 group-hover/btn:translate-y-0">
                                Deployment Ready
                              </span>
                            </div>
                          </div>

                          {/* Action Icon */}
                          <div className="relative shrink-0 mt-1">
                            <div className="p-1 rounded-full text-slate-300 group-hover/btn:text-blue-400 transition-all duration-500 transform group-hover/btn:rotate-45">
                              <ChevronRight size={18} strokeWidth={3} />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Footer Disclaimer/Context */}
                    <div className="flex items-center justify-center gap-2 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
                        Protocol execution requires administrative clearance
                        level 02
                      </p>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Intelligence Verification */}
        <div className="bg-slate-50 p-6 flex items-center justify-center border-t border-slate-100">
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <ShieldCheck size={14} className="text-emerald-500" />
            Verified by Agent
          </div>
        </div>
      </div>

      {/* --- SYSTEM DIAGNOSTICS STATUS BAR --- */}
      <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 mt-8">
        {/* Model Status */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm hover:border-blue-200 transition-all group">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
            <BrainCircuit size={14} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none mb-1">
              Architecture
            </span>
            <span className="text-[11px] font-bold text-slate-700 leading-none">
              Agent Inference
            </span>
          </div>
        </div>

        {/* Training Stability */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm hover:border-emerald-200 transition-all group">
          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 relative">
            <ShieldCheck size={14} strokeWidth={2.5} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none mb-1">
              Training State
            </span>
            <span className="text-[11px] font-bold text-slate-700 leading-none tracking-tight">
              System Nominal
            </span>
          </div>
        </div>

        {/* Reliability Score */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl shadow-lg hover:bg-slate-800 transition-all group">
          <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 group-hover:rotate-12 transition-transform">
            <Sparkles size={14} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none mb-1">
              Confidence
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-mono font-bold text-purple-400 leading-none">
                {!isNaN(Number(currentData?.inferenceStrength))
                  ? (currentData.inferenceStrength * 100).toFixed(1)
                  : "0.0"}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Optional: Last Sync Indicator */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
          <div className="h-1 w-1 bg-slate-400 rounded-full" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            Last Sync:{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ title, status, icon, color }) => (
  <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors cursor-default">
    <div className={`p-2 bg-slate-50 rounded-xl ${color} shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
        {title}
      </p>
      <p className="text-sm font-bold text-slate-900 leading-none">{status}</p>
    </div>
  </div>
);

export default AiInsights;
