import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  coursework?: string;
}

export interface IExperience {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  bullets: string[];
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
  title: string;
  items: string[];
}

export interface ISkillCategory {
  category: string;
  skills: string[];
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  targetRole: string;
  format: string;
  personalDetails: IPersonalDetails;
  education: IEducation[];
  experience: IExperience[];
  skills: string[];
  skillCategories: ISkillCategory[];
  customSections: ICustomSection[];
  template: string;
  downloadsCount: number;
  lastEditedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a resume title or target role'],
      trim: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Please specify target role'],
      trim: true,
    },
    format: {
      type: String,
      default: 'DOCX',
    },
    personalDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        gpa: { type: String, default: '' },
        coursework: { type: String, default: '' },
      },
    ],
    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        current: { type: Boolean, default: false },
        bullets: [{ type: String }],
      },
    ],
    skills: [{ type: String }],
    skillCategories: [
      {
        category: { type: String, default: '' },
        skills: [{ type: String }],
      },
    ],
    customSections: [
      {
        title: { type: String, required: true },
        items: [{ type: String }],
      },
    ],
    template: {
      type: String,
      default: 'Standard Executive',
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    lastEditedBy: {
      type: String,
      default: 'You',
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
