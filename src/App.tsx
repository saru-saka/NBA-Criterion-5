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
  TrendingDown
} from 'lucide-react';
import { NBA_DATA, YearData } from './data';

// Simplified helper for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button
    id={`tab-${label.toLowerCase().replace(/\s+/g, '-')}`}
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2",
      active 
        ? "border-blue-600 text-blue-600 bg-blue-50" 
        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    )}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const CalculationCard = ({ title, value, unit, subtitle, colorClass }: { title: string, value: string | number, unit?: string, subtitle?: string, colorClass: string }) => (
  <div className={cn("p-6 rounded-xl border flex flex-col gap-1", colorClass)}>
    <span className="text-sm font-medium opacity-80">{title}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold tracking-tight">{value}</span>
      {unit && <span className="text-sm opacity-80">{unit}</span>}
    </div>
    {subtitle && <span className="text-xs mt-1 font-medium italic">{subtitle}</span>}
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('summary');

  const calculateSFR = (data: YearData) => {
    if (!data.facultyCount) return "0.00";
    return (data.students / data.facultyCount).toFixed(2);
  };
  
  const calculateFQI = (data: YearData) => {
    const rf = data.students / 20;
    if (rf === 0) return "0.00";
    const fqi = 2.5 * ((10 * data.phdCount + 4 * data.mastersCount) / rf);
    return fqi.toFixed(2);
  };

  const calculateCadre = (data: YearData) => {
    const rfTotal = data.students / 20;
    if (rfTotal === 0) return { marks: "0.00", rf: { rf1: "0", rf2: "0", rf3: "0" } };
    
    const rf1 = (1/9) * rfTotal;
    const rf2 = (2/9) * rfTotal;
    const rf3 = (6/9) * rfTotal;
    
    const marks = (
      (Math.min(data.professors / rf1, 1)) + 
      (Math.min(data.associateProfessors / rf2, 1) * 0.6) + 
      (Math.min(data.assistantProfessors / rf3, 1) * 0.4)
    ) * 12.5;
    
    return {
      marks: Math.min(marks, 25).toFixed(2),
      rf: { rf1: rf1.toFixed(1), rf2: rf2.toFixed(1), rf3: rf3.toFixed(1) }
    };
  };

  const getSafeAverage = (calculator: (d: YearData) => string | {marks: string}) => {
    const sum = NBA_DATA.reduce((acc, curr) => {
      const res = calculator(curr);
      const val = typeof res === 'string' ? res : res.marks;
      return acc + parseFloat(val);
    }, 0);
    return (sum / Math.max(NBA_DATA.length, 1)).toFixed(2);
  };

  const averageSFR = getSafeAverage(calculateSFR);
  const averageFQI = getSafeAverage(calculateFQI);
  const averageCadreMarks = getSafeAverage(calculateCadre);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">NBA Criterion 5</h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Faculty Information & Contributions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">HKBK College of Engineering</p>
              <p className="text-xs text-gray-500">Dept. of Computer Science & Engineering</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <nav className="flex whitespace-nowrap scrollbar-hide">
            <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={Calculator} label="Summary & Results" />
            <TabButton active={activeTab === '5.1'} onClick={() => setActiveTab('5.1')} icon={Ratio} label="5.1 SFR" />
            <TabButton active={activeTab === '5.2'} onClick={() => setActiveTab('5.2')} icon={GraduationCap} label="5.2 Qualification" />
            <TabButton active={activeTab === '5.3'} onClick={() => setActiveTab('5.3')} icon={UserCheck} label="5.3 Cadre Proportion" />
            <TabButton active={activeTab === 'retention'} onClick={() => setActiveTab('retention')} icon={TrendingDown} label="5.5 Retention" />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'summary' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CalculationCard 
                title="Average SFR (3 years)" 
                value={averageSFR} 
                unit=": 1" 
                subtitle="Criterion 5.1 (Max 30)" 
                colorClass="bg-blue-600 text-white border-blue-700"
              />
              <CalculationCard 
                title="Average FQI" 
                value={averageFQI} 
                subtitle="Criterion 5.2 (Max 25)" 
                colorClass="bg-emerald-600 text-white border-emerald-700"
              />
              <CalculationCard 
                title="Avg Cadre Marks" 
                value={averageCadreMarks} 
                subtitle="Criterion 5.3 (Max 25)" 
                colorClass="bg-indigo-600 text-white border-indigo-700"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  Overall Assessment Table
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-600">
                    <tr>
                      <th className="px-6 py-4">Assessment Year</th>
                      <th className="px-6 py-4 text-center">Students (S)</th>
                      <th className="px-6 py-4 text-center">Faculty (F)</th>
                      <th className="px-6 py-4 text-center">SFR (S/F)</th>
                      <th className="px-6 py-4 text-center">FQI</th>
                      <th className="px-6 py-4 text-center">Cadre Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {NBA_DATA.map((data, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{data.year}</td>
                        <td className="px-6 py-4 text-center">{data.students}</td>
                        <td className="px-6 py-4 text-center">{data.facultyCount}</td>
                        <td className="px-6 py-4 text-center text-blue-600 font-bold">{calculateSFR(data)}</td>
                        <td className="px-6 py-4 text-center text-emerald-600 font-bold">{calculateFQI(data)}</td>
                        <td className="px-6 py-4 text-center text-indigo-600 font-bold">{calculateCadre(data).marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs follow similar structure but simplified for robustness */}
        {activeTab === '5.1' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3 items-start">
              <Calculator className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-bold mb-1 underline">Formula: Student-Faculty Ratio (SFR)</p>
                <p>S = Total number of students in the Department</p>
                <p>F = Total number of regular/contractual faculty (Full Time)</p>
                <p>SFR = S/F (Target: 15:1 for max 30 marks)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {NBA_DATA.map((data, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 p-4 font-bold border-b text-gray-700 flex justify-between items-center">
                    <span>{data.year}</span>
                    <span className="text-blue-600 px-3 py-1 bg-blue-100 rounded-full text-xs">SFR: {calculateSFR(data)}</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Total Students (S)</span>
                      <span className="font-mono font-bold text-gray-900">{data.students}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Total Faculty (F)</span>
                      <span className="font-mono font-bold text-gray-900">{data.facultyCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === '5.2' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
              <p className="text-emerald-800 font-bold mb-2">Formula: Faculty Qualification Index (FQI)</p>
              <div className="bg-white/50 p-3 rounded font-mono text-sm border border-emerald-100">
                FQI = 2.5 * [(10X + 4Y) / RF]
              </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="p-4 text-left">Year</th>
                    <th className="p-4 text-center">X (Ph.D)</th>
                    <th className="p-4 text-center">Y (Masters)</th>
                    <th className="p-4 text-center">RF (S/20)</th>
                    <th className="p-4 text-center">FQI Value</th>
                  </tr>
                </thead>
                <tbody>
                  {NBA_DATA.map((data, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-4 font-bold">{data.year}</td>
                      <td className="p-4 text-center">{data.phdCount}</td>
                      <td className="p-4 text-center">{data.mastersCount}</td>
                      <td className="p-4 text-center">{(data.students / 20).toFixed(2)}</td>
                      <td className="p-4 text-center text-emerald-600 font-bold text-lg">{calculateFQI(data)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === '5.3' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
              <p className="text-indigo-900 font-bold mb-2">Faculty Cadre Proportion (Max 25)</p>
            </div>
            {NBA_DATA.map((data, idx) => {
              const cadre = calculateCadre(data);
              return (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-indigo-500">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-lg font-bold text-gray-800">{data.year}</h4>
                    <p className="text-2xl font-black text-indigo-600">{cadre.marks} / 25</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Professors</p>
                      <p className="text-sm">Available: {data.professors} / Req: {cadre.rf.rf1}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Associate Profs</p>
                      <p className="text-sm">Available: {data.associateProfessors} / Req: {cadre.rf.rf2}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Assistant Profs</p>
                      <p className="text-sm">Available: {data.assistantProfessors} / Req: {cadre.rf.rf3}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'retention' && (
          <div className="space-y-6">
            <div className="bg-slate-800 text-white p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-2">5.5 Faculty Retention (Max 10)</h2>
              <p className="opacity-80 text-sm">Target Average Assessment: 9.54 / 10</p>
            </div>
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-800">Average Retention Score: <span className="text-emerald-600">9.54</span></p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Faculty: 109</span>
            <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-emerald-600" /> Ph.D: 23</span>
          </div>
          <div className="text-blue-700 flex items-center gap-1">NBA COMPLIANT <ChevronRight className="w-4 h-4" /></div>
        </div>
      </footer>
    </div>
  );
}
