import React from 'react';
import { X, Download, Printer } from 'lucide-react';
import { IResume } from '../types';
import { ResumePreview } from './ResumePreview';
import { exportResumeToDocx } from '../services/docxExport';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { incrementDownload } from '../store/resumeSlice';

interface Props {
  isOpen: boolean;
  resume: IResume | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<Props> = ({ isOpen, resume, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen || !resume) return null;

  const handleDocxDownload = async () => {
    await exportResumeToDocx(resume);
    if (resume._id) {
      dispatch(incrementDownload(resume._id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              {resume.personalDetails?.fullName || resume.title} - Preview
            </h3>
            <p className="text-xs text-neutral-500">
              {resume.targetRole} • Format: {resume.format || 'DOCX'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleDocxDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-black transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export as DOCX</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Preview Body */}
        <div className="flex-1 overflow-auto p-4 bg-neutral-100/60">
          <ResumePreview resume={resume} zoomLevel={100} />
        </div>
      </div>
    </div>
  );
};
