/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Ratio, 
  ChevronRight, 
  FileText, 
  Calculator,
  UserCheck,
  TrendingDown,
  LayoutDashboard
} from 'lucide-react';
import { NBA_DATA, YearData } from './data';

const StatCard = ({ title, value, label, subtitle, color }: { title: string, value: string, label: string, subtitle?: string, color: string }) => (
  <div className={`p-6 rounded-2xl border transition-all duration-300 ${color} shadow-sm hover:shadow-md`}>
    <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">{title}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-4xl font-black">{value}</span>
      <span className="text-sm font-bold opacity-70">{label}</span>
    </div>
    {subtitle && <p className="mt-2 text-xs font-medium opacity-60 italic">{subtitle}</p>}
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('summary');

  const calculateSFR = (data: YearData) => (data.students / data.facultyCount).toFixed(2);
  
  const calculateFQI = (data: YearData) => {
    const rf = data.students / 20;
    return (2.5 * ((10 * data.phdCount + 4 * data.mastersCount) / rf)).toFixed(2);
  };

  const calculateCadre = (data: YearData) => {
    const rfTotal = data.students / 20;
    const rf1 = (1/9) * rfTotal;
    const rf2 = (2/9) * rfTotal;
    const rf3 = (6/9) * rfTotal;
    
    const marks = (
      (Math.min(data.professors / rf1, 1)) + 
      (Math.min(data.associateProfessors / rf2, 1) * 0.6) + 
      (Math.min(data.assistantProfessors / rf3, 1) * 0.4)
    ) * 12.5;
    
    return Math.min(marks, 25).toFixed(2);
  };

  const averageSFR = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateSFR(curr)), 0) / 3).toFixed(2);
  const averageFQI = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateFQI(curr)), 0) / 3).toFixed(2);
  const averageCadre = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateCadre(curr)), 0) / 3).toFixed(2);
  const averageRetention = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(curr.retentionScore), 0) / 3).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar-ish Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">NBA Criterion 5</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Faculty Information System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">HKBK College of Engineering</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <nav className="flex space-x-2 pb-0">
            {[
              { id: 'summary', icon: Calculator, label: 'Overview' },
              { id: '5.1', icon: Ratio, label: '5.1 SFR' },
              { id: '5.2', icon: GraduationCap, label: '5.2 FQI' },
              { id: '5.3', icon: UserCheck, label: '5.3 Cadre' },
              { id: '5.5', icon: TrendingDown, label: '5.5 Retention' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === tab.id 
                  ? 'border-blue-900 text-blue-900' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 pb-32">
        {activeTab === 'summary' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Avg 5.1 SFR" value={averageSFR} label=": 1" subtitle="3 Year Average (Max 30)" color="bg-blue-600 text-white border-blue-700" />
              <StatCard title="Avg 5.2 FQI" value={averageFQI} label="Pts" subtitle="Qualification Index (Max 25)" color="bg-emerald-600 text-white border-emerald-700" />
              <StatCard title="Avg 5.3 Cadre" value={averageCadre} label="Pts" subtitle="Proportion Match (Max 25)" color="bg-indigo-600 text-white border-indigo-700" />
              <StatCard title="Avg 5.5 Retention" value={averageRetention} label="/ 10" subtitle="Experience Metric (Max 10)" color="bg-slate-800 text-white border-slate-900" />
            </div>

            {/* Assessment Table */}
            <div className="card-gradient bg-white">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  Consolidated Assessment Results
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-black">
                    <tr>
                      <th className="px-8 py-5 text-left">Academic Year</th>
                      <th className="px-8 py-5 text-center">Students (S)</th>
                      <th className="px-8 py-5 text-center">Faculty (F)</th>
                      <th className="px-8 py-5 text-center">SFR</th>
                      <th className="px-8 py-5 text-center">FQI</th>
                      <th className="px-8 py-5 text-center">Cadre Marks</th>
                      <th className="px-8 py-5 text-center">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {NBA_DATA.map((data, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-5 font-bold text-slate-900">{data.year}</td>
                        <td className="px-8 py-5 text-center font-medium">{data.students}</td>
                        <td className="px-8 py-5 text-center font-medium">{data.facultyCount}</td>
                        <td className="px-8 py-5 text-center"><span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-black">{calculateSFR(data)}</span></td>
                        <td className="px-8 py-5 text-center text-emerald-600 font-bold">{calculateFQI(data)}</td>
                        <td className="px-8 py-5 text-center text-indigo-600 font-bold">{calculateCadre(data)}</td>
                        <td className="px-8 py-5 text-center text-slate-600 font-bold">{data.retentionScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5.1 Tab */}
        {activeTab === '5.1' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 bg-blue-900 text-white rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
                <Ratio />
                5.1 Student-Faculty Ratio
              </h2>
              <p className="opacity-80 max-w-2xl font-medium">Calculation based on total enrolled students versus active faculty teaching loads.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {NBA_DATA.map((data, idx) => (
                <div key={idx} className="card-gradient p-8 space-y-6">
                  <h4 className="text-xl font-black text-slate-900 border-b pb-4">{data.year}</h4>
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-100 rounded-xl">
                    <span className="text-xs font-bold uppercase text-slate-500">Students (S)</span>
                    <span className="text-xl font-black text-slate-900">{data.students}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-100 rounded-xl">
                    <span className="text-xs font-bold uppercase text-slate-500">Faculty (F)</span>
                    <span className="text-xl font-black text-slate-900">{data.facultyCount}</span>
                  </div>
                  <div className="pt-4 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ratio (S/F)</p>
                    <p className="text-4xl font-black text-blue-600">{calculateSFR(data)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5.2 Tab */}
        {activeTab === '5.2' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 bg-emerald-700 text-white rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <GraduationCap />
                5.2 Faculty Qualification
              </h2>
              <p className="opacity-80 text-sm font-mono uppercase tracking-widest">Index = 2.5 * [(10X + 4Y) / RF]</p>
            </div>
            <div className="card-gradient bg-white p-8">
               <table className="w-full">
                 <thead className="border-b text-xs uppercase font-black text-slate-400">
                   <tr>
                     <th className="py-4 text-left">Year</th>
                     <th className="py-4 text-center text-slate-900">X (Ph.D)</th>
                     <th className="py-4 text-center text-slate-900">Y (Masters)</th>
                     <th className="py-4 text-center text-slate-400">Required (RF)</th>
                     <th className="py-4 text-center text-emerald-600">FQI Result</th>
                   </tr>
                 </thead>
                 <tbody>
                   {NBA_DATA.map((data, idx) => (
                     <tr key={idx} className="border-b last:border-0">
                       <td className="py-6 font-bold">{data.year}</td>
                       <td className="py-6 text-center text-lg font-black">{data.phdCount}</td>
                       <td className="py-6 text-center text-lg font-black">{data.mastersCount}</td>
                       <td className="py-6 text-center font-mono opacity-50">{(data.students / 20).toFixed(1)}</td>
                       <td className="py-6 text-center text-2xl font-black text-emerald-600">{calculateFQI(data)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center z-40 px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Ready</span>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1">
                <Users size={12} /> Total Faculty Tracked: 369
              </span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-900 flex items-center gap-2">
              NBA COMPLIANCE REPORT <ChevronRight size={12} />
            </div>
        </div>
      </footer>
    </div>
  );
}
