import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';
import { IResume } from '../types';

export const exportResumeToDocx = async (resume: Partial<IResume>): Promise<void> => {
  const personalDetails = resume.personalDetails || {
    fullName: 'MARCUS CHEN',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
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

  const contactParts: string[] = [];
  if (personalDetails.location) contactParts.push(personalDetails.location);
  if (personalDetails.phone) contactParts.push(personalDetails.phone);
  if (personalDetails.email) contactParts.push(personalDetails.email);

  const linksParts: string[] = [];
  if (personalDetails.linkedin) linksParts.push(personalDetails.linkedin);
  if (personalDetails.github) linksParts.push(personalDetails.github);
  if (personalDetails.portfolio) linksParts.push(personalDetails.portfolio);

  const children: any[] = [];

  // 1. Header: Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: (personalDetails.fullName || 'YOUR NAME').toUpperCase(),
          bold: true,
          size: 38,
          font: 'Arial',
        }),
      ],
    })
  );

  // Contact line
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 19,
            font: 'Arial',
            color: '333333',
          }),
        ],
      })
    );
  }

  // Links line
  if (linksParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: linksParts.join('  •  '),
            size: 19,
            font: 'Arial',
            color: '0066CC',
          }),
        ],
      })
    );
  }

  const createSectionHeader = (title: string) => {
    return new Paragraph({
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          color: '999999',
          space: 3,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22,
          font: 'Arial',
          color: '111111',
        }),
      ],
    });
  };

  // Summary Section
  if (personalDetails.summary) {
    children.push(createSectionHeader('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: personalDetails.summary,
            size: 20,
            font: 'Arial',
            color: '333333',
          }),
        ],
      })
    );
  }

  // 2. EDUCATION Section
  if (education.length > 0) {
    children.push(createSectionHeader('Education'));

    for (const edu of education) {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: edu.institution,
                          bold: true,
                          size: 20,
                          font: 'Arial',
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({
                          text: [edu.startDate, edu.endDate].filter(Boolean).join(' - '),
                          size: 19,
                          font: 'Arial',
                          color: '444444',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: edu.degree,
                          italics: true,
                          size: 19,
                          font: 'Arial',
                          color: '333333',
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({
                          text: edu.gpa ? `GPA: ${edu.gpa}` : '',
                          size: 19,
                          font: 'Arial',
                          color: '444444',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );

      if (edu.coursework) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 100 },
            children: [
              new TextRun({
                text: 'Relevant Coursework: ',
                bold: true,
                size: 18,
                font: 'Arial',
                color: '444444',
              }),
              new TextRun({
                text: edu.coursework,
                size: 18,
                font: 'Arial',
                color: '444444',
              }),
            ],
          })
        );
      }
    }
  }

  // 3. EXPERIENCE Section
  if (experience.length > 0) {
    children.push(createSectionHeader('Experience'));

    for (const exp of experience) {
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: exp.company,
                          bold: true,
                          size: 20,
                          font: 'Arial',
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({
                          text: [exp.startDate, exp.current ? 'Present' : exp.endDate]
                            .filter(Boolean)
                            .join(' - '),
                          size: 19,
                          font: 'Arial',
                          color: '444444',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: exp.role,
                          italics: true,
                          size: 19,
                          font: 'Arial',
                          color: '333333',
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({
                          text: exp.location || '',
                          size: 19,
                          font: 'Arial',
                          color: '555555',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );

      if (exp.bullets && exp.bullets.length > 0) {
        for (const bullet of exp.bullets) {
          if (!bullet.trim()) continue;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 30, after: 30 },
              children: [
                new TextRun({
                  text: bullet.trim(),
                  size: 19,
                  font: 'Arial',
                  color: '222222',
                }),
              ],
            })
          );
        }
      }
    }
  }

  // 4. SKILLS Section
  if (hasCategorizedSkills) {
    children.push(createSectionHeader('Key Skills'));
    for (const cat of skillCategories) {
      if (!cat.category && (!cat.skills || cat.skills.length === 0)) continue;
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: `${cat.category}: `,
              bold: true,
              size: 20,
              font: 'Arial',
              color: '111111',
            }),
            new TextRun({
              text: cat.skills.join(', '),
              size: 20,
              font: 'Arial',
              color: '333333',
            }),
          ],
        })
      );
    }
  } else if (skills.length > 0) {
    children.push(createSectionHeader('Key Skills'));
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: skills.join('  •  '),
            size: 20,
            font: 'Arial',
            color: '222222',
          }),
        ],
      })
    );
  }

  // 5. CUSTOM SECTIONS
  for (const section of customSections) {
    if (section.title) {
      children.push(createSectionHeader(section.title));
      for (const item of section.items) {
        if (!item.trim()) continue;
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({
                text: item.trim(),
                size: 19,
                font: 'Arial',
                color: '222222',
              }),
            ],
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (personalDetails.fullName || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  saveAs(blob, `${safeName}_Resume.docx`);
};
