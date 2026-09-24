import { Router, Response } from 'express';
import { Resume, IResume } from '../models/Resume';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { generateDocxResume } from '../utils/docxGenerator';

const router = Router();

// Apply auth middleware to all resume routes
router.use(authenticateToken);

// @route   GET /api/resumes/stats
// @desc    Get dashboard metrics (total resumes, downloads, last modified)
router.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

    const totalResumes = resumes.length;
    const totalDownloads = resumes.reduce((acc, r) => acc + (r.downloadsCount || 0), 0);
    const lastModified = resumes.length > 0 ? resumes[0] : null;

    res.json({
      totalResumes,
      totalDownloads,
      lastModified: lastModified
        ? {
            title: lastModified.title,
            fullName: lastModified.personalDetails?.fullName || lastModified.title,
            updatedAt: lastModified.updatedAt,
          }
        : null,
      storageUsed: totalResumes,
      storageLimit: 20,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching resume stats' });
  }
});

// @route   GET /api/resumes
// @desc    Get all resumes with optional search and role filtering
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { search, role } = req.query;

    const filter: any = { userId };

    if (role && role !== 'All Roles') {
      filter.targetRole = new RegExp(role as string, 'i');
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { title: searchRegex },
        { targetRole: searchRegex },
        { 'personalDetails.fullName': searchRegex },
        { 'personalDetails.email': searchRegex },
        { skills: searchRegex },
      ];
    }

    const resumes = await Resume.find(filter).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching resumes' });
  }
});

// @route   GET /api/resumes/:id
// @desc    Get single resume
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const resume = await Resume.findOne({ _id: req.params.id, userId });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json(resume);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching resume' });
  }
});

// @route   POST /api/resumes
// @desc    Create a new resume
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const {
      title,
      targetRole,
      personalDetails,
      education,
      experience,
      skills,
      skillCategories,
      customSections,
      template,
    } = req.body;

    if (!personalDetails?.fullName || !personalDetails?.email) {
      res.status(400).json({ message: 'Full name and email are required in personal details.' });
      return;
    }

    const resume = new Resume({
      userId,
      title: title || targetRole || personalDetails.fullName,
      targetRole: targetRole || 'Software Professional',
      format: 'DOCX',
      personalDetails,
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      skillCategories: skillCategories || [],
      customSections: customSections || [],
      template: template || 'Standard Executive',
      downloadsCount: 0,
      lastEditedBy: req.user?.name || 'You',
    });

    const savedResume = await resume.save();
    res.status(201).json(savedResume);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating resume' });
  }
});

// @route   PUT /api/resumes/:id
// @desc    Update existing resume
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const resume = await Resume.findOne({ _id: req.params.id, userId });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    const {
      title,
      targetRole,
      personalDetails,
      education,
      experience,
      skills,
      skillCategories,
      customSections,
      template,
    } = req.body;

    if (title !== undefined) resume.title = title;
    if (targetRole !== undefined) resume.targetRole = targetRole;
    if (personalDetails !== undefined) resume.personalDetails = personalDetails;
    if (education !== undefined) resume.education = education;
    if (experience !== undefined) resume.experience = experience;
    if (skills !== undefined) resume.skills = skills;
    if (skillCategories !== undefined) resume.skillCategories = skillCategories;
    if (customSections !== undefined) resume.customSections = customSections;
    if (template !== undefined) resume.template = template;
    resume.lastEditedBy = req.user?.name || 'You';

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating resume' });
  }
});

// @route   DELETE /api/resumes/:id
// @desc    Delete single resume
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json({ message: 'Resume deleted successfully', id: req.params.id });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting resume' });
  }
});

// @route   POST /api/resumes/bulk-delete
// @desc    Delete multiple resumes
router.post('/bulk-delete', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ message: 'Please provide an array of IDs to delete.' });
      return;
    }

    const result = await Resume.deleteMany({ _id: { $in: ids }, userId });
    res.json({ message: `Successfully deleted ${result.deletedCount} resumes`, deletedCount: result.deletedCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error performing bulk delete' });
  }
});

// @route   GET /api/resumes/:id/export/docx
// @desc    Generate and download DOCX binary
router.get('/:id/export/docx', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const resume = await Resume.findOne({ _id: req.params.id, userId });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    // Increment download count
    resume.downloadsCount = (resume.downloadsCount || 0) + 1;
    await resume.save();

    const docxBuffer = await generateDocxResume(resume);

    const safeName = (resume.personalDetails.fullName || 'Resume')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeName}_Resume.docx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(docxBuffer);
  } catch (error: any) {
    console.error('DOCX export error:', error);
    res.status(500).json({ message: error.message || 'Error generating DOCX resume' });
  }
});

// @route   POST /api/resumes/:id/increment-download
// @desc    Increment download count (e.g. on client-side export)
router.post('/:id/increment-download', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const resume = await Resume.findOne({ _id: req.params.id, userId });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    resume.downloadsCount = (resume.downloadsCount || 0) + 1;
    await resume.save();

    res.json({ downloadsCount: resume.downloadsCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating download count' });
  }
});

export default router;
