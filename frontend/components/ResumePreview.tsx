
import React, { useRef } from 'react';
import { Resume } from '../types';
import Button from './Button';
import { DownloadIcon, EditIcon } from './Icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const templateStyles = {
  modern: {
    header: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
    sectionTitle: 'text-indigo-600 border-indigo-300',
    skill: 'bg-indigo-100 text-indigo-800'
  },
  classic: {
    header: 'bg-gray-800 text-white',
    sectionTitle: 'text-gray-800 border-gray-400',
    skill: 'bg-gray-200 text-gray-800'
  },
  minimal: {
    header: 'bg-white text-gray-900 border-b-2 border-gray-300',
    sectionTitle: 'text-gray-700 border-gray-300',
    skill: 'bg-gray-100 text-gray-700'
  },
  professional: {
    header: 'bg-gradient-to-r from-blue-700 to-blue-900 text-white',
    sectionTitle: 'text-blue-700 border-blue-300',
    skill: 'bg-blue-100 text-blue-800'
  },
  creative: {
    header: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
    sectionTitle: 'text-pink-600 border-pink-300',
    skill: 'bg-pink-100 text-pink-800'
  }
};

interface ResumePreviewProps {
  resume: Resume;
  onEdit?: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, onEdit }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    const input = previewRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;

      if (height <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      } else {
        // Handle long resumes that need multiple pages
        let remainingHeight = canvasHeight;
        let position = 0;

        while (remainingHeight > 0) {
          const pageCanvas = document.createElement('canvas');
          const pageHeight = canvasWidth / (pdfWidth / pdfHeight);
          pageCanvas.width = canvasWidth;
          pageCanvas.height = Math.min(pageHeight, remainingHeight);

          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, position, canvasWidth, pageCanvas.height, 0, 0, canvasWidth, pageCanvas.height);
            const pageImgData = pageCanvas.toDataURL('image/png');
            if (position > 0) pdf.addPage();
            pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            position += pageCanvas.height;
            remainingHeight -= pageCanvas.height;
          } else {
            break;
          }
        }
      }

      pdf.save(`${resume.name.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/resume/${resume.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{resume.name}</h2>
            <div className="flex space-x-2">
                {onEdit && <Button onClick={onEdit} variant="secondary"><EditIcon className="w-4 h-4 mr-2"/>Edit</Button>}
                <Button onClick={handleShare} variant="secondary">Share</Button>
                <Button onClick={handleDownload}><DownloadIcon className="w-4 h-4 mr-2"/>Download PDF</Button>
            </div>
        </div>
      <div id="resume-preview-content" ref={previewRef} className={`p-8 border rounded-md bg-white resume-template-${resume.template}`}>
        <header className={`mb-8 p-6 rounded-lg ${templateStyles[resume.template].header}`}>
          <div className="flex items-center gap-6">
            {resume.personalDetails.profilePicture && (
              <div className="w-28 h-28 rounded-full overflow-hidden flex-shrink-0 border-4 border-white">
                <img src={resume.personalDetails.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-grow text-left">
              <h1 className="text-4xl font-bold">{resume.personalDetails.name}</h1>
              <p className="mt-2 opacity-90">
                {resume.personalDetails.email} &bull; {resume.personalDetails.phone} &bull; {resume.personalDetails.address}
              </p>
            </div>
          </div>
        </header>

        <section>
          <h2 className={`text-xl font-bold border-b-2 pb-2 mb-4 ${templateStyles[resume.template].sectionTitle}`}>Experience</h2>
          <div className="space-y-6">
            {resume.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold text-gray-800">{exp.role}</h3>
                  <p className="text-sm text-gray-500">{exp.duration}</p>
                </div>
                <p className="text-md font-medium text-gray-700">{exp.company}</p>
                <div className="text-gray-600 mt-1 text-sm" dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className={`text-xl font-bold border-b-2 pb-2 mb-4 ${templateStyles[resume.template].sectionTitle}`}>Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{edu.institution}</h3>
                  <p className="text-md text-gray-700">{edu.degree}</p>
                </div>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className={`text-xl font-bold border-b-2 pb-2 mb-4 ${templateStyles[resume.template].sectionTitle}`}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className={`text-sm font-medium px-3 py-1 rounded-full ${templateStyles[resume.template].skill}`}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumePreview;
