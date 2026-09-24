import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Plus,
  Download,
  Trash2,
  Edit3,
  Eye,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import {
  fetchResumes,
  fetchResumeStats,
  deleteResume,
  bulkDeleteResumes,
  incrementDownload,
} from '../store/resumeSlice';
import { IResume } from '../types';
import { exportResumeToDocx } from '../services/docxExport';
import { DeleteModal } from '../components/DeleteModal';
import { PreviewModal } from '../components/PreviewModal';

export const ResumesListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { resumes, stats, loading } = useSelector((state: RootState) => state.resumes);

  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<IResume | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [previewResume, setPreviewResume] = useState<IResume | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchResumes());
    dispatch(fetchResumeStats());
  }, [dispatch]);

  // Unique roles for dropdown filter
  const availableRoles = useMemo(() => {
    const roles = new Set<string>();
    resumes.forEach((r) => {
      if (r.targetRole) roles.add(r.targetRole);
    });
    return ['All Roles', ...Array.from(roles)];
  }, [resumes]);

  // Filtered resumes
  const filteredResumes = useMemo(() => {
    return resumes.filter((item) => {
      const matchesRole = selectedRole === 'All Roles' || item.targetRole === selectedRole;
      const matchesFormat = selectedFormat === 'All Formats' || item.format === selectedFormat;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.targetRole?.toLowerCase().includes(q) ||
        item.personalDetails?.fullName?.toLowerCase().includes(q) ||
        item.personalDetails?.email?.toLowerCase().includes(q) ||
        item.skills?.some((s) => s.toLowerCase().includes(q));

      return matchesRole && matchesFormat && matchesSearch;
    });
  }, [resumes, selectedRole, selectedFormat, search]);

  // Pagination
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResumes.slice(start, start + itemsPerPage);
  }, [filteredResumes, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredResumes.map((r) => r._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Download DOCX
  const handleDownload = async (resume: IResume) => {
    await exportResumeToDocx(resume);
    dispatch(incrementDownload(resume._id));
  };

  // Bulk Download
  const handleBulkDownload = async () => {
    const toDownload = resumes.filter((r) => selectedIds.includes(r._id));
    for (const res of toDownload) {
      await exportResumeToDocx(res);
      dispatch(incrementDownload(res._id));
    }
  };

  // Delete handlers
  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    await dispatch(deleteResume(deleteTarget._id));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget._id));
    dispatch(fetchResumeStats());
    setActionLoading(false);
    setDeleteTarget(null);
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    await dispatch(bulkDeleteResumes(selectedIds));
    setSelectedIds([]);
    dispatch(fetchResumeStats());
    setActionLoading(false);
    setIsBulkDeleteOpen(false);
  };

  const formatLastEdited = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      if (isToday) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return date.toLocaleDateString([], { month: 'short', day: '2-digit' }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CV';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            WORKSPACE / My Resumes
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
            My Resumes
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage, edit, and download your resumes in DOCX format.
          </p>
        </div>

        {/* 3 Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 min-w-[140px] shadow-xs">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              TOTAL RESUMES
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {stats?.totalResumes ?? resumes.length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">All active files</div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 min-w-[140px] shadow-xs">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              DOWNLOADED
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {stats?.totalDownloads ?? 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">DOCX exports</div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 min-w-[160px] shadow-xs">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              LAST MODIFIED
            </div>
            <div className="text-sm font-bold text-neutral-900 mt-1 truncate">
              {stats?.lastModified?.updatedAt
                ? formatLastEdited(stats.lastModified.updatedAt)
                : 'Just now'}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
              {stats?.lastModified?.fullName || 'MakeCV System'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, or skill..."
            className="w-full pl-9 pr-10 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-2.5 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-200 rounded border border-neutral-300">
            ⌘K
          </kbd>
        </div>

        {/* Roles Dropdown */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          aria-label="Filter by target role"
          className="px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
        >
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Formats Dropdown */}
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          aria-label="Filter by format"
          className="px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
        >
          <option value="All Formats">All Formats</option>
          <option value="DOCX">DOCX</option>
          <option value="PDF">PDF</option>
        </select>

        {/* Add Resume Button */}
        <button
          onClick={() => navigate('/builder')}
          className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white font-medium px-4 py-2 rounded-lg transition shadow-xs cursor-pointer text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resume</span>
        </button>
      </div>

      {/* Bulk Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 px-1">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={
                filteredResumes.length > 0 && selectedIds.length === filteredResumes.length
              }
              onChange={handleSelectAll}
              className="rounded border-neutral-300 text-neutral-900 focus:ring-black cursor-pointer"
            />
            <span className="font-medium">
              Select All ({selectedIds.length} selected)
            </span>
          </label>

          {selectedIds.length > 0 && (
            <>
              <span className="text-neutral-300">|</span>
              <button
                onClick={handleBulkDownload}
                className="flex items-center gap-1.5 text-neutral-700 hover:text-black font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All (.DOCX)</span>
              </button>
              <button
                onClick={() => setIsBulkDeleteOpen(true)}
                className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </>
          )}
        </div>

        {/* Quick Export Indicators */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Quick Export:</span>
          <button
            onClick={() => {
              if (resumes.length > 0) handleDownload(resumes[0]);
              else alert('No resumes available to export');
            }}
            className="px-2 py-0.5 rounded border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 cursor-pointer shadow-2xs"
          >
            .DOCX
          </button>
          <button
            onClick={() => {
              if (resumes.length > 0) setPreviewResume(resumes[0]);
              else alert('No resumes available to export');
            }}
            className="px-2 py-0.5 rounded border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 cursor-pointer shadow-2xs"
          >
            .PDF
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 w-10">
                  <span className="sr-only">Select</span>
                </th>
                <th className="py-3.5 px-4">TITLE / TARGET ROLE</th>
                <th className="py-3.5 px-4">KEY SKILLS</th>
                <th className="py-3.5 px-4">FORMAT</th>
                <th className="py-3.5 px-4">LAST EDITED</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-neutral-500" />
                    Loading resumes...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <div className="max-w-xs mx-auto">
                      <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                      <p className="font-semibold text-neutral-700">No resumes found</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Try modifying your search or click "+ Add Resume" to create your first resume.
                      </p>
                      <button
                        onClick={() => navigate('/builder')}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create New Resume</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const isChecked = selectedIds.includes(item._id);
                  const fullName = item.personalDetails?.fullName || item.title;
                  const initials = getInitials(fullName);

                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-neutral-50/70 transition-colors ${
                        isChecked ? 'bg-neutral-50/80' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(item._id)}
                          className="rounded border-neutral-300 text-neutral-900 focus:ring-black cursor-pointer"
                        />
                      </td>

                      {/* Title & Target Role */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0 tracking-wider">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900 text-sm">{fullName}</div>
                            <div className="text-neutral-500 font-medium text-xs">
                              {item.targetRole || item.title}
                            </div>
                            <div className="text-neutral-400 font-mono text-[11px]">
                              {item.personalDetails?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Key Skills */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {item.skills && item.skills.length > 0 ? (
                            item.skills.slice(0, 4).map((sk, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700 text-[11px] font-medium"
                              >
                                {sk}
                              </span>
                            ))
                          ) : (
                            <span className="text-neutral-400 italic text-[11px]">None listed</span>
                          )}
                          {item.skills && item.skills.length > 4 && (
                            <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 text-[10px] font-mono">
                              +{item.skills.length - 4}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Format */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-100 border border-neutral-200 text-[11px] font-mono font-semibold text-neutral-700">
                          <FileText className="w-3 h-3 text-neutral-500" />
                          <span>{item.format || 'DOCX'}</span>
                        </div>
                      </td>

                      {/* Last Edited */}
                      <td className="py-4 px-4">
                        <div className="text-neutral-900 font-semibold text-xs">
                          {formatLastEdited(item.updatedAt)}
                        </div>
                        <div className="text-neutral-400 text-[11px]">
                          Edited by {item.lastEditedBy || 'you'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1 text-neutral-500">
                          <button
                            onClick={() => handleDownload(item)}
                            title="Download DOCX"
                            className="p-1.5 hover:text-black hover:bg-neutral-200/60 rounded-md transition cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/builder?id=${item._id}`)}
                            title="Edit Resume"
                            className="p-1.5 hover:text-black hover:bg-neutral-200/60 rounded-md transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPreviewResume(item)}
                            title="Preview Resume"
                            className="p-1.5 hover:text-black hover:bg-neutral-200/60 rounded-md transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            title="Delete Resume"
                            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200 text-xs text-neutral-500 bg-neutral-50/50">
          <div>
            Showing <span className="font-semibold text-neutral-800">{filteredResumes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredResumes.length)}</span> of <span className="font-semibold text-neutral-800">{filteredResumes.length}</span> resumes
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded text-xs font-semibold transition cursor-pointer ${
                  currentPage === idx + 1
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modals */}
      <DeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.personalDetails?.fullName || deleteTarget?.title}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmSingleDelete}
        loading={actionLoading}
      />

      <DeleteModal
        isOpen={isBulkDeleteOpen}
        count={selectedIds.length}
        onCancel={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        loading={actionLoading}
      />

      {/* Full Preview Modal */}
      <PreviewModal
        isOpen={!!previewResume}
        resume={previewResume}
        onClose={() => setPreviewResume(null)}
      />
    </div>
  );
};
