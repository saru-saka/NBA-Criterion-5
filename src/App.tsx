/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Users, 
  GraduationCap, 
  Ratio, 
  ChevronRight, 
  FileText, 
  Calculator,
  UserCheck,
  TrendingDown,
  LayoutDashboard,
  Upload,
  Search
} from 'lucide-react';
import { NBA_DATA, YearData, FacultyEntry } from './data';

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
  const [facultyList, setFacultyList] = useState<FacultyEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
      
      // Skip header row and map data
      const newFaculty: FacultyEntry[] = jsonData.slice(1)
        .filter(row => row && row.length > 0 && row[1]) // Ensure row exists and has a name
        .map((row, index) => {
          return {
            sn: parseInt(row[0]) || index + 1,
            name: String(row[1] || 'Unknown'),
            pan: String(row[2] || ''),
            degree: String(row[3] || ''),
            university: String(row[4] || ''),
            specialization: String(row[5] || ''),
            joiningDate: String(row[6] || ''),
            experience: parseFloat(row[7]) || 0,
            joiningDesignation: String(row[8] || ''),
            presentDesignation: String(row[9] || ''),
            nature: String(row[10] || 'Regular'),
            currentlyAssociated: String(row[11])?.toLowerCase().startsWith('y') || row[11] === "" || true,
          };
        });
      
      setFacultyList(prev => [...prev, ...newFaculty]);
    };
    reader.readAsArrayBuffer(file);
  };

  const calculateSFR = (data: YearData) => (data.students / (facultyList.length || data.facultyCount)).toFixed(2);
  
  const calculateFQI = (data: YearData) => {
    const rf = data.students / 20;
    const phds = facultyList.length ? facultyList.filter(f => f.degree.toLowerCase().includes('ph.d')).length : data.phdCount;
    const masters = facultyList.length ? facultyList.filter(f => f.degree.toLowerCase().includes('m.tech') || f.degree.toLowerCase().includes('me') || f.degree.toLowerCase().includes('master')).length : data.mastersCount;
    return (2.5 * ((10 * phds + 4 * masters) / rf)).toFixed(2);
  };

  const calculateCadre = (data: YearData) => {
    const rfTotal = data.students / 20;
    const rf1 = (1/9) * rfTotal;
    const rf2 = (2/9) * rfTotal;
    const rf3 = (6/9) * rfTotal;
    
    const profs = facultyList.length ? facultyList.filter(f => f.presentDesignation.toLowerCase().includes('prof') && !f.presentDesignation.toLowerCase().includes('assoc')).length : data.professors;
    const assocProfs = facultyList.length ? facultyList.filter(f => f.presentDesignation.toLowerCase().includes('assoc')).length : data.associateProfessors;
    const asstProfs = facultyList.length ? facultyList.filter(f => f.presentDesignation.toLowerCase().includes('asst')).length : data.assistantProfessors;

    const marks = (
      (Math.min(profs / rf1, 1)) + 
      (Math.min(assocProfs / rf2, 1) * 0.6) + 
      (Math.min(asstProfs / rf3, 1) * 0.4)
    ) * 12.5;
    
    return Math.min(marks, 25).toFixed(2);
  };

  const averageSFR = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateSFR(curr)), 0) / 3).toFixed(2);
  const averageFQI = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateFQI(curr)), 0) / 3).toFixed(2);
  const averageCadre = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(calculateCadre(curr)), 0) / 3).toFixed(2);
  const averageRetention = (NBA_DATA.reduce((acc, curr) => acc + parseFloat(curr.retentionScore), 0) / 3).toFixed(2);

  const filteredFaculty = facultyList.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.presentDesignation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
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
          <div className="hidden md:flex gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".csv, .xlsx, .xls" 
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-md group"
            >
              <Upload size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Upload Faculty Data
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <nav className="flex space-x-2 pb-0">
            {[
              { id: 'summary', icon: Calculator, label: 'Overview' },
              { id: 'faculty', icon: Users, label: 'Faculty Directory' },
              { id: '5.1', icon: Ratio, label: '5.1 SFR' },
              { id: '5.2', icon: GraduationCap, label: '5.2 FQI' },
              { id: '5.3', icon: UserCheck, label: '5.3 Cadre' },
              { id: '5.5', icon: TrendingDown, label: '5.5 Retention' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Avg 5.1 SFR" value={averageSFR} label=": 1" subtitle="3 Year Average (Max 30)" color="bg-blue-600 text-white border-blue-700" />
              <StatCard title="Avg 5.2 FQI" value={averageFQI} label="Pts" subtitle="Qualification Index (Max 25)" color="bg-emerald-600 text-white border-emerald-700" />
              <StatCard title="Avg 5.3 Cadre" value={averageCadre} label="Pts" subtitle="Cadre Proportion (Max 25)" color="bg-indigo-600 text-white border-indigo-700" />
              <StatCard title="Avg 5.5 Retention" value={averageRetention} label="/ 10" subtitle="Experience Metric (Max 10)" color="bg-slate-800 text-white border-slate-900" />
            </div>

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
                        <td className="px-8 py-5 text-center font-medium">{facultyList.length || data.facultyCount}</td>
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

        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search by name, degree, or designation..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase">
                Showing {filteredFaculty.length} Faculty Members
              </div>
            </div>

            <div className="card-gradient bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 text-center">
                    <tr>
                      <th className="px-6 py-4 text-left">S.N.</th>
                      <th className="px-6 py-4 text-left">Faculty Name</th>
                      <th className="px-6 py-4">Degree</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4">Designation</th>
                      <th className="px-6 py-4">Association</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFaculty.length > 0 ? (
                      filteredFaculty.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-left text-slate-400 font-mono">{f.sn}</td>
                          <td className="px-6 py-4 text-left font-bold text-slate-900">{f.name}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                              {f.degree}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-blue-600">{f.experience} Yrs</td>
                          <td className="px-6 py-4 text-center text-slate-500 font-medium">{f.presentDesignation}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-[10px] uppercase font-black px-2 py-1 rounded shadow-sm ${f.nature === 'Regular' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {f.nature}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className={`w-2 h-2 rounded-full mx-auto ${f.currentlyAssociated ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-32 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                              <Users size={32} />
                            </div>
                            <div>
                              <p className="text-slate-900 font-bold">No faculty records found</p>
                              <p className="text-slate-400 text-xs">Upload an Excel or CSV file to populate the list and refresh assessments.</p>
                            </div>
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all"
                            >
                              Upload Now
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 bg-slate-100 border border-slate-200 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Excel/CSV Data Mapping Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] font-bold text-slate-500">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-900 uppercase tracking-tighter">Column 1: SN</span>
                  <span className="text-slate-900 uppercase tracking-tighter">Column 2: Name</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-900 uppercase tracking-tighter">Column 3: PAN</span>
                  <span className="text-slate-900 uppercase tracking-tighter">Column 4: Degree</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-900 uppercase tracking-tighter">Column 8: Experience</span>
                  <span className="text-slate-900 uppercase tracking-tighter">Column 10: Designation</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-900 uppercase tracking-tighter">Column 11: Nature</span>
                  <span className="text-slate-900 uppercase tracking-tighter">Column 12: Associated</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Previous tabs (5.1, 5.2, 5.3, 5.5) remain with updated dynamic calculation support */}
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
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-100 rounded-xl font-bold">
                    <span className="text-[10px] uppercase text-slate-400">Students (S)</span>
                    <span className="text-xl text-slate-900">{data.students}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-100 rounded-xl font-bold">
                    <span className="text-[10px] uppercase text-slate-400">Faculty (F)</span>
                    <span className="text-xl text-slate-900">{facultyList.length || data.facultyCount}</span>
                  </div>
                  <div className="pt-4 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ratio (S/F)</p>
                    <p className="text-4xl font-black text-blue-600">{calculateSFR(data)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === '5.2' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 bg-emerald-700 text-white rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <GraduationCap />
                5.2 Faculty Qualification
              </h2>
              <p className="opacity-80 text-sm font-medium">Index = 2.5 * [(10X + 4Y) / RF]. RF = S/20.</p>
            </div>
            <div className="card-gradient bg-white p-8">
               <table className="w-full text-center">
                 <thead className="border-b text-[10px] uppercase font-black text-slate-400">
                   <tr>
                     <th className="py-4 text-left">Academic Year</th>
                     <th className="py-4">X (Ph.D)</th>
                     <th className="py-4">Y (Masters)</th>
                     <th className="py-4">Required (RF)</th>
                     <th className="py-4 text-emerald-600">FQI Result (Max 25)</th>
                   </tr>
                 </thead>
                 <tbody>
                   {NBA_DATA.map((data, idx) => (
                     <tr key={idx} className="border-b last:border-0 hover:bg-slate-50 transition-colors font-bold">
                       <td className="py-6 text-left">{data.year}</td>
                       <td className="py-6 text-lg font-black text-slate-900">
                         {facultyList.length ? facultyList.filter(f => f.degree.toLowerCase().includes('ph.d')).length : data.phdCount}
                       </td>
                       <td className="py-6 text-lg font-black text-slate-900">
                         {facultyList.length ? facultyList.filter(f => f.degree.toLowerCase().includes('m.tech') || f.degree.toLowerCase().includes('me') || f.degree.toLowerCase().includes('master')).length : data.mastersCount}
                       </td>
                       <td className="py-6 text-slate-400">{(data.students / 20).toFixed(1)}</td>
                       <td className="py-6 text-2xl font-black text-emerald-600">{calculateFQI(data)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === '5.3' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 bg-indigo-700 text-white rounded-2xl shadow-xl">
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <UserCheck />
                5.3 Faculty Cadre Proportion
              </h2>
              <p className="opacity-80 text-sm font-medium">Cadre Ratio: 1 Prof : 2 Assoc : 6 Asst</p>
            </div>
            
            <div className="card-gradient bg-white p-8 overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr className="border-b bg-slate-50 text-[10px] uppercase font-black text-slate-500">
                    <th rowSpan={2} className="px-4 py-4 text-left border-r">Year</th>
                    <th colSpan={2} className="px-4 py-2 border-b border-r">Professors</th>
                    <th colSpan={2} className="px-4 py-2 border-b border-r">Associate Prof.</th>
                    <th colSpan={2} className="px-4 py-2 border-b border-r">Assistant Prof.</th>
                    <th rowSpan={2} className="px-4 py-4 text-indigo-600">Total Marks</th>
                  </tr>
                  <tr className="border-b bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                    <th className="px-4 py-2 border-r">Required</th>
                    <th className="px-4 py-2 border-r text-slate-900">Available</th>
                    <th className="px-4 py-2 border-r">Required</th>
                    <th className="px-4 py-2 border-r text-slate-900">Available</th>
                    <th className="px-4 py-2 border-r">Required</th>
                    <th className="px-4 py-2 border-r text-slate-900 border-r-0">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {NBA_DATA.map((data, idx) => {
                    const rf = data.students / 20;
                    const profs = facultyList.length ? facultyList.filter(f => f.presentDesignation.toLowerCase().includes('prof') && !f.presentDesignation.toLowerCase().includes('assoc')).length : data.professors;
                    const assocProfs = facultyList.length ? facultyList.filter(f => f.presentDesignation.toLowerCase().includes('assoc')).length : data.associateProfessors;
                    const asstProfs = facultyList.length ? facultyList.filter(f => f.presentDesignation.toLowerCase().includes('asst')).length : data.assistantProfessors;

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors font-medium">
                        <td className="px-4 py-5 text-left font-bold border-r">{data.year}</td>
                        <td className="px-4 py-5 border-r">{(rf / 9).toFixed(1)}</td>
                        <td className="px-4 py-5 border-r font-black text-slate-900">{profs}</td>
                        <td className="px-4 py-5 border-r">{(2 * rf / 9).toFixed(1)}</td>
                        <td className="px-4 py-5 border-r font-black text-slate-900">{assocProfs}</td>
                        <td className="px-4 py-5 border-r">{(6 * rf / 9).toFixed(1)}</td>
                        <td className="px-4 py-5 border-r font-black text-slate-900">{asstProfs}</td>
                        <td className="px-4 py-5 text-xl font-black text-indigo-600">{calculateCadre(data)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === '5.5' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-xl">
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <TrendingDown />
                5.5 Faculty Retention
              </h2>
              <p className="opacity-80 text-sm font-medium">Institutional stability tracking based on tenure length.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card-gradient bg-white p-8">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Experience Spread</h4>
                <div className="space-y-4">
                  {['experienceA', 'experienceB', 'experienceC', 'experienceD'].map((key) => {
                    const latest = NBA_DATA[0] as any;
                    const labels: any = { experienceA: '>= 5 Years', experienceB: '3-5 Years', experienceC: '1-3 Years', experienceD: '< 1 Year' };
                    const colors: any = { experienceA: 'bg-emerald-500', experienceB: 'bg-indigo-500', experienceC: 'bg-blue-500', experienceD: 'bg-slate-300' };
                    
                    const count = facultyList.length 
                      ? (key === 'experienceA' ? facultyList.filter(f => f.experience >= 5).length : 
                         key === 'experienceB' ? facultyList.filter(f => f.experience >= 3 && f.experience < 5).length :
                         key === 'experienceC' ? facultyList.filter(f => f.experience >= 1 && f.experience < 3).length :
                         facultyList.filter(f => f.experience < 1).length)
                      : latest[key];

                    const total = facultyList.length || latest.facultyCount;
                    const percentage = (count / total * 100).toFixed(1);
                    
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span>{labels[key]}</span>
                          <span className="text-slate-400">{count} Members ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[key]} transition-all duration-700`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card-gradient bg-white p-8">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Yearly Performance</h4>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b">
                    <tr>
                      <th className="px-4 py-4 text-left">Academic Year</th>
                      <th className="px-4 py-4">Total Staff</th>
                      <th className="px-4 py-4 text-emerald-600">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {NBA_DATA.map((data, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-4 font-bold">{data.year}</td>
                        <td className="px-4 py-4 text-center font-medium font-mono">{facultyList.length || data.facultyCount}</td>
                        <td className="px-4 py-4 text-center text-lg font-black text-slate-900">{data.retentionScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center z-40 px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">NBA Dashboard Active</span>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1">
                <Users size={12} /> Live Faculty Count: {facultyList.length || 369}
              </span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-900 flex items-center gap-2 font-bold cursor-help group">
              HKBK Engineering Analytics <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
      </footer>
    </div>
  );
}

