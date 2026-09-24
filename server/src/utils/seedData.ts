import { User } from '../models/User';
import { Resume } from '../models/Resume';

export const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Already initialized
    }

    console.log('Seeding initial demo data...');

    // Create default demo user with strong password
    const demoUser = new User({
      name: 'Elena Vance',
      email: 'demo@makecv.com',
      password: 'Password@2026!',
      role: 'Talent Lead',
      avatarInitials: 'EV',
    });

    await demoUser.save();

    // Sample resumes
    const sampleResumes = [
      {
        userId: demoUser._id,
        title: 'Senior Software Engineer',
        targetRole: 'Senior Software Engineer',
        format: 'DOCX',
        personalDetails: {
          fullName: 'Alex Morgan',
          email: 'alex.morgan@techcloud.io',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/alexmorgan-dev',
          github: 'github.com/alexmorgan-code',
          portfolio: 'alexmorgan.dev',
        },
        education: [
          {
            institution: 'University of California, Berkeley',
            degree: 'Master of Science, Computer Science',
            startDate: 'Aug 2020',
            endDate: 'May 2022',
            gpa: '3.94 / 4.00',
            coursework: 'Distributed Systems, Cloud Computing, Database Architectures',
          },
          {
            institution: 'University of Washington',
            degree: 'Bachelor of Science, Computer Engineering',
            startDate: 'Sep 2016',
            endDate: 'Jun 2020',
            gpa: '3.88 / 4.00',
            coursework: 'Data Structures, Operating Systems, Computer Networks',
          },
        ],
        experience: [
          {
            company: 'Nexus Cloud Technologies',
            role: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: 'Jun 2022',
            endDate: 'Present',
            current: true,
            bullets: [
              'Architected high-throughput microservices handling over 50M daily API events with 99.99% uptime.',
              'Spearheaded migration of legacy monolithic system to containerized Docker & Kubernetes infrastructure.',
              'Implemented real-time data sync pipeline with Kafka and Redis caching, cutting latency by 45%.',
            ],
          },
          {
            company: 'Quantum Byte Labs',
            role: 'Full Stack Software Engineer',
            location: 'Seattle, WA',
            startDate: 'Jul 2020',
            endDate: 'May 2022',
            current: false,
            bullets: [
              'Built dynamic customer dashboard with React, TypeScript, and Node.js microservices.',
              'Designed robust REST APIs and GraphQL interfaces with comprehensive unit and integration test suites.',
            ],
          },
        ],
        skills: ['Python', 'TypeScript', 'Node.js', 'Docker', 'Kubernetes', 'AWS', 'MongoDB'],
        template: 'Standard Executive',
        downloadsCount: 14,
        lastEditedBy: demoUser.name,
      },
      {
        userId: demoUser._id,
        title: 'Staff Infrastructure Engineer',
        targetRole: 'Staff Infrastructure Engineer',
        format: 'DOCX',
        personalDetails: {
          fullName: 'Elena Rostova',
          email: 'elena.rostova@techfrontier.io',
          phone: '+1 (555) 789-0123',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/elenarostova',
          github: 'github.com/elena-rostova',
          portfolio: 'elenarostova.io',
        },
        education: [
          {
            institution: 'Georgia Institute of Technology',
            degree: 'Master of Science, Cybersecurity & Networks',
            startDate: 'Sep 2017',
            endDate: 'Jun 2019',
            gpa: '3.90 / 4.00',
            coursework: 'Cloud Security, Site Reliability Engineering, Network Protocols',
          },
        ],
        experience: [
          {
            company: 'TechFrontier Infrastructure',
            role: 'Staff Infrastructure Engineer',
            location: 'New York, NY',
            startDate: 'Aug 2021',
            endDate: 'Present',
            current: true,
            bullets: [
              'Designed and maintained multi-region cloud infrastructure on AWS and GCP using Terraform.',
              'Maintained 99.999% SLA across multi-cluster Kubernetes deployments serving 10M+ users.',
            ],
          },
        ],
        skills: ['Go', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Prometheus'],
        template: 'Standard Executive',
        downloadsCount: 8,
        lastEditedBy: demoUser.name,
      },
      {
        userId: demoUser._id,
        title: 'Lead AI Research Scientist',
        targetRole: 'Lead AI Research Scientist',
        format: 'DOCX',
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
            coursework: 'Distributed Systems, Deep Learning, Analysis of Algorithms, Database Systems',
          },
          {
            institution: 'University of Washington',
            degree: 'Bachelor of Science, Software Engineering',
            startDate: 'Sep 2018',
            endDate: 'Jun 2022',
            gpa: '3.86 / 4.00',
            coursework: 'Data Structures, Operating Systems, Web Technologies, Computer Networks',
          },
        ],
        experience: [
          {
            company: 'Apex Neural Technologies',
            role: 'Lead AI Research Scientist',
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
        skills: ['PyTorch', 'LLMs', 'CUDA', 'Python', 'Computer Vision', 'Deep Learning'],
        template: 'Standard Executive',
        downloadsCount: 22,
        lastEditedBy: demoUser.name,
      },
      {
        userId: demoUser._id,
        title: 'Design Systems Architect',
        targetRole: 'Design Systems Architect',
        format: 'DOCX',
        personalDetails: {
          fullName: 'Sophia Taylor',
          email: 'staylor.design@gmail.com',
          phone: '+1 (555) 345-6789',
          location: 'Austin, TX',
          linkedin: 'linkedin.com/in/sophiataylor-design',
          github: 'github.com/sophiataylor',
          portfolio: 'sophiataylor.design',
        },
        education: [
          {
            institution: 'Rhode Island School of Design',
            degree: 'Bachelor of Fine Arts, Graphic & Interaction Design',
            startDate: 'Aug 2016',
            endDate: 'May 2020',
            gpa: '3.91 / 4.00',
          },
        ],
        experience: [
          {
            company: 'Aura Interactive',
            role: 'Design Systems Architect',
            location: 'Austin, TX',
            startDate: 'Jan 2022',
            endDate: 'Present',
            current: true,
            bullets: [
              'Created and scaled an accessible enterprise design system used by 50+ engineering teams.',
              'Standardized Figma components and React Tailwind tokens with automated token synchronization.',
            ],
          },
        ],
        skills: ['TypeScript', 'Tailwind', 'Figma', 'React', 'Accessibility', 'CSS Architecture'],
        template: 'Standard Executive',
        downloadsCount: 5,
        lastEditedBy: demoUser.name,
      },
      {
        userId: demoUser._id,
        title: 'Full Stack Developer',
        targetRole: 'Full Stack Developer',
        format: 'DOCX',
        personalDetails: {
          fullName: 'David Patel',
          email: 'david.patel.swe@outlook.com',
          phone: '+1 (555) 678-9012',
          location: 'Chicago, IL',
          linkedin: 'linkedin.com/in/davidpatel-swe',
          github: 'github.com/davidpatel-swe',
          portfolio: 'davidpatel.dev',
        },
        education: [
          {
            institution: 'University of Illinois Urbana-Champaign',
            degree: 'Bachelor of Science, Computer Science',
            startDate: 'Aug 2019',
            endDate: 'May 2023',
            gpa: '3.82 / 4.00',
          },
        ],
        experience: [
          {
            company: 'Apex Horizon Labs',
            role: 'Full Stack Developer',
            location: 'Chicago, IL',
            startDate: 'Jun 2023',
            endDate: 'Present',
            current: true,
            bullets: [
              'Built responsive customer dashboards using Next.js 14, React, and PostgreSQL.',
              'Integrated Stripe payments and automated PDF invoice generation for 10k monthly orders.',
            ],
          },
        ],
        skills: ['Node.js', 'PostgreSQL', 'Next.js', 'React', 'TypeScript', 'GraphQL'],
        template: 'Standard Executive',
        downloadsCount: 11,
        lastEditedBy: demoUser.name,
      },
    ];

    await Resume.insertMany(sampleResumes);
    console.log('Seeded demo user and 5 sample resumes successfully.');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};
