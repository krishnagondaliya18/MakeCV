export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

export interface IPersonalDetails {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
}

export interface ICustomSection {
  id?: string;
  title: string;
  items: string[];
}

export interface IEducation {
  id?: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  coursework?: string;
}

export interface IExperience {
  id?: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ISkillCategory {
  id?: string;
  category: string;
  skills: string[];
}

export interface IResume {
  _id: string;
  userId: string;
  title: string;
  targetRole: string;
  format: string;
  personalDetails: IPersonalDetails;
  education: IEducation[];
  experience: IExperience[];
  skills: string[];
  skillCategories?: ISkillCategory[];
  customSections?: ICustomSection[];
  template: string;
  downloadsCount: number;
  lastEditedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IResumeStats {
  totalResumes: number;
  totalDownloads: number;
  lastModified: {
    title: string;
    fullName: string;
    updatedAt: string;
  } | null;
  storageUsed: number;
  storageLimit: number;
}

export interface IPasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number; // 0 to 4
  strengthLabel: 'Too Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
}
