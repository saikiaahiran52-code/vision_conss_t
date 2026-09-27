import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { LogOut, User, Mail, Calendar, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

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

const Profile = () => {
  const { user, signOut } = useAuth();
  const { projects } = useProjects();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const fullName = user?.user_metadata?.full_name || 'User';
  const email = user?.email || '';
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const createdDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 font-sans flex justify-center">
      <motion.div 
        className="w-full max-w-3xl space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-white/10 shrink-0">
            {getInitials(fullName)}
          </div>
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">{fullName}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 mb-4">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                <Calendar className="w-4 h-4 text-blue-400" />
                Member since {createdDate}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                <Folder className="w-4 h-4 text-purple-400" />
                {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Account Information
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm font-medium text-slate-400 mb-1 sm:mb-0">Full Name</span>
              <span className="font-semibold text-white">{fullName}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm font-medium text-slate-400 mb-1 sm:mb-0">Email Address</span>
              <span className="font-semibold text-white">{email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm font-medium text-slate-400 mb-1 sm:mb-0">Total Projects</span>
              <span className="font-semibold text-white">{projects.length}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-sm font-medium text-slate-400 mb-1 sm:mb-0">Account Created</span>
              <span className="font-semibold text-white">{createdDate}</span>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-slate-400 mb-6 max-w-xl">
              Logging out will end your current session. You will need to log back in to access your projects and estimates.
            </p>
            <button 
              onClick={handleLogout}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 text-red-400 font-semibold border border-red-500/30 overflow-hidden transition-all hover:bg-red-500 hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout Securely</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
