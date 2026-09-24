import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FolderGit2, FileText, LayoutGrid, Plus } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 select-none z-20 no-print">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-2.5 border-b border-neutral-100">
        <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
          CV
        </div>
        <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-neutral-900">
          Make<span className="text-neutral-500 font-medium">CV</span>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="p-4">
        <button
          onClick={() => navigate('/builder')}
          className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Resume</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`
          }
        >
          <FolderGit2 className="w-4 h-4" />
          <span>My Resumes</span>
        </NavLink>

        <NavLink
          to="/builder"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`
          }
        >
          <FileText className="w-4 h-4" />
          <span>Resume Builder</span>
        </NavLink>

        <div className="pt-2 pb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          Explore
        </div>

        <NavLink
          to="/templates"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`
          }
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Templates Gallery</span>
          <span className="ml-auto text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-500 px-1.5 py-0.5 rounded font-mono">
            5
          </span>
        </NavLink>
      </nav>
    </aside>
  );
};
