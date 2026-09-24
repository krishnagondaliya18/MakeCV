import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, ArrowRight, Sparkles, Layout } from 'lucide-react';
import { IResume } from '../types';
import { PreviewModal } from '../components/PreviewModal';

interface TemplateOption {
  id: string;
  name: string;
  category: string;
  description: string;
  bestFor: string;
  badge?: string;
  accentColor: string;
  features: string[];
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'Standard Executive',
    name: 'Standard Executive',
    category: 'Executive & Corporate',
    badge: 'Most Popular',
    accentColor: 'border-neutral-900',
    description:
      'Balanced, classic layout with centered header, refined divider rules, and clean section flow.',
    bestFor: 'Senior Managers, Tech Leads, Directors, Corporate Roles',
    features: ['ATS Optimized', 'Centered Name Header', 'Clean Section Rules', 'Standard A4 1-Page'],
  },
  {
    id: 'Modern Minimalist',
    name: 'Modern Minimalist',
    category: 'Modern & Clean',
    badge: 'Recommended',
    accentColor: 'border-blue-600',
    description:
      'Left-aligned header with colored vertical accent bar and modern sans-serif typography.',
    bestFor: 'Software Engineers, Product Managers, UI/UX Specialists',
    features: ['Left Border Accent', 'Modern Sans Typography', 'Spacious Line Heights', 'Crisp Bullets'],
  },
  {
    id: 'Creative Split',
    name: 'Creative Split',
    category: 'Two-Column / Creative',
    accentColor: 'border-neutral-800',
    description:
      'Eye-catching two-column layout with a sleek dark sidebar for contact & skills, and main body for experience.',
    bestFor: 'Full Stack Developers, Designers, Marketers',
    features: ['Two-Column Side Rail', 'High Contrast Sidebar', 'Prominent Skill Badges', 'Modern Grid'],
  },
  {
    id: 'Corporate Ivy Classic',
    name: 'Corporate Ivy Classic',
    category: 'Traditional & Academic',
    accentColor: 'border-neutral-700',
    description:
      'Refined academic layout utilizing traditional serif styling, formal right-aligned dates, and elegant spacing.',
    bestFor: 'Researchers, Finance, Banking, Legal & Academic Careers',
    features: ['Classic Serif Styling', 'Academic Coursework Block', 'Formal Alignment', 'Conservative Look'],
  },
  {
    id: 'Compact Engineering',
    name: 'Compact Engineering',
    category: 'Technical & DevOps',
    badge: 'Developer Choice',
    accentColor: 'border-emerald-600',
    description:
      'Maximum information density with monospace section headers, skill badges, and concise achievements.',
    bestFor: 'DevOps Architects, Cloud Engineers, Senior Programmers',
    features: ['Monospace Headers', 'Technical Skill Pills', 'High Information Density', 'Git & Tech Friendly'],
  },
];

