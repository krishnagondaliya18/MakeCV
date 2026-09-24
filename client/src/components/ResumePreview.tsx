import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Printer, Copy, Check } from 'lucide-react';
import { IResume } from '../types';

interface Props {
  resume: Partial<IResume>;
  zoomLevel?: number;
  templateOverride?: string;
}

// Helper: detect platform name from URL
const getLinkLabel = (url: string): string => {
  const lower = url.toLowerCase();
  if (lower.includes('linkedin')) return 'LinkedIn';
  if (lower.includes('github')) return 'GitHub';
  if (lower.includes('portfolio') || lower.includes('behance') || lower.includes('dribbble'))
    return 'Portfolio';
  // Fallback: if it looks like a personal website
  if (lower.includes('.dev') || lower.includes('.io') || lower.includes('.com')) return 'Portfolio';
  return 'Link';
};

// Helper: ensure URL has protocol for href
const toFullUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export const ResumePreview: React.FC<Props> = ({
  resume,
  zoomLevel: initialZoom = 100,
  templateOverride,
}) => {
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [copied, setCopied] = useState<boolean>(false);

  const activeTemplate = templateOverride || resume.template || 'Standard Executive';

  const personal = resume.personalDetails || {
    fullName: 'MARCUS CHEN',
    email: 'marcus.chen@stanford.alumni.edu',
    phone: '+1 (213) 555-0198',
    location: 'Los Angeles, CA',
    linkedin: 'linkedin.com/in/marcuschen-dev',
    github: 'github.com/marcuschen-code',
    portfolio: 'marcuschen.dev',
    summary: '',
  };

  const education = resume.education || [];
  const experience = resume.experience || [];
  const skills = resume.skills || [];
  const skillCategories = resume.skillCategories || [];
  const hasCategorizedSkills =
    skillCategories.length > 0 &&
    skillCategories.some((c) => Boolean(c.category) || (c.skills && c.skills.length > 0));
  const customSections = resume.customSections || [];

  const contactList = [personal.location, personal.phone, personal.email].filter(Boolean);

  // Build links with labels
  const linkEntries = [
    { url: personal.linkedin, label: 'LinkedIn' },
    { url: personal.github, label: 'GitHub' },
    { url: personal.portfolio, label: 'Portfolio' },
  ].filter((l) => l.url);

  const handleCopyText = () => {
    let plainText = `${personal.fullName || 'RESUME'}\n`;
    plainText += `${contactList.join(' | ')}\n`;
    plainText += `${linkEntries.map((l) => `${l.label}: ${l.url}`).join(' | ')}\n\n`;

    if (personal.summary) {
      plainText += `SUMMARY\n${personal.summary}\n\n`;
    }

    if (education.length > 0) {
      plainText += `EDUCATION\n`;
      education.forEach((edu) => {
        plainText += `${edu.institution} (${[edu.startDate, edu.endDate].filter(Boolean).join(' - ')})\n`;
        plainText += `${edu.degree} ${edu.gpa ? `[GPA: ${edu.gpa}]` : ''}\n`;
        if (edu.coursework) plainText += `Relevant Coursework: ${edu.coursework}\n`;
        plainText += `\n`;
      });
    }

    if (experience.length > 0) {
      plainText += `EXPERIENCE\n`;
      experience.forEach((exp) => {
        plainText += `${exp.company} | ${exp.role} (${[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' - ')})\n`;
        if (exp.location) plainText += `${exp.location}\n`;
        exp.bullets?.forEach((b) => {
          if (b.trim()) plainText += `• ${b.trim()}\n`;
        });
        plainText += `\n`;
      });
    }

    if (hasCategorizedSkills) {
      plainText += `KEY SKILLS\n`;
      skillCategories.forEach((cat) => {
        if (cat.category || cat.skills?.length) {
          plainText += `${cat.category}: ${cat.skills.join(', ')}\n`;
        }
      });
      plainText += `\n`;
    } else if (skills.length > 0) {
      plainText += `KEY SKILLS\n${skills.join(', ')}\n\n`;
    }

    customSections.forEach((section) => {
      if (section.title) {
        plainText += `${section.title.toUpperCase()}\n`;
        section.items.forEach((item) => {
          if (item.trim()) plainText += `• ${item.trim()}\n`;
        });
        plainText += `\n`;
      }
    });

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Render Template 3: Creative Split (Two Column Layout)
  const renderCreativeSplit = () => (
    <div className="grid grid-cols-12 gap-6 min-h-[850px]">
      {/* Left Column (4 cols) */}
      <div className="col-span-4 bg-neutral-900 text-white p-5 rounded-lg -m-8 mr-0 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight uppercase leading-snug">
            {personal.fullName || 'YOUR NAME'}
          </h1>
          <p className="text-xs text-neutral-300 font-medium mt-1">
            {resume.targetRole || 'Professional'}
          </p>

          {/* Contact Details */}
          <div className="mt-6 space-y-2 text-[11px] text-neutral-300">
            <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-400 pb-1 border-b border-neutral-700">
              Contact
            </div>
            {personal.email && <div className="break-all">{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.location && <div>{personal.location}</div>}
            {linkEntries.map((link, idx) => (
              <a
                key={idx}
                href={toFullUrl(link.url!)}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all text-blue-300 hover:text-blue-200 underline"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Summary in sidebar */}
          {personal.summary && (
            <div className="mt-6">
              <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-400 pb-1 border-b border-neutral-700 mb-2">
                Summary
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">{personal.summary}</p>
            </div>
          )}

          {/* Skills Column */}
          {/* Skills Column */}
          {hasCategorizedSkills ? (
            <div className="mt-6 space-y-3">
              <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-400 pb-1 border-b border-neutral-700">
                Skills & Technologies
              </div>
              {skillCategories.map((cat, idx) =>
                cat.category || cat.skills?.length ? (
                  <div key={idx} className="space-y-1">
                    <div className="text-[11px] font-bold text-neutral-300">
                      {cat.category}:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.5 bg-neutral-800 text-neutral-200 rounded text-[9.5px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          ) : skills.length > 0 ? (
            <div className="mt-6">
              <div className="font-bold uppercase tracking-wider text-[10px] text-neutral-400 pb-1 border-b border-neutral-700 mb-2">
                Core Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-neutral-800 text-neutral-200 rounded text-[10px] font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Right Column (8 cols) */}
      <div className="col-span-8 pl-2 space-y-5">
        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2 border-neutral-900 mb-2.5">
              Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-neutral-900">
                    <span>{exp.company}</span>
                    <span className="text-[11px] text-neutral-500 font-normal">
                      {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' - ')}
                    </span>
                  </div>
                  <div className="italic text-neutral-700 text-[11px] mb-1">
                    {exp.role} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-neutral-700">
                      {exp.bullets.map((b, bIdx) => b.trim() && <li key={bIdx}>{b.trim()}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2 border-neutral-900 mb-2.5">
              Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-neutral-900">
                    <span>{edu.institution}</span>
                    <span className="text-[11px] text-neutral-500 font-normal">
                      {[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}
                    </span>
                  </div>
                  <div className="italic text-neutral-700 text-[11px]">
                    {edu.degree} {edu.gpa && `(GPA: ${edu.gpa})`}
                  </div>
                  {edu.coursework && (
                    <div className="text-[10.5px] text-neutral-600 mt-0.5">
                      Coursework: {edu.coursework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections in Creative Split */}
        {customSections.map((section, sIdx) =>
          section.title ? (
            <div key={sIdx}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2 border-neutral-900 mb-2.5">
                {section.title}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-neutral-700">
                {section.items.map(
                  (item, iIdx) =>
                    item.trim() && (
                      <li key={iIdx} className="leading-snug">
                        {item.trim()}
                      </li>
                    )
                )}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-neutral-100/70 rounded-xl border border-neutral-200 overflow-hidden">
      {/* Top Preview Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-neutral-200 text-xs text-neutral-600 no-print">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wider text-neutral-800 uppercase text-[11px]">
            Preview:
          </span>
          <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-medium text-[11px] border border-neutral-200">
            {activeTemplate}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-100 rounded-md px-2 py-0.5 border border-neutral-200">
            <button
              onClick={() => setZoom((prev) => Math.max(70, prev - 10))}
              className="hover:text-black cursor-pointer font-bold px-1"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-medium">{zoom}%</span>
            <button
              onClick={() => setZoom((prev) => Math.min(130, prev + 10))}
              className="hover:text-black cursor-pointer font-bold px-1"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-neutral-300">|</span>
          <span className="font-medium text-neutral-500">Standard A4</span>
        </div>
      </div>

      {/* Printable / Rendered Paper Sheet Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className={`transition-transform duration-200 bg-white shadow-md border border-neutral-200 w-full max-w-[650px] min-h-[880px] p-8 text-neutral-900 print-only-resume ${
            activeTemplate === 'Corporate Ivy Classic' ? 'font-serif' : 'font-sans'
          }`}
        >
          {activeTemplate === 'Creative Split' ? (
            renderCreativeSplit()
          ) : (
            <>
              {/* Header */}
              <div
                className={`pb-2 ${
                  activeTemplate === 'Modern Minimalist'
                    ? 'text-left border-l-4 border-neutral-900 pl-4 py-1'
                    : activeTemplate === 'Compact Engineering'
                    ? 'text-left border-b-2 border-neutral-900 pb-3 font-mono'
                    : 'text-center'
                }`}
              >
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 uppercase">
                  {personal.fullName || 'YOUR NAME'}
                </h1>
                {activeTemplate === 'Modern Minimalist' && (
                  <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mt-0.5">
                    {resume.targetRole || 'Professional'}
                  </p>
                )}

                {/* Contact info line */}
                {contactList.length > 0 && (
                  <div
                    className={`text-[11px] text-neutral-600 mt-1 flex flex-wrap items-center gap-2 ${
                      activeTemplate === 'Standard Executive' || activeTemplate === 'Corporate Ivy Classic'
                        ? 'justify-center'
                        : 'justify-start'
                    }`}
                  >
                    {contactList.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <span>{item}</span>
                        {idx < contactList.length - 1 && <span>•</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Online links line — show as clickable platform names */}
                {linkEntries.length > 0 && (
                  <div
                    className={`text-[11px] text-neutral-600 mt-0.5 flex flex-wrap items-center gap-2 ${
                      activeTemplate === 'Standard Executive' || activeTemplate === 'Corporate Ivy Classic'
                        ? 'justify-center'
                        : 'justify-start'
                    }`}
                  >
                    {linkEntries.map((link, idx) => (
                      <React.Fragment key={idx}>
                        <a
                          href={toFullUrl(link.url!)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 underline"
                        >
                          {link.label}
                        </a>
                        {idx < linkEntries.length - 1 && <span>•</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider (if not Compact) */}
              {activeTemplate !== 'Compact Engineering' && (
                <hr className="border-t border-neutral-300 my-3" />
              )}

              {/* Professional Summary */}
              {personal.summary && (
                <div className="mb-4">
                  <h2
                    className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 ${
                      activeTemplate === 'Compact Engineering'
                        ? 'font-mono text-neutral-900 border-b border-neutral-900'
                        : 'text-neutral-900 border-b border-neutral-300'
                    }`}
                  >
                    Summary
                  </h2>
                  <p className="text-[11px] text-neutral-700 leading-relaxed">
                    {personal.summary}
                  </p>
                </div>
              )}

              {/* Education Section */}
              {education.length > 0 && (
                <div className="mb-4">
                  <h2
                    className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 ${
                      activeTemplate === 'Compact Engineering'
                        ? 'font-mono text-neutral-900 border-b border-neutral-900'
                        : 'text-neutral-900 border-b border-neutral-300'
                    }`}
                  >
                    Education
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between items-baseline font-bold text-neutral-900">
                          <span>{edu.institution || 'University Name'}</span>
                          <span className="text-[11px] font-normal text-neutral-600">
                            {[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline italic text-neutral-700">
                          <span>{edu.degree || 'Degree / Field'}</span>
                          {edu.gpa && (
                            <span className="text-[11px] not-italic text-neutral-600 font-medium">
                              GPA: {edu.gpa}
                            </span>
                          )}
                        </div>
                        {edu.coursework && (
                          <div className="text-[10.5px] text-neutral-600 mt-0.5">
                            <span className="font-semibold text-neutral-700">Relevant Coursework: </span>
                            {edu.coursework}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {experience.length > 0 && (
                <div className="mb-4">
                  <h2
                    className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 ${
                      activeTemplate === 'Compact Engineering'
                        ? 'font-mono text-neutral-900 border-b border-neutral-900'
                        : 'text-neutral-900 border-b border-neutral-300'
                    }`}
                  >
                    Experience
                  </h2>
                  <div className="space-y-3.5">
                    {experience.map((exp, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between items-baseline font-bold text-neutral-900">
                          <span>{exp.company || 'Company Name'}</span>
                          <span className="text-[11px] font-normal text-neutral-600">
                            {[exp.startDate, exp.current ? 'Present' : exp.endDate]
                              .filter(Boolean)
                              .join(' - ')}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline italic text-neutral-700 mb-1">
                          <span>{exp.role || 'Position Title'}</span>
                          {exp.location && (
                            <span className="text-[11px] not-italic text-neutral-600">
                              {exp.location}
                            </span>
                          )}
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-neutral-700">
                            {exp.bullets.map(
                              (bullet, bIdx) =>
                                bullet.trim() && (
                                  <li key={bIdx} className="leading-snug">
                                    {bullet.trim()}
                                  </li>
                                )
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Skills Section */}
              {(hasCategorizedSkills || skills.length > 0) && (
                <div className="mb-3">
                  <h2
                    className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 ${
                      activeTemplate === 'Compact Engineering'
                        ? 'font-mono text-neutral-900 border-b border-neutral-900'
                        : 'text-neutral-900 border-b border-neutral-300'
                    }`}
                  >
                    Skills & Technical Proficiencies
                  </h2>
                  {hasCategorizedSkills ? (
                    <div className="space-y-1.5 text-xs text-neutral-800">
                      {skillCategories.map((cat, idx) =>
                        cat.category || cat.skills?.length ? (
                          <div key={idx} className="leading-relaxed">
                            <span className="font-bold text-neutral-900">{cat.category}: </span>
                            <span className="text-neutral-700">{cat.skills.join(', ')}</span>
                          </div>
                        ) : null
                      )}
                    </div>
                  ) : activeTemplate === 'Compact Engineering' ? (
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {skills.map((s, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 text-xs text-neutral-800">
                      {skills.join('  •  ')}
                    </div>
                  )}
                </div>
              )}

              {/* Custom Sections */}
              {customSections.map((section, sIdx) =>
                section.title ? (
                  <div key={sIdx} className="mb-4">
                    <h2
                      className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2 ${
                        activeTemplate === 'Compact Engineering'
                          ? 'font-mono text-neutral-900 border-b border-neutral-900'
                          : 'text-neutral-900 border-b border-neutral-300'
                      }`}
                    >
                      {section.title}
                    </h2>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-neutral-700">
                      {section.items.map(
                        (item, iIdx) =>
                          item.trim() && (
                            <li key={iIdx} className="leading-snug">
                              {item.trim()}
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                ) : null
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer Tools Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-neutral-200 text-xs text-neutral-500 no-print">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Standard 1-page format
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-neutral-600 hover:text-black font-medium cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-neutral-600 hover:text-black font-medium cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Plain Text
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
