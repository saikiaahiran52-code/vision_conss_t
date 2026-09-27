import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Maximize2, Layers, Cpu, 
  Box, Package, Wrench, Circle, Hexagon, 
  Grid, Droplet, Save, FileText, Download, 
  RefreshCw, Check, ArrowLeft, ArrowRight 
} from 'lucide-react';
import { calculateMaterials } from '../../utils/materialCalculations';
import { generateBOQPdf } from '../../utils/pdfExport';
import { generateBOQExcel } from '../../utils/excelExport';
import { useProjects } from '../../hooks/useProjects';

const NewProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addProject, updateProject } = useProjects();

  const [formData, setFormData] = useState({
    projectName: '', projectType: 'House', length: '', width: '', height: '',
    numFloors: '1', concreteGrade: 'M20'
  });
  const [results, setResults] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    if (location.state && location.state.project) {
      const p = location.state.project;
      setFormData({
        projectName: p.projectName,
        projectType: p.projectType,
        length: p.length || '',
        width: p.width || '',
        height: p.height || '',
        numFloors: p.numFloors || '1',
        concreteGrade: p.concreteGrade || 'M20'
      });
      setIsEdit(true);
      setProjectId(p.id);
      if (p.results) {
        setResults(p.results);
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEstimate = async (e) => {
    if (e) e.preventDefault();
    setIsEstimating(true);
    setTimeout(() => {
      const calculationInput = {
        projectType: formData.projectType,
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        numFloors: parseInt(formData.numFloors, 10),
        concreteGrade: formData.concreteGrade
      };
      const res = calculateMaterials(calculationInput);
      setResults(res);
      setIsEstimating(false);
    }, 500);
  };

  const getFullProjectObj = () => ({
    ...formData,
    results
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const projectData = getFullProjectObj();
      if (isEdit) {
        await updateProject(projectId, projectData);
      } else {
        await addProject(projectData);
      }
      navigate('/projects');
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      projectName: '', projectType: 'House', length: '', width: '', height: '',
      numFloors: '1', concreteGrade: 'M20'
    });
    setResults(null);
    setIsEdit(false);
    setProjectId(null);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const isStep1Valid = formData.projectName.trim().length >= 3;
  const isStep2Valid = parseFloat(formData.length) > 0 && parseFloat(formData.width) > 0 && parseFloat(formData.height) > 0 && parseInt(formData.numFloors, 10) > 0;
  
  const canProceed = () => {
    if (currentStep === 1) return isStep1Valid;
    if (currentStep === 2) return isStep2Valid;
    return true;
  };

  const steps = [
    { id: 1, label: 'Project Details' },
    { id: 2, label: 'Dimensions' },
    { id: 3, label: 'Grade' },
    { id: 4, label: 'Review' }
  ];

  const variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  };

  const renderStep1 = () => (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
        <div className="relative">
          <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Enter project name"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
          />
        </div>
        {!isStep1Valid && formData.projectName.length > 0 && (
          <p className="text-red-400 text-sm mt-2">Project name must be at least 3 characters</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em' }}
        >
          {['House', 'Slab', 'Beam', 'Column', 'Footing', 'Staircase', 'Wall'].map(type => (
            <option key={type} value={type} className="bg-gray-900">{type}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['length', 'width', 'height'].map((dim) => (
          <div key={dim}>
            <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">{dim} (m)</label>
            <div className="relative">
              <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name={dim}
                value={formData[dim]}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Number of Floors</label>
        <div className="relative">
          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            name="numFloors"
            value={formData.numFloors}
            onChange={handleChange}
            min="1"
            step="1"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <label className="block text-sm font-medium text-gray-300 mb-4">Concrete Grade</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { grade: 'M15', desc: 'Lean concrete, non-structural works' },
          { grade: 'M20', desc: 'Standard residential construction' },
          { grade: 'M25', desc: 'Heavy load bearing structures' },
          { grade: 'M30', desc: 'Commercial and high-rise buildings' }
        ].map(g => (
          <motion.div
            key={g.grade}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer p-4 rounded-xl border transition-all ${formData.concreteGrade === g.grade ? 'bg-blue-600/20 border-blue-500' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
            onClick={() => handleChange({ target: { name: 'concreteGrade', value: g.grade }})}
          >
            <h4 className="text-lg font-bold text-white mb-1">{g.grade}</h4>
            <p className="text-sm text-gray-400">{g.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Project Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
          <div>
            <span className="block text-sm text-gray-400">Project Name</span>
            <span className="text-white font-medium">{formData.projectName}</span>
          </div>
          <button onClick={() => setCurrentStep(1)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
          <div>
            <span className="block text-sm text-gray-400">Type</span>
            <span className="text-white font-medium">{formData.projectType}</span>
          </div>
          <button onClick={() => setCurrentStep(1)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
          <div>
            <span className="block text-sm text-gray-400">Dimensions</span>
            <span className="text-white font-medium">{formData.length || 0}m × {formData.width || 0}m × {formData.height || 0}m</span>
          </div>
          <button onClick={() => setCurrentStep(2)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center">
          <div>
            <span className="block text-sm text-gray-400">Floors</span>
            <span className="text-white font-medium">{formData.numFloors}</span>
          </div>
          <button onClick={() => setCurrentStep(2)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex justify-between items-center sm:col-span-2">
          <div>
            <span className="block text-sm text-gray-400">Concrete Grade</span>
            <span className="text-white font-medium">{formData.concreteGrade}</span>
          </div>
          <button onClick={() => setCurrentStep(3)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {isEdit ? 'Edit Project' : 'New Project'}
          </h1>
          <p className="text-gray-400 mt-2">Plan and estimate materials for your construction project.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Wizard Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
              
              {/* Progress Tracker */}
              <div className="flex items-center justify-between mb-10 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
                
                {steps.map((step) => (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-lg border-2 ${
                      currentStep > step.id ? 'bg-blue-500 border-blue-500 text-white' : 
                      currentStep === step.id ? 'bg-[#0a0f1c] border-blue-500 text-blue-500' : 
                      'bg-[#0a0f1c] border-white/20 text-gray-500'
                    }`}>
                      {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors ${
                      currentStep >= step.id ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Wizard Body */}
              <div className="min-h-[300px] mt-12 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={currentStep}>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Wizard Footer */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleEstimate}
                    disabled={isEstimating}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                  >
                    {isEstimating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
                    {isEstimating ? 'Estimating...' : 'Estimate Materials'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview Panel (Right Column) */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Grid className="w-5 h-5 text-blue-400" /> Live Preview
              </h3>
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project Name</p>
                  <p className="font-medium text-white break-words">{formData.projectName || 'Not set'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Type</p>
                    <p className="font-medium text-white">{formData.projectType}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Grade</p>
                    <p className="font-medium text-white">{formData.concreteGrade}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Dimensions</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black/20 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400">L (m)</p>
                      <p className="font-medium">{formData.length || '-'}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400">W (m)</p>
                      <p className="font-medium">{formData.width || '-'}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2">
                      <p className="text-[10px] text-gray-400">H (m)</p>
                      <p className="font-medium">{formData.height || '-'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Floors</p>
                  <p className="font-medium text-white">{formData.numFloors}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Box className="text-emerald-400" /> Estimation Results
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[
                  { icon: Box, label: 'Concrete Volume', value: `${results.concreteVolume?.toFixed(2)} m³`, color: 'text-gray-300', bg: 'bg-gray-500/20' },
                  { icon: Package, label: 'Cement', value: `${results.cement?.bags} bags`, color: 'text-orange-300', bg: 'bg-orange-500/20' },
                  { icon: Wrench, label: 'Steel', value: `${results.steel?.weight?.toFixed(2)} kg`, color: 'text-blue-300', bg: 'bg-blue-500/20' },
                  { icon: Circle, label: 'Rod Diameter', value: `${results.steel?.diameter} mm`, color: 'text-indigo-300', bg: 'bg-indigo-500/20' },
                  { icon: Layers, label: 'Sand', value: `${results.sand?.toFixed(2)} kg`, color: 'text-yellow-300', bg: 'bg-yellow-500/20' },
                  { icon: Hexagon, label: 'Aggregate', value: `${results.aggregate?.toFixed(2)} kg`, color: 'text-stone-300', bg: 'bg-stone-500/20' },
                  ...(results.bricks && results.bricks > 0 ? [{ icon: Grid, label: 'Bricks', value: `${Math.round(results.bricks)} pcs`, color: 'text-red-300', bg: 'bg-red-500/20' }] : []),
                  { icon: Droplet, label: 'Water', value: `${results.water?.toFixed(2)} L`, color: 'text-cyan-300', bg: 'bg-cyan-500/20' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all hover:bg-white/10 hover:shadow-lg"
                  >
                    <div className={`p-3 rounded-full ${item.bg} ${item.color} mb-3`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-1">{item.label}</h4>
                    <p className="text-lg font-bold text-white">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Project'}
                </button>
                <button 
                  onClick={() => generateBOQPdf(getFullProjectObj())}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white transition-all border border-white/5"
                >
                  <FileText className="w-5 h-5" /> Download BOQ PDF
                </button>
                <button 
                  onClick={() => generateBOQExcel(getFullProjectObj())}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white transition-all border border-white/5"
                >
                  <Download className="w-5 h-5" /> Download Excel
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all border border-red-500/20 ml-auto"
                >
                  <RefreshCw className="w-5 h-5" /> Reset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewProject;
