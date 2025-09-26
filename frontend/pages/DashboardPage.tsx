
import React, { useState } from 'react';
import { User, Resume } from '../types';
import Header from '../components/Header';
import Button from '../components/Button';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { PlusIcon, EditIcon, TrashIcon, EyeIcon } from '../components/Icons';

interface DashboardPageProps {
  user: User;
  resumes: Resume[];
  selectedResume: Resume | null;
  onSelectResume: (resume: Resume | null) => void;
  onSaveResume: (resume: Resume) => void;
  onDeleteResume: (resumeId: string) => void;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, resumes, selectedResume, onSelectResume, onSaveResume, onDeleteResume, onLogout }) => {
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('edit');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleCreateNew = () => {
    onSelectResume({
      id: `resume-${Date.now()}`,
      name: 'Untitled Resume',
      template: 'modern',
      personalDetails: { name: '', email: '', phone: '', address: '', profilePicture: '' },
      education: [],
      experience: [],
      skills: [],
    });
    setViewMode('edit');
  };

  const handleEdit = (resume: Resume) => {
    onSelectResume(resume);
    setViewMode('edit');
  };

  const handleView = (resume: Resume) => {
    onSelectResume(resume);
    setViewMode('view');
  };

  const handleDeleteClick = (resumeId: string) => {
    setShowDeleteConfirm(resumeId);
  };
  
  const confirmDelete = () => {
    if (showDeleteConfirm) {
      onDeleteResume(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Resumes</h2>
              <Button onClick={handleCreateNew} className="!px-2 !py-1">
                <PlusIcon className="h-5 w-5" />
              </Button>
            </div>
            {resumes.length === 0 ? (
              <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-lg">
                <p>No resumes yet.</p>
                <Button onClick={handleCreateNew} className="mt-4">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Your First Resume
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {resumes.map(resume => (
                  <li key={resume.id} className={`p-4 rounded-lg transition-all duration-200 ${selectedResume?.id === resume.id ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200' : 'bg-gray-50 hover:bg-gray-100 border'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700 truncate">{resume.name}</span>
                      <div className="flex items-center space-x-2">
                        <Button onClick={() => handleView(resume)} variant="ghost" className="!p-2"><EyeIcon className="h-4 w-4 text-gray-500" /></Button>
                        <Button onClick={() => handleEdit(resume)} variant="ghost" className="!p-2"><EditIcon className="h-4 w-4 text-gray-500" /></Button>
                        <Button onClick={() => handleDeleteClick(resume.id)} variant="ghost" className="!p-2"><TrashIcon className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="lg:col-span-2">
            {selectedResume ? (
              viewMode === 'edit' ? (
                <ResumeForm 
                  resume={selectedResume} 
                  onSave={onSaveResume} 
                  onCancel={() => onSelectResume(null)} 
                />
              ) : (
                <ResumePreview resume={selectedResume} onEdit={() => setViewMode('edit')} />
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg shadow text-center">
                 <svg className="h-16 w-16 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 4v16m4-16v16" />
                 </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-800">Select a resume to view or edit</h3>
                <p className="mt-1 text-sm text-gray-500">Or create a new one to get started.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mt-2">Are you sure you want to delete this resume? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
