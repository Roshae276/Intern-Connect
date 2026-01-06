import React, { useState } from 'react';
import { MapPin, Clock, Banknote, ShieldCheck, AlertTriangle, ChevronRight, Info, Building2, Gavel } from 'lucide-react';
import { getGovMission, checkExploitation, calculateIVI, getCompanyCredibility } from '../utils/governmentLogic';

const InternshipCard = ({ internship }) => {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [applied, setApplied] = useState(false);
  
  const { title, company, location, stipend, duration, skillsRequired } = internship;

  // LOGIC
  const mission = getGovMission(title, skillsRequired);
  const exploitation = checkExploitation(stipend, duration, location);
  const iviScore = calculateIVI(stipend, duration, location);
  const credibility = getCompanyCredibility(company);

  // HANDLERS
  const handleApplyClick = () => {
    if (exploitation.isExploitative) {
      setShowConsentModal(true); // Trigger Consent Override
    } else {
      setApplied(true);
      alert("✅ Application Submitted via National Portal");
    }
  };

  const confirmConsent = () => {
    setShowConsentModal(false);
    setApplied(true);
    alert("⚠️ Application Submitted with Informed Consent. This action has been logged for Ministry review.");
  };

  return (
    <>
      <div className={`group bg-white dark:bg-gray-900 rounded-xl border transition-all duration-200 flex flex-col relative overflow-hidden hover:shadow-lg ${exploitation.isExploitative ? 'border-red-500 border-l-4' : 'border-gray-200 dark:border-gray-800'}`}>
        
        {/* 1. LEGAL REASON ENGINE (The "Why") */}
        {exploitation.isExploitative && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 border-b border-red-100 dark:border-red-900/50">
            <div className="flex items-start gap-2">
              <Gavel className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">
                  {exploitation.type} (Rule {exploitation.ruleCode})
                </p>
                <p className="text-[11px] text-red-600 dark:text-red-300 mt-0.5">
                  {exploitation.explanation}
                </p>
                <p className="text-[10px] font-mono bg-white dark:bg-black/20 px-1.5 py-0.5 rounded mt-1 inline-block border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
                  {exploitation.comparison}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 flex flex-col gap-3">
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${mission.color}`}>
                    <ShieldCheck className="w-3 h-3 mr-1" /> {mission.name}
                 </span>
                 <h3 className="font-bold text-gray-900 dark:text-white text-lg">{title}</h3>
                 
                 {/* 2. COMPANY CREDIBILITY SCORE */}
                 <div className="flex items-center gap-2 mt-1">
                   <p className="text-xs text-gray-500 font-medium">{company}</p>
                   <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${credibility.score > 80 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                     Cred: {credibility.grade}
                   </span>
                 </div>
              </div>

              {/* IVI SCORE */}
              <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 min-w-[60px]">
                <span className="text-[9px] font-bold uppercase text-gray-500">IVI</span>
                <span className={`text-xl font-black ${iviScore > 75 ? 'text-green-600' : 'text-yellow-600'}`}>{iviScore}</span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
               <div className="flex items-center"><Banknote className="w-3.5 h-3.5 mr-1.5 text-gray-400"/> {stipend}</div>
               <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400"/> {duration}</div>
               <div className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400"/> {location}</div>
            </div>

            {/* BUTTONS */}
            <button 
              onClick={handleApplyClick}
              disabled={applied}
              className={`w-full mt-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${
                applied 
                ? "bg-green-100 text-green-700 cursor-default"
                : exploitation.isExploitative
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-gray-900 dark:bg-indigo-600 text-white hover:bg-gray-800"
              }`}
            >
              {applied ? "Applied ✅" : exploitation.isExploitative ? "Review Blocked Application" : "Apply Now"} 
            </button>
        </div>
      </div>

      {/* 3. STUDENT CONSENT OVERRIDE MODAL */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-600 p-4 text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Regulatory Warning</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-900 dark:text-white font-bold mb-2">This internship violates Ministry Policy {exploitation.ruleCode}.</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                The government has flagged this opportunity because: <br/>
                <span className="font-mono text-red-600 bg-red-50 px-1 py-0.5 rounded">{exploitation.explanation}</span>
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 text-xs text-yellow-800">
                <strong>Student Rights Notice:</strong> By proceeding, you acknowledge the risk. This action will be logged in the National Internship Health Index for audit purposes.
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowConsentModal(false)} className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button onClick={confirmConsent} className="flex-1 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">
                  Apply with Informed Consent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InternshipCard;