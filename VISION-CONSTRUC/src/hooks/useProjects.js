import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (err) throw err;
      setProjects(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveProject = async (projectData) => {
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .insert([{ ...projectData, user_id: user.id }])
        .select()
        .single();
      
      if (err) throw err;
      setProjects((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id, projectData) => {
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (err) throw err;
      setProjects((prev) => prev.map((p) => p.id === id ? data : p));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);
    try {
      const { error: err } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (err) throw err;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getProject = async (id) => {
    if (!user) return { data: null, error: 'Not authenticated' };
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (err) throw err;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    saveProject,
    updateProject,
    deleteProject,
    getProject
  };
}
