import React, { useState } from 'react';
import {
  X,
  FolderGit2,
  Award,
  Trophy,
  Languages,
  HeartHandshake,
  BookOpen,
  Plus,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (title: string) => void;
}

const PRESET_SECTIONS = [
  {
    title: 'Projects',
    description: 'Personal projects, apps, and open-source contributions',
    icon: FolderGit2,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    title: 'Certifications',
    description: 'Licenses, accredited certificates, and credentials',
    icon: Award,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    title: 'Awards & Honors',
    description: 'Hackathons, academic honors, and recognitions',
    icon: Trophy,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    title: 'Languages',
    description: 'Spoken, written, and technical languages',
    icon: Languages,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    title: 'Publications',
    description: 'Research papers, articles, and book chapters',
    icon: BookOpen,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    title: 'Volunteering & Leadership',
    description: 'Community service, mentorship, and club activities',
    icon: HeartHandshake,
    color: 'bg-rose-50 text-rose-600 border-rose-200',
  },
];

export const AddSectionModal: React.FC<Props> = ({ isOpen, onClose, onAddSection }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('Projects');
  const [customTitle, setCustomTitle] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPreset = (title: string) => {
    setSelectedPreset(title);
    setCustomTitle(title);
  };

  const handleConfirm = () => {
    const finalTitle = customTitle.trim() || selectedPreset || 'Custom Section';
    onAddSection(finalTitle);
    setCustomTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Add New Resume Section</h3>
              <p className="text-xs text-neutral-500">
                Choose a suggested section or create your own custom one.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black p-1.5 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Cards Grid */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
            Suggested Sections:
          </label>
          <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {PRESET_SECTIONS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = (customTitle || selectedPreset) === preset.title;
              return (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleSelectPreset(preset.title)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-50 ring-1 ring-black'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${preset.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{preset.title}</div>
                    <div className="text-[10px] text-neutral-500 line-clamp-1 leading-tight mt-0.5">
                      {preset.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Section Title Input */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Section Title</span>
          </label>
          <input
            type="text"
            value={customTitle || selectedPreset}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="e.g. Projects, Certifications, Key Achievements..."
            className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-black rounded-lg transition cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>
      </div>
    </div>
  );
};
