import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SkillGapChart = ({ userSkills, allInternships }) => {
  // Safety Check
  if (!allInternships || !Array.isArray(allInternships) || allInternships.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">🚀 Skill Analysis</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">No internship data available yet.</p>
      </div>
    );
  }

  // 1. Analyze Market Demand
  const skillCounts = {};
  
  allInternships.forEach(job => {
    if (job.skillsRequired) {
      job.skillsRequired.forEach(skill => {
        const cleanSkill = skill.toLowerCase().trim();
        skillCounts[cleanSkill] = (skillCounts[cleanSkill] || 0) + 1;
      });
    }
  });

  // 2. Filter out skills the user ALREADY has
  const userHas = userSkills ? userSkills.map(s => s.toLowerCase().trim()) : [];
  
  const missingSkills = Object.keys(skillCounts)
    .filter(skill => !userHas.includes(skill))
    .map(skill => ({
      name: skill.charAt(0).toUpperCase() + skill.slice(1),
      value: skillCounts[skill]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        🚀 Boost Your Salary
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Top skills missing from your profile:
      </p>

      {/* CHART CONTAINER */}
      <div style={{ width: '100%', height: 300, minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={missingSkills} layout="vertical" margin={{ left: 10, right: 10 }}>
            <XAxis type="number" hide />
            
            {/* Y-AXIS: Fixed color to be visible on both Light (#4b5563) and Dark (#9ca3af) */}
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{fontSize: 12, fill: '#9CA3AF', fontWeight: 500}} 
            />
            
            {/* TOOLTIP: Custom Dark Style */}
            <Tooltip 
              cursor={{fill: 'transparent'}} 
              contentStyle={{ 
                backgroundColor: '#1f2937', // Dark Gray
                border: '1px solid #374151', 
                borderRadius: '8px', 
                color: '#f3f4f6',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' 
              }}
              itemStyle={{ color: '#e5e7eb' }}
            />
            
            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
              {missingSkills.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#93C5FD'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillGapChart;