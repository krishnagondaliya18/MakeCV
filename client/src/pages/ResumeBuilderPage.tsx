import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bookmark,
  Eye,
  Download,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Link2,
  Code2,
  Globe,
  CheckCircle2,
  Printer,
  ChevronDown,
  Sparkles,
  FileText,
} from 'lucide-react';
import { AppDispatch, RootState } from '../store';
import {
  createResume,
  updateResume,
  fetchResumeById,
  incrementDownload,
  fetchResumeStats,
} from '../store/resumeSlice';
import { IResume, IEducation, IExperience, ICustomSection, ISkillCategory } from '../types';
import { ResumePreview } from '../components/ResumePreview';
import { PreviewModal } from '../components/PreviewModal';
import { AddSectionModal } from '../components/AddSectionModal';
import { exportResumeToDocx } from '../services/docxExport';

export const ResumeBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const templateParam = searchParams.get('template');
  const isEditing = !!resumeId;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedResume, actionLoading } = useSelector((state: RootState) => state.resumes);

  const [activeResumeId, setActiveResumeId] = useState<string | null>(resumeId);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Saved');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    templateParam || 'Standard Executive'
  );

  // Form State
  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  });

  const [educationList, setEducationList] = useState<IEducation[]>([
    {
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      gpa: '',
      coursework: '',
    },
  ]);

  const [experienceList, setExperienceList] = useState<IExperience[]>([
    {
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    },
  ]);

  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillCategories, setSkillCategories] = useState<ISkillCategory[]>([
    {
      category: 'Languages',
      skills: ['Java', 'Python', 'JavaScript', 'SQL', 'HTML', 'CSS'],
    },
    {
      category: 'Frameworks',
      skills: ['React', 'Angular', 'Node.js', 'Django', 'Spring Boot', 'FastAPI'],
    },
    {
      category: 'Backend',
      skills: ['REST APIs', 'Web Services', 'Microservices', 'JWT', 'Spring Security'],
    },
    {
      category: 'Databases/Technologies',
      skills: ['PostgreSQL', 'MongoDB'],
    },
    {
      category: 'Core CS',
      skills: ['Data Structures Algorithms', 'OOPS', 'DBMS'],
    },
    {
      category: 'Libraries',
      skills: ['Numpy', 'Pandas', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'LangChain'],
    },
  ]);
  const [categorySkillInputs, setCategorySkillInputs] = useState<{ [key: number]: string }>({});
  const [customSections, setCustomSections] = useState<ICustomSection[]>([]);

  // Load existing resume if editing
  useEffect(() => {
    if (resumeId) {
      setActiveResumeId(resumeId);
      dispatch(fetchResumeById(resumeId));
    } else {
      // Default placeholder starter template for new resume
      setTitle('Senior Software Engineer');
      setTargetRole('Senior Software Engineer');
      setPersonalDetails({
        fullName: 'Marcus Chen',
        email: 'marcus.chen@stanford.alumni.edu',
        phone: '+1 (213) 555-0198',
        location: 'Los Angeles, CA',
        linkedin: 'linkedin.com/in/marcuschen-dev',
        github: 'github.com/marcuschen-code',
        portfolio: 'marcuschen.dev',
        summary:
          'Full-stack engineer with 5+ years of experience building scalable web applications and distributed systems. Passionate about clean architecture and delivering high-impact user experiences.',
      });
      setEducationList([
        {
          institution: 'University of Southern California',
          degree: 'Master of Science, Computer Science',
          startDate: 'Aug 2022',
          endDate: 'May 2024',
          gpa: '3.92 / 4.00',
          coursework: 'Distributed Systems, Deep Learning, Analysis of Algorithms, Database Systems',
        },
      ]);
      setExperienceList([
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
      ]);
      setSkillsList(['Python', 'TypeScript', 'Node.js', 'Docker', 'AWS']);
      setCustomSections([
        {
          title: 'Projects',
          items: [
            'Distributed Vector Cache: In-memory distributed key-value store in Rust achieving 250k QPS.',
            'AI Document Parser: Built microservice parsing PDF & DOCX resumes with 99.4% accuracy.',
          ],
        },
      ]);
    }
  }, [resumeId, dispatch]);

  // When selectedResume is fetched
  useEffect(() => {
    if (isEditing && selectedResume) {
      setTitle(selectedResume.title || '');
      setTargetRole(selectedResume.targetRole || '');
      setPersonalDetails({
        fullName: selectedResume.personalDetails?.fullName || '',
        email: selectedResume.personalDetails?.email || '',
        phone: selectedResume.personalDetails?.phone || '',
        location: selectedResume.personalDetails?.location || '',
        linkedin: selectedResume.personalDetails?.linkedin || '',
        github: selectedResume.personalDetails?.github || '',
        portfolio: selectedResume.personalDetails?.portfolio || '',
        summary: selectedResume.personalDetails?.summary || '',
      });
      if (selectedResume.education?.length) {
        setEducationList(selectedResume.education);
      }
      if (selectedResume.experience?.length) {
        setExperienceList(selectedResume.experience);
      }
      if (selectedResume.skills?.length) {
        setSkillsList(selectedResume.skills);
      }
      if (selectedResume.skillCategories?.length) {
        setSkillCategories(selectedResume.skillCategories);
      }
      if (selectedResume.customSections?.length) {
        setCustomSections(selectedResume.customSections);
      }
      if (selectedResume.template) {
        setSelectedTemplate(selectedResume.template);
      }
    }
  }, [selectedResume, isEditing]);

  // Active combined resume object for live preview
  const liveResume: Partial<IResume> = {
    title: title || targetRole || personalDetails.fullName || 'Untitled Resume',
    targetRole: targetRole || 'Software Professional',
    personalDetails,
    education: educationList,
    experience: experienceList,
    skills: skillsList.length > 0 ? skillsList : skillCategories.flatMap((c) => c.skills),
    skillCategories,
    customSections,
    format: 'DOCX',
    template: selectedTemplate,
  };

  // Education Helpers
  const addEducation = () => {
    setEducationList((prev) => [
      ...prev,
      {
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
        gpa: '',
        coursework: '',
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof IEducation, value: any) => {
    setEducationList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Experience Helpers
  const addExperience = () => {
    setExperienceList((prev) => [
      ...prev,
      {
        company: '',
        role: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        bullets: [''],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof IExperience, value: any) => {
    setExperienceList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addBullet = (expIndex: number) => {
    setExperienceList((prev) => {
      const updated = [...prev];
      updated[expIndex] = {
        ...updated[expIndex],
        bullets: [...(updated[expIndex].bullets || []), ''],
      };
      return updated;
    });
  };

  const updateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    setExperienceList((prev) => {
      const updated = [...prev];
      const bullets = [...(updated[expIndex].bullets || [])];
      bullets[bulletIndex] = text;
      updated[expIndex] = { ...updated[expIndex], bullets };
      return updated;
    });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setExperienceList((prev) => {
      const updated = [...prev];
      const bullets = updated[expIndex].bullets.filter((_, idx) => idx !== bulletIndex);
      updated[expIndex] = { ...updated[expIndex], bullets };
      return updated;
    });
  };

  // Skill Helpers
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    if ('key' in e) e.preventDefault();

    const trimmed = skillInput.trim().replace(/^,+|,+$/g, '');
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList((prev) => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkillsList((prev) => prev.filter((s) => s !== skill));
  };

  // Skill Category Helpers
  const addSkillCategory = (name = 'New Category') => {
    setSkillCategories((prev) => [...prev, { category: name, skills: [] }]);
  };

  const removeSkillCategory = (index: number) => {
    setSkillCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCategoryName = (index: number, newName: string) => {
    setSkillCategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], category: newName };
      return updated;
    });
  };

  const addSkillsToCategory = (index: number, rawInput?: string) => {
    const text = rawInput !== undefined ? rawInput : categorySkillInputs[index] || '';
    if (!text.trim()) return;

    // Support comma-separated or newline-separated input
    const newItems = text
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (newItems.length === 0) return;

    setSkillCategories((prev) => {
      const updated = [...prev];
      const existing = updated[index]?.skills || [];
      const merged = [...existing];
      newItems.forEach((item) => {
        if (!merged.includes(item)) merged.push(item);
      });
      updated[index] = { ...updated[index], skills: merged };
      return updated;
    });

    setCategorySkillInputs((prev) => ({ ...prev, [index]: '' }));
  };

  const removeSkillFromCategory = (catIndex: number, skillToRemove: string) => {
    setSkillCategories((prev) => {
      const updated = [...prev];
      updated[catIndex] = {
        ...updated[catIndex],
        skills: updated[catIndex].skills.filter((s) => s !== skillToRemove),
      };
      return updated;
    });
  };

  // Section Helpers
  const handleAddCustomSection = (presetTitle?: string) => {
    const defaultTitle = presetTitle || 'Projects';
    const newSection: ICustomSection = {
      title: defaultTitle,
      items: [''],
    };
    const newIndex = customSections.length;
    setCustomSections((prev) => [...prev, newSection]);
    setCurrentStep(5 + newIndex);
    setIsAddSectionModalOpen(false);
  };

  const removeCustomSection = (index: number) => {
    setCustomSections((prev) => prev.filter((_, i) => i !== index));
    if (currentStep >= 5 + index) {
      setCurrentStep(Math.max(4, currentStep - 1));
    }
  };

  const updateSectionTitle = (index: number, title: string) => {
    setCustomSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title };
      return updated;
    });
  };

  const addSectionItem = (sectionIndex: number) => {
    setCustomSections((prev) => {
      const updated = [...prev];
      updated[sectionIndex] = {
        ...updated[sectionIndex],
        items: [...updated[sectionIndex].items, ''],
      };
      return updated;
    });
  };

  const updateSectionItem = (sectionIndex: number, itemIndex: number, val: string) => {
    setCustomSections((prev) => {
      const updated = [...prev];
      const items = [...updated[sectionIndex].items];
      items[itemIndex] = val;
      updated[sectionIndex] = { ...updated[sectionIndex], items };
      return updated;
    });
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    setCustomSections((prev) => {
      const updated = [...prev];
      const items = updated[sectionIndex].items.filter((_, idx) => idx !== itemIndex);
      updated[sectionIndex] = { ...updated[sectionIndex], items };
      return updated;
    });
  };

  // Save logic
  const handleSave = async (showToast = true, navigateToHome = false): Promise<string | null> => {
    if (!personalDetails.fullName || !personalDetails.email) {
      alert('Please fill in at least Full Name and Email Address in Step 1.');
      setCurrentStep(1);
      return null;
    }

    setSaveStatus('Saving...');

    const payload = {
      title: title || targetRole || personalDetails.fullName,
      targetRole: targetRole || 'Software Professional',
      personalDetails,
      education: educationList.filter((e) => e.institution || e.degree),
      experience: experienceList.filter((e) => e.company || e.role),
      skills: skillsList.length > 0 ? skillsList : skillCategories.flatMap((c) => c.skills),
      skillCategories: skillCategories.filter((c) => c.category.trim() || c.skills.length > 0),
      customSections: customSections.filter((s) => s.title.trim()),
      template: selectedTemplate,
      format: 'DOCX',
    };

    let savedId = activeResumeId;

    if (activeResumeId) {
      const res = await dispatch(updateResume({ id: activeResumeId, resumeData: payload }));
      if (updateResume.fulfilled.match(res)) {
        setSaveStatus('Saved');
        dispatch(fetchResumeStats());
        if (showToast && !navigateToHome) alert('Resume updated successfully!');
      } else {
        setSaveStatus('Error');
        return null;
      }
    } else {
      const res = await dispatch(createResume(payload));
      if (createResume.fulfilled.match(res)) {
        savedId = res.payload._id;
        setActiveResumeId(savedId);
        setSaveStatus('Saved');
        dispatch(fetchResumeStats());
        window.history.replaceState(null, '', `/builder?id=${savedId}`);
        if (showToast && !navigateToHome) {
          alert('Resume created and saved to My Resumes!');
        }
      } else {
        setSaveStatus('Error');
        return null;
      }
    }

    if (navigateToHome) {
      navigate('/');
    }

    return savedId;
  };

  const handleExportDocx = async () => {
    // Auto-save so the newly built resume is immediately stored in the database & visible in My Resumes!
    const savedId = await handleSave(false, false);
    await exportResumeToDocx(liveResume);
    if (savedId) {
      dispatch(incrementDownload(savedId));
      dispatch(fetchResumeStats());
    }
  };

  const handleExportPdf = async () => {
    // Auto-save so the newly built resume is immediately stored in the database & visible in My Resumes!
    const savedId = await handleSave(false, false);

    const resumeEl = document.querySelector('.print-only-resume');
    if (!resumeEl) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${personalDetails.fullName || 'Resume'} - PDF</title>
          ${styles}
          <style>
            body {
              margin: 0;
              padding: 15mm;
              background: white;
              color: black;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print { display: none !important; }
            .print-resume-container {
              max-width: 650px;
              margin: 0 auto;
              transform: none !important;
            }
            @page { size: A4; margin: 8mm; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-resume-container">${resumeEl.innerHTML}</div>
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 600);

    if (savedId) {
      dispatch(incrementDownload(savedId));
      dispatch(fetchResumeStats());
    }
  };

  const totalSteps = 4 + customSections.length;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <Link to="/" className="hover:text-black">
              My Resumes
            </Link>
            <span>&gt;</span>
            <span className="text-neutral-900">
              {isEditing ? 'Edit Resume' : 'Create Resume'}
            </span>
            <span>•</span>
            <span className="text-neutral-400 flex items-center gap-1 font-mono text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {saveStatus}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
            {isEditing ? 'Edit Resume Details' : 'Create New Resume'}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-neutral-300 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer shadow-xs"
          >
            <option value="Standard Executive">Standard Executive</option>
            <option value="Modern Minimalist">Modern Minimalist</option>
            <option value="Creative Split">Creative Split</option>
            <option value="Corporate Ivy Classic">Corporate Ivy Classic</option>
            <option value="Compact Engineering">Compact Engineering</option>
          </select>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-700" />
            <span>Export as PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportDocx}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-black transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export as DOCX</span>
          </button>
        </div>
      </div>

      {/* Stepped Tab Buttons with "+ Add Section" button outside ("bahr") */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-neutral-200">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {[
            { step: 1, label: 'Personal Details' },
          { step: 2, label: 'Education' },
          { step: 3, label: 'Experience' },
          { step: 4, label: 'Skills' },
        ].map((tab) => {
          const isActive = currentStep === tab.step;
          return (
            <button
              key={tab.step}
              type="button"
              onClick={() => setCurrentStep(tab.step)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isActive ? 'bg-white text-black' : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                {tab.step}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Dynamic Custom Section Tabs */}
        {customSections.map((sec, idx) => {
          const stepNum = 5 + idx;
          const isActive = currentStep === stepNum;
          return (
            <div
              key={idx}
              className={`flex items-center rounded-lg border transition shrink-0 ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <button
                type="button"
                onClick={() => setCurrentStep(stepNum)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold cursor-pointer"
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-white text-black' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {stepNum}
                </span>
                <span>{sec.title || `Section #${idx + 1}`}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCustomSection(idx);
                }}
                className={`pr-2.5 pl-1 py-2 text-xs font-bold cursor-pointer hover:text-rose-400 ${
                  isActive ? 'text-neutral-300' : 'text-neutral-400'
                }`}
                title="Remove Section"
              >
                ✕
              </button>
            </div>
          );
        })}

        </div>

        {/* Prominent "+ Add Section" Button outside ("bahr") */}
        <button
          type="button"
          onClick={() => setIsAddSectionModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-neutral-900 text-white hover:bg-black transition cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span> Add </span>
        </button>
      </div>

      {/* 2-Column Grid: Left Form (Steps) & Right Live Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Container */}
        <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <div className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  STEP 01 / {String(totalSteps).padStart(2, '0')}
                </div>
                <h2 className="text-xl font-bold text-neutral-900 mt-0.5">Personal Details</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Contact information, summary statement, and online links.
                </p>
              </div>

              <hr className="border-neutral-200" />

              <div className="space-y-4">
                {/* Target Role & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Target Role / Job Title *
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => {
                        setTargetRole(e.target.value);
                        if (!title) setTitle(e.target.value);
                      }}
                      placeholder="e.g. Lead AI Research Scientist"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Resume Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Marcus Chen - Executive CV"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={personalDetails.fullName}
                      onChange={(e) =>
                        setPersonalDetails({ ...personalDetails, fullName: e.target.value })
                      }
                      placeholder="Marcus Chen"
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={personalDetails.email}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, email: e.target.value })
                        }
                        placeholder="marcus.chen@alumni.usc.edu"
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={personalDetails.phone}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, phone: e.target.value })
                        }
                        placeholder="+1 (213) 555-0198"
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & LinkedIn */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={personalDetails.location}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, location: e.target.value })
                        }
                        placeholder="Los Angeles, CA"
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={personalDetails.linkedin}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, linkedin: e.target.value })
                        }
                        placeholder="linkedin.com/in/marcuschen-dev"
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                {/* GitHub & Portfolio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      GitHub Profile
                    </label>
                    <div className="relative">
                      <Code2 className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={personalDetails.github}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, github: e.target.value })
                        }
                        placeholder="github.com/marcuschen-code"
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Portfolio / Website
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={personalDetails.portfolio}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, portfolio: e.target.value })
                        }
                        placeholder="marcuschen.dev"
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Summary Section */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Professional Summary
                    </label>
                    <span className="text-[11px] text-neutral-400">Recommended for impact</span>
                  </div>
                  <textarea
                    rows={3}
                    value={personalDetails.summary}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, summary: e.target.value })
                    }
                    placeholder="Brief 2-3 sentence summary highlighting your core strengths, technical focus, and achievements..."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
                  />
                </div>

                {/* Inside Section Quick Add Bar ("tema add section") */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-neutral-800">Add More Sections to Resume:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddSectionModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span> Add </span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Projects', 'Certifications', 'Awards & Honors', 'Languages', 'Publications'].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => handleAddCustomSection(sec)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md text-neutral-700 cursor-pointer shadow-2xs transition"
                      >
                        + {sec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-end pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                >
                  <span>Next: Education</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    STEP 02 / {String(totalSteps).padStart(2, '0')}
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mt-0.5">Education</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Universities, degrees, and academic coursework.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add School</span>
                </button>
              </div>

              <hr className="border-neutral-200" />

              <div className="space-y-5">
                {educationList.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700">
                        School #{idx + 1}
                      </span>
                      {educationList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="text-neutral-400 hover:text-rose-600 transition cursor-pointer p-1"
                          title="Remove Education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          Institution / University *
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          placeholder="e.g. University of Southern California"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          Degree / Major *
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          placeholder="e.g. Master of Science, Computer Science"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                          placeholder="Aug 2022"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          End Date / Expected
                        </label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                          placeholder="May 2024"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          GPA (Optional)
                        </label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                          placeholder="3.92 / 4.00"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Relevant Coursework (Optional)
                      </label>
                      <input
                        type="text"
                        value={edu.coursework || ''}
                        onChange={(e) => updateEducation(idx, 'coursework', e.target.value)}
                        placeholder="Distributed Systems, Deep Learning, Algorithms, Database Systems"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Personal Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                >
                  <span>Next: Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Experience */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    STEP 03 / {String(totalSteps).padStart(2, '0')}
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mt-0.5">Experience</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Work history, roles, achievements, and impact bullets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <hr className="border-neutral-200" />

              <div className="space-y-5">
                {experienceList.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-700">
                        Position #{idx + 1}
                      </span>
                      {experienceList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="text-neutral-400 hover:text-rose-600 transition cursor-pointer p-1"
                          title="Remove Experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          Company / Organization *
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          placeholder="e.g. Apex Neural Technologies"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          Job Role / Title *
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                          placeholder="e.g. Lead Full Stack Engineer"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                          placeholder="San Francisco, CA"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          placeholder="Jun 2024"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                          End Date
                        </label>
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.current ? 'Present' : exp.endDate}
                          onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black disabled:bg-neutral-100"
                        />
                        <label className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.current || false}
                            onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                            className="rounded border-neutral-300 text-black focus:ring-black"
                          />
                          Currently working here
                        </label>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-semibold text-neutral-600">
                          Key Achievements & Responsibilities
                        </label>
                        <button
                          type="button"
                          onClick={() => addBullet(idx)}
                          className="text-[11px] font-bold text-neutral-900 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Bullet</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <span className="text-neutral-400 mt-2 text-xs">•</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                              placeholder="e.g. Developed an Android app with MVVM clean architecture that streamlined enterprise inventory logging by 42%..."
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
                            />
                            {exp.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBullet(idx, bIdx)}
                                className="text-neutral-300 hover:text-rose-500 mt-2 p-1 cursor-pointer"
                                title="Remove bullet"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Education</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                >
                  <span>Next: Skills</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Skills & Categorized Groups */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    STEP 04 / {String(totalSteps).padStart(2, '0')}
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mt-0.5">Skills & Technical Proficiencies</h2>
                </div>
                <button
                  type="button"
                  onClick={() => addSkillCategory('New Category')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span> Add Category</span>
                </button>
              </div>

              <hr className="border-neutral-200" />

              {/* Quick Add Suggested Categories Bar */}
              <div className="p-3 bg-neutral-50 border border-dashed border-neutral-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-600 block">
                  Quick Add Suggested Category:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Languages',
                    'Frameworks',
                    'Backend',
                    'Databases/Technologies',
                    'Libraries',
                    'Core CS',
                    'DevOps & Cloud',
                    'Tools & Platforms',
                  ].map((catName) => (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => addSkillCategory(catName)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-neutral-100 border border-neutral-300 rounded-md text-neutral-700 cursor-pointer shadow-2xs transition"
                    >
                      + {catName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Categories List */}
              <div className="space-y-4">
                {skillCategories.map((cat, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 relative group"
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
                          Category Header #{cIdx + 1}
                        </label>
                        <input
                          type="text"
                          value={cat.category}
                          onChange={(e) => updateCategoryName(cIdx, e.target.value)}
                          placeholder="e.g. Languages, Frameworks, Backend..."
                          className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-neutral-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkillCategory(cIdx)}
                        className="text-neutral-400 hover:text-rose-600 transition cursor-pointer p-1 mt-4"
                        title="Remove Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Skills Input for this Category */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Skills (press Enter or comma, or paste comma-separated):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={categorySkillInputs[cIdx] || ''}
                          onChange={(e) =>
                            setCategorySkillInputs((prev) => ({ ...prev, [cIdx]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              addSkillsToCategory(cIdx);
                            }
                          }}
                          placeholder={`Add skills to ${cat.category || 'this category'}...`}
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                        />
                        <button
                          type="button"
                          onClick={() => addSkillsToCategory(cIdx)}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-2xs"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Skill Badges for this category */}
                    <div className="flex flex-wrap gap-1.5 min-h-[28px] items-center pt-1">
                      {cat.skills && cat.skills.length > 0 ? (
                        cat.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-neutral-300 text-xs font-semibold text-neutral-800 shadow-2xs group/pill"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkillFromCategory(cIdx, skill)}
                              className="text-neutral-400 group-hover/pill:text-rose-600 transition cursor-pointer font-bold ml-0.5"
                            >
                              ✕
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">
                          No skills added to this category yet.
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Nav */}
              <div className="flex justify-between pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Experience</span>
                </button>
                {customSections.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                  >
                    <span>Next: {customSections[0].title || 'Custom Section'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSave(true, true)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{actionLoading ? 'Saving...' : 'Save & Finish'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* DYNAMIC CUSTOM SECTION STEPS (Step 5, 6, 7...) */}
          {currentStep >= 5 && (
            (() => {
              const secIdx = currentStep - 5;
              const section = customSections[secIdx];
              if (!section) return null;

              return (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                        STEP {String(currentStep).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
                      </div>
                      <h2 className="text-xl font-bold text-neutral-900 mt-0.5">
                        {section.title || 'Custom Section'}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        Add key bullet items, projects, or achievements for this section.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomSection(secIdx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Section</span>
                    </button>
                  </div>

                  <hr className="border-neutral-200" />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(secIdx, e.target.value)}
                        placeholder="e.g. Projects, Certifications, Awards, Volunteering"
                        className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-semibold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-neutral-700">
                          Section Items / Bullets
                        </label>
                        <button
                          type="button"
                          onClick={() => addSectionItem(secIdx)}
                          className="flex items-center gap-1 text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Item</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {section.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-start gap-2">
                            <span className="text-neutral-400 mt-2 text-xs font-bold">•</span>
                            <textarea
                              rows={2}
                              value={item}
                              onChange={(e) => updateSectionItem(secIdx, iIdx, e.target.value)}
                              placeholder={`e.g. Achievement or detail #${iIdx + 1}...`}
                              className="flex-1 px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
                            />
                            {section.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSectionItem(secIdx, iIdx)}
                                className="text-neutral-400 hover:text-rose-600 mt-2 p-1 cursor-pointer"
                                title="Remove Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="flex justify-between pt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
                      >
                        <span>Next Section</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSave(true, true)}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{actionLoading ? 'Saving...' : 'Save & Finish'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* Right Pane: Live Document Preview */}
        <div className="lg:col-span-6 sticky top-20">
          <ResumePreview resume={liveResume} zoomLevel={90} />
        </div>
      </div>

      {/* Full Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        resume={liveResume as IResume}
        onClose={() => setIsPreviewModalOpen(false)}
      />

      {/* Add Custom Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAddSection={handleAddCustomSection}
      />
    </div>
  );
};
