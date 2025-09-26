
import React, { useState } from 'react';
import { Resume, Education, Experience, Skill, PersonalDetails } from '../types';
import Input from './Input';
import Button from './Button';
import { PlusIcon, TrashIcon, UserCircleIcon } from './Icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ResumeFormProps {
  resume: Resume;
  onSave: (resume: Resume) => void;
  onCancel: () => void;
}

const SectionWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-6 pt-6 border-t border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const ResumeForm: React.FC<ResumeFormProps> = ({ resume, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Resume>(resume);

  const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, personalDetails: { ...prev.personalDetails, [name]: value } }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setFormData(prev => ({
          ...prev,
          personalDetails: {
            ...prev.personalDetails,
            profilePicture: loadEvent.target?.result as string,
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeProfilePicture = () => {
      setFormData(prev => ({
          ...prev,
          personalDetails: {
              ...prev.personalDetails,
              profilePicture: '',
          }
      }))
  }

  const handleArrayChange = <T,>(section: keyof Resume, index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedSection = [...(formData[section] as T[])];
    updatedSection[index] = { ...updatedSection[index], [name]: value };
    setFormData(prev => ({ ...prev, [section]: updatedSection }));
  };
  
  const addArrayItem = (section: 'education' | 'experience' | 'skills') => {
    let newItem;
    if (section === 'education') newItem = { institution: '', degree: '', year: '' };
    else if (section === 'experience') newItem = { company: '', role: '', duration: '', description: '' };
    else newItem = { name: '' };
    
    setFormData(prev => ({...prev, [section]: [...(prev[section] as any[]), newItem]}));
  };

  const removeArrayItem = (section: 'education' | 'experience' | 'skills', index: number) => {
    const updatedSection = (formData[section] as any[]).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [section]: updatedSection }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Resume</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Resume Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Software Engineer Resume"/>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
          <select
            value={formData.template}
            onChange={(e) => setFormData({...formData, template: e.target.value as 'modern' | 'classic' | 'minimal' | 'professional' | 'creative'})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="professional">Professional</option>
            <option value="creative">Creative</option>
          </select>
        </div>
      </div>

      <SectionWrapper title="Personal Details">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
             {formData.personalDetails.profilePicture ? (
                <img src={formData.personalDetails.profilePicture} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <UserCircleIcon className="w-16 h-16 text-gray-400" />
             )}
          </div>
          <div className="flex-1">
             <label htmlFor="profile-picture-upload" className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span>Upload a picture</span>
                <input id="profile-picture-upload" name="profile-picture-upload" type="file" className="sr-only" onChange={handleProfilePictureChange} accept="image/png, image/jpeg" />
             </label>
             {formData.personalDetails.profilePicture && (
                <Button type="button" variant="ghost" onClick={removeProfilePicture} className="ml-2 !px-3 !py-2">
                    <TrashIcon className="w-4 h-4 text-red-500" />
                </Button>
             )}
             <p className="text-xs text-gray-500 mt-1">PNG or JPG up to 10MB.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input label="Full Name" name="name" value={formData.personalDetails.name} onChange={handlePersonalDetailsChange} />
          <Input label="Email" name="email" type="email" value={formData.personalDetails.email} onChange={handlePersonalDetailsChange} />
          <Input label="Phone" name="phone" value={formData.personalDetails.phone} onChange={handlePersonalDetailsChange} />
          <Input label="Address" name="address" value={formData.personalDetails.address} onChange={handlePersonalDetailsChange} />
        </div>
      </SectionWrapper>

      <SectionWrapper title="Education">
        {formData.education.map((edu, index) => (
          <div key={index} className="p-4 border rounded-md relative space-y-2">
            <Input label="Institution" name="institution" value={edu.institution} onChange={(e) => handleArrayChange('education', index, e)} />
            <Input label="Degree" name="degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, e)} />
            <Input label="Year" name="year" value={edu.year} onChange={(e) => handleArrayChange('education', index, e)} />
            <Button type="button" variant="ghost" className="!absolute top-2 right-2 !p-1 h-auto" onClick={() => removeArrayItem('education', index)}>
              <TrashIcon className="w-4 h-4 text-red-500"/>
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => addArrayItem('education')}><PlusIcon className="w-4 h-4 mr-2"/> Add Education</Button>
      </SectionWrapper>

      <SectionWrapper title="Experience">
        {formData.experience.map((exp, index) => (
          <div key={index} className="p-4 border rounded-md relative space-y-2">
            <Input label="Company" name="company" value={exp.company} onChange={(e) => handleArrayChange('experience', index, e)} />
            <Input label="Role" name="role" value={exp.role} onChange={(e) => handleArrayChange('experience', index, e)} />
            <Input label="Duration" name="duration" value={exp.duration} onChange={(e) => handleArrayChange('experience', index, e)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <ReactQuill
                value={exp.description}
                onChange={(value) => {
                  const updatedSection = [...(formData.experience as Experience[])];
                  updatedSection[index] = { ...updatedSection[index], description: value };
                  setFormData(prev => ({ ...prev, experience: updatedSection }));
                }}
                theme="snow"
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                  ]
                }}
              />
            </div>
            <Button type="button" variant="ghost" className="!absolute top-2 right-2 !p-1 h-auto" onClick={() => removeArrayItem('experience', index)}>
              <TrashIcon className="w-4 h-4 text-red-500"/>
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => addArrayItem('experience')}><PlusIcon className="w-4 h-4 mr-2"/> Add Experience</Button>
      </SectionWrapper>

      <SectionWrapper title="Skills">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formData.skills.map((skill, index) => (
          <div key={index} className="relative">
            <Input name="name" value={skill.name} onChange={(e) => handleArrayChange('skills', index, e)} />
            <Button type="button" variant="ghost" className="!absolute top-1/2 right-1 transform -translate-y-1/2 !p-1 h-auto" onClick={() => removeArrayItem('skills', index)}>
              <TrashIcon className="w-4 h-4 text-red-500"/>
            </Button>
          </div>
        ))}
        </div>
        <Button type="button" variant="secondary" onClick={() => addArrayItem('skills')}><PlusIcon className="w-4 h-4 mr-2"/> Add Skill</Button>
      </SectionWrapper>

      <div className="mt-8 flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Resume</Button>
      </div>
    </form>
  );
};

export default ResumeForm;
