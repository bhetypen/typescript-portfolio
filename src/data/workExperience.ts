export interface WorkItem {
    role: string;
    company: string;
    duration: string;
    location: string;
    description?: string[];
    tags?: string[];
}

export const workExperience: WorkItem[] = [
    {
        role: "Junior Software Developer (Trainee)",
        company: "BFI Coders Bay Linz",
        duration: "Sep 2024 – Apr 2025",
        location: "Linz, Austria",
        description: [
            "Software developer training focused on Java, SQL, web development, and software engineering.",
            "Final project with a real-world application scenario."
        ],
        tags: ["Java", "SQL", "React", "Software Engineering"]
    },
    {
        role: "Maintenance Technician",
        company: "Energie AG Umweltservice, MVA Wels",
        duration: "Sep 2023 – May 2024",
        location: "Wels, Austria",
        description: [
            "Maintenance, troubleshooting, and technical supervision of systems."
        ],
        tags: ["Maintenance", "Troubleshooting"]
    },
    {
        role: "Parental Leave & Continuing Education",
        company: "—",
        duration: "Oct 2011 – Sep 2021",
        location: "Austria",
        description: [
            "Childcare & family management.",
            "Preparatory course at Vorstudienlehrgang Linz – German and academic prep."
        ]
    },
    {
        role: "Web Content Assistant (Freelance)",
        company: "Remote",
        duration: "Sep 2009 – Sep 2011",
        location: "Remote",
        description: [
            "Maintained and updated websites (WordPress, Joomla).",
            "Managed product information and databases."
        ]
    },
    {
        role: "Process Technician",
        company: "Philips Semiconductor / Advanced Semiconductors Eng Taiwan",
        duration: "Jun 2003 – Sep 2009",
        location: "Philippines & Taiwan",
        description: [
            "Production monitoring, quality control, failure analysis, and maintenance."
        ]
    }
];
