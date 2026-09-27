import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { generateBOQPdf } from '../../utils/pdfExport';
import { generateBOQExcel } from '../../utils/excelExport';
import { motion } from 'framer-motion';
import { 
  Box, Package, Wrench, Circle, Layers, Hexagon, Grid as GridIcon, Droplet,
  FileText, Download, Edit, Plus, ArrowLeft, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';

const ProjectResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject } = useProjects();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id, getProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] p-6 sm:p-10 flex flex-col gap-6 text-white">
        <div className="h-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] p-6 sm:p-10 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-semibold mb-4">Project not found</h2>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-medium"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="w-5 h-5" /> Back to Projects
        </button>
      </div>
    );
  }

  const {
    project_name: projectName,
    project_type: projectType,
    length,
    width,
    height,
    concrete_grade: concreteGrade,
    floors,
    created_at,
    concrete_volume: concreteVolume,
    cement,
    steel,
    rod_diameter: rodDiameter,
    sand,
    aggregate,
    bricks,
    water
  } = project;

  const handleDownloadPdf = () => generateBOQPdf(project);
  const handleDownloadExcel = () => generateBOQExcel(project);

  const chartData = [
    { name: 'Cement', value: parseFloat(cement) || 0, unit: 'bags', color: '#F59E0B' },
    { name: 'Steel', value: parseFloat(steel) || 0, unit: 'kg', color: '#EF4444' },
    { name: 'Sand', value: parseFloat(sand) || 0, unit: 'cu.m', color: '#FBBF24' },
    { name: 'Aggregate', value: parseFloat(aggregate) || 0, unit: 'cu.m', color: '#14B8A6' }
  ];

  const materials = [
    { label: 'Concrete Volume', value: concreteVolume, unit: 'cu.m', icon: <Box className="w-6 h-6 text-blue-400" /> },
    { label: 'Cement', value: cement, unit: 'bags', icon: <Package className="w-6 h-6 text-orange-400" /> },
    { label: 'Steel', value: steel, unit: 'kg', icon: <Wrench className="w-6 h-6 text-red-400" /> },
    { label: 'Rod Diameter', value: rodDiameter, unit: 'mm', icon: <Circle className="w-6 h-6 text-purple-400" /> },
    { label: 'Sand', value: sand, unit: 'cu.m', icon: <Layers className="w-6 h-6 text-yellow-400" /> },
    { label: 'Aggregate', value: aggregate, unit: 'cu.m', icon: <Hexagon className="w-6 h-6 text-teal-400" /> },
    ...(parseFloat(bricks) > 0 ? [{ label: 'Bricks', value: bricks, unit: 'nos', icon: <GridIcon className="w-6 h-6 text-amber-500" /> }] : []),
    { label: 'Water', value: water, unit: 'liters', icon: <Droplet className="w-6 h-6 text-cyan-400" /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white p-4 sm:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                {projectName}
              </h1>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
                  {projectType}
                </span>
                {concreteGrade && (
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
                    {concreteGrade} Grade
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 shrink-0">
              <div className="flex flex-col">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Dimensions</span>
                <span className="text-white font-medium">{length} × {width} × {height} m</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Floors</span>
                <span className="text-white font-medium">{floors || 1}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Created</span>
                <span className="text-white font-medium">{new Date(created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Materials Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {materials.map((mat, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors group cursor-default"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                      {mat.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">{Number(mat.value).toFixed(2)}</span>
                      <span className="text-sm text-white/60 font-medium">{mat.unit}</span>
                    </div>
                    <span className="text-sm font-medium text-white/70">{mat.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* AI Insights Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">AI Insights & Recommendations</h3>
              </div>
              <p className="text-indigo-100/80 leading-relaxed text-sm">
                Based on your selected <strong className="text-indigo-200">{concreteGrade}</strong> grade for a <strong className="text-indigo-200">{projectType}</strong> project spanning <strong className="text-indigo-200">{floors || 1} floor(s)</strong>, our engine recommends utilizing high-yield strength TMT rebars to optimize load distribution. Furthermore, adding premium plasticizers can improve workability while keeping the water-cement ratio optimal. Material quantities are calibrated for ~5% wastage buffer.
              </p>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[400px] flex flex-col"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Material Distribution</h3>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#E2E8F0' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOQ Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">Bill of Quantities (BOQ)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Sl. No.</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {materials.map((mat, index) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white/70 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 text-white font-medium">{mat.label}</td>
                    <td className="px-6 py-4 text-white/90">{Number(mat.value).toFixed(2)}</td>
                    <td className="px-6 py-4 text-white/50">{mat.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center gap-4 pt-4"
        >
          <button 
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <FileText className="w-5 h-5" /> Download BOQ PDF
          </button>
          <button 
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-medium transition-all"
          >
            <Download className="w-5 h-5" /> Download Excel
          </button>
          <button 
            onClick={() => navigate('/projects/new', { state: { project } })}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-medium transition-all"
          >
            <Edit className="w-5 h-5" /> Edit Project
          </button>
          <div className="flex-1"></div>
          <button 
            onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white transition-colors font-medium"
          >
            <Plus className="w-5 h-5" /> Create New
          </button>
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Projects
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default ProjectResult;