const SAMPLE_RESUME: IResume = {
  _id: 'sample-template-preview',
  userId: 'sample-user',
  title: 'Senior Software Engineer',
  targetRole: 'Senior Software Engineer',
  format: 'DOCX',
  template: 'Standard Executive',
  personalDetails: {
    fullName: 'Marcus Chen',
    email: 'marcus.chen@stanford.alumni.edu',
    phone: '+1 (213) 555-0198',
    location: 'Los Angeles, CA',
    linkedin: 'linkedin.com/in/marcuschen-dev',
    github: 'github.com/marcuschen-code',
    portfolio: 'marcuschen.dev',
  },
  education: [
    {
      institution: 'University of Southern California',
      degree: 'Master of Science, Computer Science',
      startDate: 'Aug 2022',
      endDate: 'May 2024',
      gpa: '3.92 / 4.00',
      coursework: 'Distributed Systems, Deep Learning, Algorithms, Database Systems',
    },
    {
      institution: 'University of Washington',
      degree: 'Bachelor of Science, Software Engineering',
      startDate: 'Sep 2018',
      endDate: 'Jun 2022',
      gpa: '3.86 / 4.00',
      coursework: 'Data Structures, Operating Systems, Computer Networks',
    },
  ],
  experience: [
    {
      company: 'Apex Neural Technologies',
      role: 'Lead Full Stack Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jun 2024',
      endDate: 'Present',
      current: true,
      bullets: [
        'Developed an Android app with MVVM clean architecture that streamlined enterprise inventory logging by 42% across 8 regional warehouses.',
        'Created cross-platform Flutter app handling real-time biometric synchronization for 140,000 active clinical study participants.',
        'Deployed 3 custom computer vision CNN models into production edge instances, slashing inference latency from 180ms down to 34ms.',
      ],
    },
    {
      company: 'Starlight Systems Labs',
      role: 'Mobile Systems Intern',
      location: 'Seattle, WA',
      startDate: 'May 2023',
      endDate: 'Aug 2023',
      current: false,
      bullets: [
        'Optimized battery drain by 28% through selective background telemetry polling.',
      ],
    },
  ],
  skills: ['Python', 'TypeScript', 'Node.js', 'Docker', 'Kubernetes', 'AWS', 'PyTorch'],
  downloadsCount: 0,
  lastEditedBy: 'You',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const TemplatesGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const handleUseTemplate = (templateName: string) => {
    navigate(`/builder?template=${encodeURIComponent(templateName)}`);
  };

  const activeResumeWithTemplate: IResume | null = previewTemplate
    ? { ...SAMPLE_RESUME, template: previewTemplate }
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            TEMPLATES / GALLERY
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
            Templates Gallery
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Choose from 5 professionally designed, ATS-friendly templates optimized for DOCX and PDF export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            5 Templates Available
          </span>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
          >
            {/* Visual Miniature Card */}
            <div className="h-48 bg-neutral-100/80 p-4 border-b border-neutral-200 flex items-center justify-center relative overflow-hidden group-hover:bg-neutral-100 transition-colors">
              {tmpl.badge && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold tracking-wide shadow-xs">
                  {tmpl.badge}
                </span>
              )}

              {/* Template miniature preview wireframe */}
              <div
                className={`w-36 h-40 bg-white rounded shadow-sm border border-neutral-300 p-2.5 flex flex-col justify-between select-none pointer-events-none transform group-hover:scale-105 transition-transform duration-200 ${
                  tmpl.id === 'Corporate Ivy Classic' ? 'font-serif' : 'font-sans'
                }`}
              >
                {tmpl.id === 'Creative Split' ? (
                  <div className="flex gap-1.5 h-full">
                    <div className="w-1/3 bg-neutral-800 rounded-xs p-1 flex flex-col gap-1">
                      <div className="w-6 h-1 bg-white rounded-full"></div>
                      <div className="w-8 h-0.5 bg-neutral-400 rounded-full mt-1"></div>
                      <div className="w-7 h-0.5 bg-neutral-400 rounded-full"></div>
                    </div>
                    <div className="w-2/3 flex flex-col gap-1.5 pl-0.5">
                      <div className="w-10 h-1 bg-neutral-800 rounded-full"></div>
                      <div className="w-full h-0.5 bg-neutral-200 rounded-full"></div>
                      <div className="w-16 h-0.5 bg-neutral-200 rounded-full"></div>
                      <div className="w-10 h-1 bg-neutral-800 rounded-full mt-1"></div>
                      <div className="w-full h-0.5 bg-neutral-200 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={`space-y-1 ${
                        tmpl.id === 'Modern Minimalist'
                          ? 'border-l-2 border-blue-600 pl-1 text-left'
                          : tmpl.id === 'Compact Engineering'
                          ? 'text-left font-mono'
                          : 'text-center'
                      }`}
                    >
                      <div
                        className={`h-1.5 bg-neutral-900 rounded-full ${
                          tmpl.id === 'Standard Executive' || tmpl.id === 'Corporate Ivy Classic'
                            ? 'w-14 mx-auto'
                            : 'w-12'
                        }`}
                      ></div>
                      <div
                        className={`h-1 bg-neutral-300 rounded-full ${
                          tmpl.id === 'Standard Executive' || tmpl.id === 'Corporate Ivy Classic'
                            ? 'w-20 mx-auto'
                            : 'w-16'
                        }`}
                      ></div>
                    </div>
                    <div className="w-full h-px bg-neutral-200 my-0.5"></div>
                    <div className="space-y-1 flex-1">
                      <div className="w-8 h-1 bg-neutral-700 rounded-full"></div>
                      <div className="w-full h-0.5 bg-neutral-200 rounded-full"></div>
                      <div className="w-24 h-0.5 bg-neutral-200 rounded-full"></div>
                      <div className="w-8 h-1 bg-neutral-700 rounded-full mt-1"></div>
                      <div className="w-full h-0.5 bg-neutral-200 rounded-full"></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  {tmpl.category}
                </div>
                <h3 className="text-base font-bold text-neutral-900 mt-0.5">{tmpl.name}</h3>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{tmpl.description}</p>

                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <div className="text-[11px] font-semibold text-neutral-700">Best Suited For:</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{tmpl.bestFor}</div>
                </div>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {tmpl.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded text-[10px] text-neutral-600 font-medium"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(tmpl.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUseTemplate(tmpl.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-black rounded-lg transition shadow-xs cursor-pointer"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && activeResumeWithTemplate && (
        <PreviewModal
          isOpen={true}
          resume={activeResumeWithTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
};
