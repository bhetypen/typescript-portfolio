export interface EducationItem {
    degree: string;
    institution: string;
    duration: string;
    location: string;
    description?: string[];
}

export const education: EducationItem[] = [
    {
        degree: "Zuitt Tech Career Program (Coding School)",
        institution: "Zuitt Philippines (Remote)",
        duration: "June 2025 - October 2025",
        location: "Quezon City / Remote",
        description: [
            "Intensive fullstack bootcamp with practical projects (MongoDB, Express, Vue.js , Node).",
            "Focus on teamwork and agile methodologies."
        ]
    },
    {
        degree: "Junior Developer",
        institution: "BFI Coders Bay Linz",
        duration: "September 2024 - April 2025",
        location: "Linz, Austria",
        description: [
            "Developed a JavaFX desktop application with JDBC + Oracle Database",
            "Built Java exercises/projects such as personnel management",
            "Practiced web technologies (HTML, CSS, JS, PHP) and created a full-stack projects with React, Node.js, PostgreSQL"
        ]
    },

    {
        degree: "Frontend Developer",
        institution: "Uplift Code Camp",
        duration: "June 2024 - September 2024",
        location: "Remote",
        description: [
            "Deep dive into modern frontend technologies (React, responsive design, UI/UX, Wireframing, Trello, Figma/Canva, Git Workflows)."
        ]
    },
    {
        degree: "Responsive Web Design (Certificate)",
        institution: "freeCodeCamp",
        duration: "Jan 2024",
        location: "Online",
        description: ["HTML, CSS, Flexbox, Grid, Accessibility."]
    },
    {
        degree: "Mechanical Engineering Technology",
        institution: "BFI Metallzentrum Attnang",
        duration: "August 2021 - June 2023",
        location: "Attnang, Austria",
        description: [
            "Fundamentals of metalworking, CNC, PLC, CAD (SolidWorks/AutoCAD)",
            "Without LAP"
        ]
    },
    {
        degree: "Diploma in Instrumentation & Control Engineering Technology: Electronics",
        institution: "Technological University of the Philippines",
        duration: "June 2000 - June 2023",
        location: "Manila, Philippines",
        description: [
            "C++, PLC Programming, Integral and Differential Calculus ...",
            "Assessed by ENIC NARIC Austria as equivalent to a technical college – specialization in control engineering."
        ]
    },

];
