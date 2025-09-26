import React, { useEffect, useState } from 'react';
import { Resume } from '../types';
import ResumePreview from '../components/ResumePreview';
import { api } from '../src/api';

interface PublicResumePageProps {
  resumeId: string;
}

const PublicResumePage: React.FC<PublicResumePageProps> = ({ resumeId }) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      const result = await api.getPublicResume(resumeId);
      if (result.data) {
        const resume: Resume = {
          id: resumeId,
          name: result.data.title,
          template: (result.data.template || 'modern') as 'modern' | 'classic' | 'minimal' | 'professional' | 'creative',
          personalDetails: result.data.personal,
          education: result.data.education,
          experience: result.data.experience,
          skills: result.data.skills.map(s => ({ name: s }))
        };
        setResume(resume);
      }
      setLoading(false);
    };

    fetchResume();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Resume not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
};

export default PublicResumePage;