import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Folder, User, LogOut, Menu, X, 
  LayoutGrid, Plus, Cpu, Sun, Moon, Bell, 
  ChevronRight, ChevronDown 
} from 'lucide-react';

const AppLayout = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    if (pathnames.length === 0) return [{ name: 'Dashboard', path: '/' }];
    
    return pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      return { name: capitalized, path: routeTo };
    });
  };

  const navItems = [
    { section: 'MAIN', items: [
      { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
      { name: 'New Project', path: '/projects/new', icon: <Plus className="w-5 h-5" /> }
    ]},
    { section: 'PROJECTS', items: [
      { name: 'Saved Projects', path: '/projects/saved', icon: <Folder className="w-5 h-5" /> },
      { name: 'Material Calculator', path: '/projects/new', icon: <Cpu className="w-5 h-5" /> }
    ]},
    { section: 'ACCOUNT', items: [
      { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> }
    ]}
  ];

  return (
    <div className={`min-h-screen bg-[#030712] text-slate-200 flex p-4 gap-4 overflow-hidden font-sans ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{
          x: isMobile ? (isMobileMenuOpen ? 0 : '-150%') : 0,
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className={`fixed md:relative z-50 w-64 flex-shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl h-[calc(100vh-2rem)] md:h-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">VISION</span>
          </div>
          {isMobile && (
            <button className="text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          {navItems.map((section, idx) => (
            <div key={idx} className="mb-8 px-4">
              <div className="text-xs font-semibold text-slate-500 mb-4 px-2 tracking-widest">{section.section}</div>
              <nav className="flex flex-col gap-1">
                {section.items.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link 
                      key={i} 
                      to={item.path} 
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/10 text-sm text-slate-500 text-center">
          VISION v1.0
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 h-[calc(100vh-2rem)]">
        {/* Topbar */}
        <header className="h-20 flex-shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-between px-6 shadow-lg z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-400">
              {getBreadcrumbs().map((crumb, idx, arr) => (
                <React.Fragment key={idx}>
                  <Link to={crumb.path} className={`hover:text-blue-400 transition-colors ${idx === arr.length - 1 ? 'text-slate-200' : ''}`}>
                    {crumb.name}
                  </Link>
                  {idx < arr.length - 1 && <ChevronRight className="w-4 h-4" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center gap-3 p-1.5 pl-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors" 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <span className="text-sm font-medium hidden sm:block text-slate-200">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/10 mb-2">
                      <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Signed in as</div>
                      <div className="text-sm font-medium text-slate-200 truncate">{user?.email}</div>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors mt-1">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 custom-scrollbar relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
