
import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import { User, Resume } from './types';
import { api } from './src/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activePage, setActivePage] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  
  useEffect(() => {
    const initApp = async () => {
      const token = api.getToken();
      if (token) {
        const meResult = await api.getMe();
        if (meResult.data) {
          setUser(meResult.data);
          setActivePage('dashboard');

          // Load resumes from API
          const resumesResult = await api.getResumes();
          if (resumesResult.data) {
            const mappedResumes: Resume[] = resumesResult.data.map(r => ({
              id: r.id,
              name: r.title,
              template: (r.template || 'modern') as 'modern' | 'classic' | 'minimal' | 'professional' | 'creative',
              personalDetails: r.personal,
              education: r.education,
              experience: r.experience,
              skills: r.skills.map(s => ({ name: s }))
            }));
            setResumes(mappedResumes);
          }
        } else {
          // Token invalid, clear it
          api.clearToken();
        }
      }
      setLoading(false);
    };

    initApp();
  }, []);

  const handleLogin = useCallback(async (loggedInUser: User) => {
    setUser(loggedInUser);
    setActivePage('dashboard');

    // Load resumes from API
    const resumesResult = await api.getResumes();
    if (resumesResult.data) {
      const mappedResumes: Resume[] = resumesResult.data.map(r => ({
        id: r.id,
        name: r.title,
        template: (r.template || 'modern') as 'modern' | 'classic' | 'minimal' | 'professional' | 'creative',
        personalDetails: r.personal,
        education: r.education,
        experience: r.experience,
        skills: r.skills.map(s => ({ name: s }))
      }));
      setResumes(mappedResumes);
    }
  }, []);
  
  const handleSignup = useCallback((signedUpUser: User) => {
    setUser(signedUpUser);
    setResumes([]);
    setActivePage('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setSelectedResume(null);
    setResumes([]);
    api.clearToken();
    setActivePage('login');
  }, []);

  const handleSaveResume = async (resume: Resume) => {
    const resumeData = {
      title: resume.name,
      template: resume.template,
      personal: resume.personalDetails,
      education: resume.education,
      experience: resume.experience,
      skills: resume.skills.map(s => s.name)
    };

    let result;
    const existingIndex = resumes.findIndex(r => r.id === resume.id);
    if (existingIndex > -1) {
      // Update existing
      result = await api.updateResume(resume.id, resumeData);
    } else {
      // Create new
      result = await api.createResume(resumeData);
    }

    if (result.data) {
      // Reload resumes
      const resumesResult = await api.getResumes();
      if (resumesResult.data) {
        const mappedResumes: Resume[] = resumesResult.data.map(r => ({
          id: r.id,
          name: r.title,
          template: resume.template, // Keep the template
          personalDetails: r.personal,
          education: r.education,
          experience: r.experience,
          skills: r.skills.map(s => ({ name: s }))
        }));
        setResumes(mappedResumes);
      }
    }
    setSelectedResume(null);
  };

  const handleDeleteResume = async (resumeId: string) => {
    const result = await api.deleteResume(resumeId);
    if (!result.error) {
      // Reload resumes
      const resumesResult = await api.getResumes();
      if (resumesResult.data) {
        const mappedResumes: Resume[] = resumesResult.data.map(r => ({
          id: r.id,
          name: r.title,
          template: (r.template || 'modern') as 'modern' | 'classic' | 'minimal' | 'professional' | 'creative',
          personalDetails: r.personal,
          education: r.education,
          experience: r.experience,
          skills: r.skills.map(s => ({ name: s }))
        }));
        setResumes(mappedResumes);
      }
    }
    setSelectedResume(null);
  };

  const handleSelectResume = (resume: Resume | null) => {
    setSelectedResume(resume);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {activePage === 'login' && <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setActivePage('signup')} />}
      {activePage === 'signup' && <SignupPage onSignup={handleSignup} onNavigateToLogin={() => setActivePage('login')} />}
      {activePage === 'dashboard' && user && (
        <DashboardPage 
          user={user} 
          resumes={resumes}
          selectedResume={selectedResume}
          onSelectResume={handleSelectResume}
          onSaveResume={handleSaveResume}
          onDeleteResume={handleDeleteResume}
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;
