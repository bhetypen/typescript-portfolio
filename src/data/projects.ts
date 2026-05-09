// src/data/projects.ts

export type Project = {
    title: string;
    description: string;
    tags: string[];
    links?: {
        demo?: string;
        github?: string;
    };
    thumbnail?: string;
};

export const fullstackProjects: Project[] = [
    {
        title: "MineBuddy — FB Live Order Management",
        description:
            "An order management platform for Filipino Facebook Live sellers, handling the full 'mine!' claim workflow from livestream to delivery. Features a 10-state order lifecycle, hybrid inventory splitting, JWT auth with refresh token rotation, Flyway migrations, real-time KPI dashboard, and capital tracking for profit insights. Self-hosted on a hardened Ubuntu VPS with Docker, Caddy auto-HTTPS, and automated daily backups.",
        tags: ["Java 21", "Spring Boot", "Angular 19", "MariaDB", "Docker", "Caddy", "Flyway", "JWT", "TailwindCSS", "VPS Linux Deployment"],
        links: {
            demo: "https://minebuddy.store",
            github: "https://github.com/bhetypen/minebuddy-backend",
        },
        thumbnail: "/images/minebuddy.png",
    },

    {
        title: "LocalMarktPlatz+ (On Development)",
        description:
            "A marketplace for local events featuring interactive stall maps, vendor applications with approvals, realtime chat/notifications, a product catalog, invoicing (PDF + QR), and public landing pages.",
        tags: ["Next.js", "React", "Node.js", "Express","Postgre", "Material UI", "TailwindCSS",  "Typescript", "SQL"],
        links: {
            demo: "https://www.loom.com/share/3cec4809cead4dce8294da9fce138573",
            github: "https://gitlab.com/personal-project3992315/local_marktplatz-plus",
        },
        thumbnail: "/images/marketplace.png",
    },
    {
        title: "Linz Souvenir Shop E-Commerce",
        description:
            "Linz Souvenir is a clean, responsive e-commerce site showcasing locally inspired gifts, featuring intuitive browsing, product details, and a smooth cart experience.",
        tags: ["Vue.js", "MongoDB", "Bootstrap", "Node.js", "Express", "Docker", "Caddy"],
        links: {
            demo: "https://linzsouvenir.bhetyhub.com/",
            github: "https://github.com/bhetypen/linzsouvenir-app",
        },
        thumbnail: "/images/ecommerce.png",
    },
    {
        title: "Community Blog Platform",
        description:
            "A collaborative blog site where anyone can post articles, featuring an admin dashboard for management, a user dashboard with profile controls, and a built-in markdown editor for creating rich content. Designed with responsive UI and smooth navigation for an open publishing experience.",
        tags: ["React.js", "MongoDB", "Bootstrap", "Node.js", "Express", "Docker", "Caddy", "VPS Linux Deployment"],
        links: {
            demo: "https://blog-frontend-sandy-nine.vercel.app/",
            github: "https://github.com/bhetypen/blog-client",
        },
        thumbnail: "/images/blogger1.png",
    }
];

export const frontendProjects: Project[] = [
    {
        title: "Quize — Interactive Quiz",
        description:
            "Quize is a fun, responsive quiz game that pulls questions from a public API, offering multiple categories and instant feedback for an engaging experience across devices.",
        tags: ["HTML", "CSS", "Javascript"],
        links: {
            demo: "https://quize.bhetycodes.com/",
        },
        thumbnail: "/images/quiz.png",
    },
    {
        title: "Landing Page",
        description:
            "Wanderly Travel is a responsive landing page for a travel booking website, built with HTML, CSS to showcase destinations with a clean, modern design. Note: no functions just a frontend showcase.",
        tags: ["HTML", "CSS", "Canva"],
        links: {
            demo: "https://codersbay-html-css-3.bhetycodeport.tech/"
        },
        thumbnail: "/images/wanderly-site.png",
    },
    {
        title: "NoCodeWebsiteBuilder",
        description:
            "NoCode Website Builder is a simple, responsive platform that allows users to create websites from prebuilt templates by customizing text and images. The layout is fixed, ensuring clean design consistency while making website creation quick and code-free.",
        tags: ["React", "Redux", "Tailwind", "IndexDB"],
        links: {
            demo: "https://nocodewebsitebuilder.bhetycodeport.tech/",
        },
        thumbnail: "/images/websitebuilder.png",
    },
    {
        title: "BhetyCodes Portfolio (built with Nuxt)",
        description:
            "A modern, dynamic portfolio site built using Nuxt that showcases my projects, skills, and design aesthetics. It demonstrates clean layout, performance optimization, and ease of content management through a server-rendered / statically generated Vue stack.",
        tags: ["Nuxt", "JavaScript", "Tailwind", "shadcn-nuxt"],
        links: {
            demo: "https://bhetycodes.online/",
            github: "https://github.com/bhetypen/nuxt-portfolio",
        },
        thumbnail: "/images/portfolio-nuxt.png",
    },
];
