import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, Search, Eye, Edit2, Download, Trash2, Inbox, Calendar, Layers, Hash
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { generateBOQPdf } from '../../utils/pdfExport';

const SavedProjects = () => {
  const { projects, loading, fetchProjects, deleteProject } = useProjects();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      setConfirmDeleteId(null);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesType = typeFilter === 'All' || project.project_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getProjectData = (project) => {
    return project;
  };

  const handleDownload = (project) => {
    generateBOQPdf(getProjectData(project));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white p-6 md:p-10 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-3">
              <Folder className="text-blue-400 w-10 h-10" /> Saved Projects
            </h1>
            <p className="text-gray-400 mt-2">Manage your construction projects</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-3">
              <Folder className="text-blue-400 w-10 h-10" /> Saved Projects
            </h1>
            <p className="text-gray-400 mt-2">Manage your construction projects</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
              />
            </div>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="All" className="bg-gray-900">All Types</option>
              <option value="Residential" className="bg-gray-900">Residential</option>
              <option value="Commercial" className="bg-gray-900">Commercial</option>
              <option value="Industrial" className="bg-gray-900">Industrial</option>
              <option value="Infrastructure" className="bg-gray-900">Infrastructure</option>
              <option value="House" className="bg-gray-900">House</option>
              <option value="Slab" className="bg-gray-900">Slab</option>
            </select>
          </div>
        </header>

        {filteredProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
          >
            <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <Inbox className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No projects found</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              We couldn't find any projects matching your search criteria. Create your first project to get started.
            </p>
            <button 
              onClick={() => navigate('/projects/new')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              Create Project
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProjects.map(project => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col group hover:shadow-[0_10px_40px_rgba(37,99,235,0.15)] transition-all duration-300"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {project.project_type}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                        <Folder className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 group-hover:text-blue-400 transition-colors" title={project.project_name}>
                      {project.project_name}
                    </h3>
                    
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center text-sm text-gray-400">
                        <Layers className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="w-24">Dimensions:</span> 
                        <span className="text-white font-medium truncate">{project.length} × {project.width} × {project.height} m</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Hash className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="w-24">Grade & Flrs:</span>
                        <span className="text-white font-medium">{project.concrete_grade} • {project.floors || 1}F</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="w-24">Created:</span>
                        <span className="text-white font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 border-t border-white/5 flex gap-2 justify-end">
                    {confirmDeleteId === project.id ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="flex items-center gap-2 w-full"
                      >
                        <span className="text-sm text-red-400 flex-1 ml-2 font-medium">Delete?</span>
                        <button 
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors" 
                          onClick={() => handleDelete(project.id)}
                        >
                          Yes
                        </button>
                        <button 
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors" 
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          No
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        <button 
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all group-hover:bg-white/10" 
                          onClick={() => navigate(`/projects/${project.id}`)} 
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all group-hover:bg-white/10" 
                          onClick={() => navigate('/projects/new', { state: { project: getProjectData(project) } })} 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all group-hover:bg-white/10" 
                          onClick={() => handleDownload(project)} 
                          title="Download BOQ"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="flex-1"></div>
                        <button 
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all" 
                          onClick={() => setConfirmDeleteId(project.id)} 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProjects;
