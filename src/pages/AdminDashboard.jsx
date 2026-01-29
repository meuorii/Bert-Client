import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AdminOverview from '../components/AdminOverview';
import FeedbackAnalysis from '../components/FeedbackAnalysis';
import ServicePerformance from '../components/ServicePerformance';
import AIInsights from '../components/AiInsights';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 

  useEffect(() => {
      const titles = {
        overview: 'Admin Dashboard – Overview',
        analysis: 'Admin Dashboard – Feedback Analysis',
        service: 'Admin Dashboard – Service Performance',
        ai: 'Admin Dashboard – AI Insights',
        reports: 'Admin Dashboard – Reports',
      };

      document.title = titles[activeTab] || 'Admin Dashboard';
    }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview />; 
      case 'analysis': return <FeedbackAnalysis />;
      case 'service': return <ServicePerformance />;
      case 'ai': return <AIInsights />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Pass setActiveTab to Sidebar to handle navigation and logout */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 lg:ml-72 p-4 lg:p-8 transition-all duration-300">
        <section key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;