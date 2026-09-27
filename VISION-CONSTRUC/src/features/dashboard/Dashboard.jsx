import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { 
  Folder, Box, Download, Activity, 
  Calendar, Plus, Cpu, Inbox, Eye 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const { projects, loading } = useProjects();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Builder';
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = [
    {
      id: 'total',
      label: 'Total Projects',
      value: projects.length,
      icon: Folder,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      id: 'materials',
      label: 'Material Estimates',
      value: projects.length * 12, // simulated stat
      icon: Box,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    {
      id: 'boqs',
      label: 'Saved BOQs',
      value: projects.length * 2, // simulated stat
      icon: Download,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    },
    {
      id: 'activity',
      label: 'Recent Activity',
      value: projects.length, // simulated stat
      icon: Activity,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    }
  ];

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const mockChartData = [
    { name: 'Jan', projects: 4 },
    { name: 'Feb', projects: 7 },
    { name: 'Mar', projects: 5 },
    { name: 'Apr', projects: 10 },
    { name: 'May', projects: 8 },
    { name: 'Jun', projects: 14 }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 font-sans">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.section 
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {userName}!</h1>
            <p className="text-slate-400 mt-1">Your construction intelligence hub</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 text-sm font-medium text-slate-300 shadow-lg">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{currentDate}</span>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`skeleton-stat-${i}`} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-white/10 mr-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : (
            stats.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center transition-all hover:bg-white/10 hover:border-white/20">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                </div>
              );
            })
          )}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <motion.section variants={itemVariants} className="lg:col-span-2 space-y-4">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
                <h2 className="text-xl font-semibold text-white mb-6">Project Overview</h2>
                <div className="flex-1 min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Bar dataKey="projects" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate('/projects/new')}
                className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 text-left transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">New Project</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Create a new construction estimate</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/projects/new')}
                className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 text-left transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Estimate Materials</h3>
                    <p className="text-xs text-slate-400 mt-0.5">AI-powered material calculator</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => navigate('/projects')}
                className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 text-left transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Folder className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Saved Projects</h3>
                    <p className="text-xs text-slate-400 mt-0.5">View and manage your portfolio</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.section>
        </div>

        {/* Recent Projects */}
        <motion.section variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
            <Link to="/projects" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">View All &rarr;</Link>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                 {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`skel-row-${i}`} className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                 ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-300 mb-4">No projects yet</p>
                <button 
                  onClick={() => navigate('/projects/new')}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Name</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {recentProjects.map(project => (
                      <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-6 font-medium text-white">{project.project_name}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                            ${project.project_type?.toLowerCase() === 'residential' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                              project.project_type?.toLowerCase() === 'commercial' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}
                          >
                            {project.project_type || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-400">{new Date(project.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                            onClick={() => navigate(`/projects/${project.id}`)}
                            title="View Project"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Dashboard;
