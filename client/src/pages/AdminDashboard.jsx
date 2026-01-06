import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { 
  ShieldAlert, Settings, Activity, Database, Building, 
  Save, AlertTriangle, CheckCircle, Server, Plus, X, TrendingUp, Users, Map 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // --- STATE FOR POST MODAL ---
  const [showPostModal, setShowPostModal] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: "", company: "", location: "", stipend: "", duration: ""
  });

  // --- STATE FOR POLICY ENGINE ---
  const [policy, setPolicy] = useState({
    minStipendTier1: 12000,
    minStipendTier2: 8000,
    maxUnpaidMonths: 2,
    remoteAllowed: true
  });

  // HANDLERS
  const handlePolicyChange = (e) => {
    setPolicy({ ...policy, [e.target.name]: e.target.value });
  };

  const handlePostInputChange = (e) => {
    setPostFormData({ ...postFormData, [e.target.name]: e.target.value });
  };

  const handlePostInternship = (e) => {
    e.preventDefault();
    alert(`✅ Success: "${postFormData.title}" posted to National Portal under Digital India Mission.`);
    setShowPostModal(false);
    setPostFormData({ title: "", company: "", location: "", stipend: "", duration: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-indigo-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                 Government of India
               </span>
               <span className="text-gray-400 text-xs font-mono">v4.2.0-secure</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ministry Oversight Portal</h1>
          </div>

          {/* POST OPPORTUNITY BUTTON (RESTORED) */}
          <button 
             onClick={() => setShowPostModal(true)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold flex items-center shadow-lg transition-transform hover:scale-105"
           >
             <Plus className="w-5 h-5 mr-2" /> Post Official Opportunity
           </button>
        </div>

        {/* TABS */}
        <div className="flex gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 w-fit overflow-x-auto">
          {["overview", "policy", "data"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab 
                ? "bg-indigo-600 text-white shadow" 
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {tab === "overview" ? "NIHI Dashboard" : tab === "policy" ? "Policy Engine" : "Data Sources"}
            </button>
          ))}
        </div>

        {/* --- TAB 1: NIHI (National Internship Health Index) --- */}
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            
            {/* NIHI SCORECARD */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl text-white shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-200 text-xs font-bold uppercase mb-1">National Health Index (NIHI)</p>
                    <h3 className="text-4xl font-black">8.4/10</h3>
                    <p className="text-xs text-indigo-100 mt-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" /> +1.2% this month
                    </p>
                  </div>
                  <Activity className="opacity-50 w-10 h-10" />
                </div>
              </div>
              
              <MetricCard label="Exploitation Rate" value="4.2%" sub="Violations / Total Listings" color="text-red-600" />
              <MetricCard label="Tier-3 Participation" value="38%" sub="Target: 40% by Q4" color="text-green-600" />
              <MetricCard label="Mission Alignment" value="62%" sub="Aligned to Govt Schemes" color="text-blue-600" />
            </div>

            {/* IMPACT SLIDE */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Projected National Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <ImpactStat val="45%" desc="Reduction in Unpaid Internships within 6 months via Policy Engine enforcement." />
                 <ImpactStat val="2.5x" desc="Increase in Tier-3 City student participation via verified remote opportunities." />
                 <ImpactStat val="100%" desc="Traceability of stipend funds to student bank accounts (DBT Integration)." />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ViolationFeed />
              <MissionChart />
            </div>
          </div>
        )}

        {/* --- TAB 2: POLICY CONFIGURATION ENGINE --- */}
        {activeTab === "policy" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg"><Settings className="w-6 h-6" /></div>
                <div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white">Policy Configuration Engine</h3>
                   <p className="text-sm text-gray-500">Define the rules that the AI enforces.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Minimum Stipend (Tier 1 Cities)</label>
                  <div className="flex gap-2">
                     <span className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-gray-500 font-bold">₹</span>
                     <input 
                       type="number" 
                       name="minStipendTier1"
                       value={policy.minStipendTier1}
                       onChange={handlePolicyChange}
                       className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white font-mono"
                     />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max Allowed Unpaid Duration</label>
                  <div className="flex gap-2 items-center">
                     <input 
                       type="number" 
                       name="maxUnpaidMonths"
                       value={policy.maxUnpaidMonths}
                       onChange={handlePolicyChange}
                       className="w-20 p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white font-mono"
                     />
                     <span className="text-sm font-bold text-gray-500">Months</span>
                  </div>
                  <p className="text-xs text-red-500 mt-1">Violations above this limit trigger automatic blocks.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                   <span className="font-bold text-gray-700 dark:text-gray-300">Allow Remote Internship Exceptions?</span>
                   <input type="checkbox" checked={policy.remoteAllowed} className="w-5 h-5 accent-indigo-600" readOnly />
                </div>

                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 flex justify-center items-center">
                   <Save className="w-4 h-4 mr-2" /> Publish New Policy Rules
                </button>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-xl border border-indigo-100 dark:border-indigo-800">
               <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4">Live Simulation Preview</h3>
               <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                     <p className="text-xs font-bold text-red-500 uppercase">Violation Detected</p>
                     <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">Stipend Below Minimum Wage</p>
                     <p className="text-xs text-gray-500 mt-1">Rule: Stipend ₹6,000 &lt; Configured ₹{policy.minStipendTier1}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                     <p className="text-xs font-bold text-green-600 uppercase">Compliant Listing</p>
                     <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">Duration Within Limits</p>
                     <p className="text-xs text-gray-500 mt-1">Offer: 2 Months &le; Configured {policy.maxUnpaidMonths} Months</p>
                  </div>
               </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: DATA PIPELINES --- */}
        {activeTab === "data" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
             <PipelineCard name="NIP API Integration" status="Live" source="National Portal" icon={<Server/>} />
             <PipelineCard name="AICTE / TPO Bulk Upload" status="Processing" source="Colleges" icon={<Database/>} />
             <PipelineCard name="MCA Company Verification" status="Syncing" source="Ministry of Corp Affairs" icon={<Building/>} />
          </div>
        )}

      </div>

      {/* --- POST MODAL --- */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                 <h3 className="font-bold text-lg flex items-center"><Plus className="w-5 h-5 mr-2" /> Post Official Opportunity</h3>
                 <button onClick={() => setShowPostModal(false)} className="hover:bg-indigo-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              
              <form onSubmit={handlePostInternship} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Internship Title</label>
                    <input name="title" required placeholder="e.g. Junior React Developer" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" onChange={handlePostInputChange}/>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Company</label>
                        <input name="company" required placeholder="e.g. TechCorp" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" onChange={handlePostInputChange}/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                        <input name="location" required placeholder="e.g. Mumbai" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" onChange={handlePostInputChange}/>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Stipend</label>
                        <input name="stipend" required placeholder="e.g. ₹15,000" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" onChange={handlePostInputChange}/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                        <input name="duration" required placeholder="e.g. 6 Months" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" onChange={handlePostInputChange}/>
                    </div>
                 </div>
                 <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-xs text-yellow-800 dark:text-yellow-400 flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                    Note: This listing will be automatically audited by the AI Viability Engine before appearing on the student feed.
                 </div>
                 
                 <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg">
                    Verify & Post Listing
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

// --- SUB-COMPONENTS ---
const MetricCard = ({ label, value, sub, color }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
    <p className="text-gray-500 text-xs font-bold uppercase mb-1">{label}</p>
    <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
    <p className="text-xs text-gray-400 mt-2">{sub}</p>
  </div>
);

const ImpactStat = ({ val, desc }) => (
  <div className="text-center">
    <div className="text-4xl font-black text-indigo-600 mb-2">{val}</div>
    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

const PipelineCard = ({ name, status, source, icon }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
    <div className="flex items-center gap-4">
       <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">{icon}</div>
       <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-xs text-gray-500">Source: {source}</p>
       </div>
    </div>
    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
       <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div> {status}
    </span>
  </div>
);

const ViolationFeed = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
    <div className="p-4 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20 flex items-center justify-between">
       <h3 className="font-bold text-red-900 dark:text-red-200 flex items-center"><ShieldAlert className="w-4 h-4 mr-2"/> Active Violations</h3>
    </div>
    <div className="p-4">
       {[1,2,3].map(i => (
         <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div>
               <p className="font-bold text-sm text-gray-900 dark:text-white">ScamTech Solutions Pvt Ltd</p>
               <p className="text-xs text-red-500 font-medium">Violation: Unpaid Labor ({'>'}60 days)</p>
            </div>
            <button className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded font-bold hover:bg-gray-200 dark:hover:bg-gray-700">Audit</button>
         </div>
       ))}
    </div>
  </div>
);

const MissionChart = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Workforce Alignment</h3>
    <div className="space-y-4">
      <div className="flex items-center text-xs font-bold text-gray-500 justify-between"><span>Digital India</span> <span>45%</span></div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-600 h-2 w-[45%]"></div></div>
      
      <div className="flex items-center text-xs font-bold text-gray-500 justify-between"><span>Green Hydrogen</span> <span>30%</span></div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-green-600 h-2 w-[30%]"></div></div>
    </div>
  </div>
);

export default AdminDashboard;