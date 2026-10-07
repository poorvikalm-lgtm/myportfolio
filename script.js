// ==========================================================================
// PIXEL ART PORTFOLIO - CLIENT INTERACTIONS
// - Theme Toggle with CSS Media Query Sync
// - Vertical Sidebar Mobile Drawer & Keyboard Accessibility
// - Active Scroll Section Highlighting (IntersectionObserver)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNavigation();
    initScrollSpy();
    initAvatarToggle();
    initProjectModals();
    initAIChat();       // AI Chat Bot — simulated personality assistant
});

/**
 * --------------------------------------------------------------------------
 * 1. Night/Day Mode Toggle System
 * --------------------------------------------------------------------------
 */
function initThemeToggle() {
    const desktopToggleBtn = document.getElementById('theme-toggle');
    const mobileToggleBtn = document.getElementById('theme-toggle-mobile');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Retrieve saved user preference
    const savedTheme = localStorage.getItem('theme-preference');

    if (savedTheme) {
        setTheme(savedTheme, false);
    } else {
        // Automatically reflects CSS media query default
        updateToggleDisplay(mediaQuery.matches ? 'dark' : 'light', true);
    }

    // Toggle click handler
    function handleToggleClick() {
        const currentTheme = getCurrentTheme();
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme, true);
    }

    if (desktopToggleBtn) desktopToggleBtn.addEventListener('click', handleToggleClick);
    if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', handleToggleClick);

    // React dynamically to OS / browser preference change
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme-preference')) {
            updateToggleDisplay(e.matches ? 'dark' : 'light', true);
        }
    });

    function getCurrentTheme() {
        const explicitTheme = document.documentElement.getAttribute('data-theme');
        if (explicitTheme) return explicitTheme;
        return mediaQuery.matches ? 'dark' : 'light';
    }

    function setTheme(theme, persist) {
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) {
            localStorage.setItem('theme-preference', theme);
        }
        updateToggleDisplay(theme, false);
    }

    function updateToggleDisplay(theme, isAuto) {
        const isDark = theme === 'dark';
        const iconChar = isDark ? '🌙' : '☀️';
        const labelText = isDark 
            ? (isAuto ? 'NIGHT (AUTO)' : 'NIGHT MODE') 
            : (isAuto ? 'DAY (AUTO)' : 'DAY MODE');

        if (themeIcon) themeIcon.textContent = iconChar;
        if (themeText) themeText.textContent = labelText;

        if (desktopToggleBtn) {
            desktopToggleBtn.setAttribute('title', isDark ? 'Switch to Day Mode' : 'Switch to Night Mode');
        }
        if (mobileToggleBtn) {
            const mobileIcon = mobileToggleBtn.querySelector('.pixel-toggle-icon');
            if (mobileIcon) mobileIcon.textContent = iconChar;
            mobileToggleBtn.setAttribute('title', isDark ? 'Switch to Day Mode' : 'Switch to Night Mode');
        }
    }
}

/**
 * --------------------------------------------------------------------------
 * 2. Mobile Responsive Drawer & Accessibility Controls
 * --------------------------------------------------------------------------
 */
function initMobileNavigation() {
    const sidebar = document.getElementById('sidebar-nav');
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-sidebar');
    const backdrop = document.getElementById('nav-backdrop');
    const navLinks = document.querySelectorAll('.pixel-sidebar-link');

    if (!sidebar || !menuToggle) return;

    function openSidebar() {
        sidebar.classList.add('is-open');
        if (backdrop) backdrop.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    }

    function closeSidebar() {
        sidebar.classList.remove('is-open');
        if (backdrop) backdrop.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        menuToggle.focus();
    }

    menuToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('is-open');
        if (isOpen) closeSidebar();
        else openSidebar();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (backdrop) backdrop.addEventListener('click', closeSidebar);

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
            closeSidebar();
        }
    });

    // Close drawer when a nav link is clicked on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992 && sidebar.classList.contains('is-open')) {
                closeSidebar();
            }
        });
    });
}

/**
 * --------------------------------------------------------------------------
 * 3. Active Section ScrollSpy using IntersectionObserver
 * --------------------------------------------------------------------------
 */
function initScrollSpy() {
    const navLinks = document.querySelectorAll('.pixel-sidebar-link');
    const sections = [];

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                sections.push(targetSection);
            }
        }
    });

    if (!sections.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveLink(id);
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));

    function updateActiveLink(activeId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }
}

/**
 * --------------------------------------------------------------------------
 * 4. Interactive Avatar Switcher (Pixel Art Avatar <-> Real Photo)
 * --------------------------------------------------------------------------
 */
function initAvatarToggle() {
    const toggleBtn = document.getElementById('toggle-avatar-btn');
    const avatarImg = document.getElementById('about-avatar-img');
    const badge = document.getElementById('avatar-mode-badge');

    if (!toggleBtn || !avatarImg) return;

    let isPixel = true;

    toggleBtn.addEventListener('click', () => {
        isPixel = !isPixel;

        if (isPixel) {
            avatarImg.src = 'pixel_avatar.png';
            avatarImg.alt = 'Poorvika LM - Pixel Art Avatar';
            avatarImg.style.imageRendering = 'pixelated';
            if (badge) badge.innerHTML = '<span class="mode-dot"></span> 16-BIT AVATAR';
            toggleBtn.innerHTML = '<span class="btn-icon">🔄</span> SWITCH TO REAL PHOTO';
        } else {
            avatarImg.src = 'profile photo.jpeg';
            avatarImg.alt = 'Poorvika LM - Real Profile Photo';
            avatarImg.style.imageRendering = 'auto';
            if (badge) badge.innerHTML = '<span class="mode-dot"></span> REAL PHOTO';
            toggleBtn.innerHTML = '<span class="btn-icon">🔄</span> SWITCH TO PIXEL AVATAR';
        }
    });
}

/**
 * --------------------------------------------------------------------------
 * 5. Interactive Project Modal & Clickable Thumbnails System
 * 
 * HOW THUMBNAILS CONNECT TO PROJECT DETAILS:
 * - Each thumbnail <button> and details <button> has a `data-project-id` attribute 
 *   (e.g., "project-1", "project-2", "project-3", "project-4").
 * - When a user clicks any thumbnail or details button, this function retrieves
 *   the ID, looks up the corresponding record in `PROJECTS_DATA`, dynamically
 *   populates the modal dialogue fields, and displays the modal window.
 * --------------------------------------------------------------------------
 */
function initProjectModals() {
    // Project detailed records dictionary
    const PROJECTS_DATA = {
        'project-1': {
            title: 'PixArcade Editor v1.2',
            category: 'WEB APP / PIXEL CANVAS TOOL',
            image: 'project1.png',
            overview: 'PixArcade Editor is a specialized 16-bit browser workspace for pixel artists and game developers. It features multi-layered sprite drafting, custom palette generators, Onion Skinning for smooth animations, and zero-latency client-side rendering.',
            techStack: ['TypeScript', 'Canvas API', 'React', 'Web Workers', 'IndexedDB'],
            highlights: [
                'Engineered high-performance Canvas 2D raster engine handling 60 FPS brush strokes without UI lag.',
                'Implemented OffscreenCanvas via Web Workers to offload heavy sprite sheet compilation and GIF export.',
                'Designed intuitive 8-bit retro UI compliant with keyboard shortcuts and undo/redo history trees.'
            ],
            metrics: [
                { val: '60 FPS', label: 'Canvas Rendering' },
                { val: '0ms Lag', label: 'Worker Offloaded' },
                { val: '100%', label: 'Client-Side Export' }
            ],
            demoUrl: '#',
            codeUrl: 'https://github.com'
        },
        'project-2': {
            title: 'Microservices Observability Dashboard',
            category: 'DISTRIBUTED SYSTEM / TELEMETRY',
            image: 'project2.png',
            overview: 'An enterprise cloud telemetry hub monitoring distributed microservices architecture. Provides real-time network topology visualization, automated latency alerts, and live log streaming across high-throughput distributed pipelines.',
            techStack: ['Go', 'Node.js', 'Docker', 'Redis', 'WebSockets', 'Next.js'],
            highlights: [
                'Processed over 45M daily service requests with sub-15ms WebSocket push latency.',
                'Visualized dynamic service mesh dependencies with automated error-boundary detection.',
                'Containerized multi-node testing environments with automated Docker Compose and health check monitors.'
            ],
            metrics: [
                { val: '45M+', label: 'Daily Requests' },
                { val: '<15ms', label: 'Push Latency' },
                { val: '99.98%', label: 'Uptime Monitored' }
            ],
            demoUrl: '#',
            codeUrl: 'https://github.com'
        },
        'project-3': {
            title: 'Dijkstra\'s Algo 16-Bit Dungeon',
            category: 'ALGORITHM ENGINE / GAMIFICATION',
            image: 'project3.png',
            overview: 'A gamified algorithm visualization engine where retro 8-bit RPG heroes solve complex graph theory mazes. Supports Dijkstra\'s Algorithm, A* Heuristic Search, and Breadth-First / Depth-First traversal with step-by-step interactive playback.',
            techStack: ['JavaScript', 'Data Structures', 'Canvas API', 'Priority Queue', 'CSS3'],
            highlights: [
                'Created custom Min-Heap & Priority Queue structures from scratch for lightning-fast graph relaxation.',
                'Visualized weighted graph pathfinding with real-time heuristic cost meters and node visitation logs.',
                'Built interactive maze generation algorithms including Recursive Backtracking and Kruskal\'s Maze.'
            ],
            metrics: [
                { val: '5 Algor', label: 'Engines Built' },
                { val: 'O(V+E)', label: 'Optimized Time' },
                { val: '1000+', label: 'Grid Nodes' }
            ],
            demoUrl: '#',
            codeUrl: 'https://github.com'
        },
        'project-4': {
            title: 'NeoFin High-Speed Trading Hub',
            category: 'FINTECH / REAL-TIME TERMINAL',
            image: 'project4.png',
            overview: 'A modern financial terminal built for high-frequency market analysis and multi-currency transaction ledgers. Combines interactive candlestick market charts, live order books, and bank-grade cryptographic authentication.',
            techStack: ['React', 'PostgreSQL', 'TailwindCSS', 'REST APIs', 'Chart.js', 'JWT'],
            highlights: [
                'Architected reactive candlestick charting component handling 10,000+ streaming market price ticks.',
                'Engineered ACID-compliant transaction ledger engine ensuring atomic double-entry bookkeeping.',
                'Integrated role-based access control (RBAC) and end-to-end tokenized payload encryption.'
            ],
            metrics: [
                { val: '<100ms', label: 'Settlement Time' },
                { val: '10k Ticks', label: 'Live Streamed' },
                { val: '100%', label: 'ACID Compliant' }
            ],
            demoUrl: '#',
            codeUrl: 'https://github.com'
        }
    };

    const modal = document.getElementById('project-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('close-modal-btn');
    const thumbnailBtns = document.querySelectorAll('.project-thumbnail-btn, .project-details-btn');

    if (!modal) return;

    // Elements inside modal to populate
    const modalCategory = document.getElementById('modal-project-category');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalOverview = document.getElementById('modal-overview');
    const modalTechStack = document.getElementById('modal-tech-stack');
    const modalHighlights = document.getElementById('modal-highlights');
    const modalMetrics = document.getElementById('modal-metrics');
    const modalDemoLink = document.getElementById('modal-demo-link');
    const modalCodeLink = document.getElementById('modal-code-link');

    // Attach click listener to each project thumbnail and details button
    thumbnailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Connection: Read the project ID mapped on this specific thumbnail
            const projectId = btn.getAttribute('data-project-id');
            const data = PROJECTS_DATA[projectId];

            if (data) {
                openProjectModal(data);
            }
        });
    });

    /**
     * Populates and opens the project detail modal
     */
    function openProjectModal(data) {
        // Populate content
        if (modalCategory) modalCategory.textContent = data.category;
        if (modalImage) {
            modalImage.src = data.image;
            modalImage.alt = `${data.title} preview screenshot`;
        }
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalOverview) modalOverview.textContent = data.overview;

        // Populate Tech Stack
        if (modalTechStack) {
            modalTechStack.innerHTML = data.techStack
                .map(tech => `<span>${tech}</span>`)
                .join('');
        }

        // Populate Highlights
        if (modalHighlights) {
            modalHighlights.innerHTML = data.highlights
                .map(h => `<li>${h}</li>`)
                .join('');
        }

        // Populate Metrics
        if (modalMetrics) {
            modalMetrics.innerHTML = data.metrics
                .map(m => `
                    <div class="metric-badge">
                        <span class="metric-val">${m.val}</span>
                        <span class="metric-label">${m.label}</span>
                    </div>
                `)
                .join('');
        }

        // Populate Links
        if (modalDemoLink) modalDemoLink.href = data.demoUrl;
        if (modalCodeLink) modalCodeLink.href = data.codeUrl;

        // Display modal
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    }

    /**
     * Closes the modal
     */
    function closeProjectModal() {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
    if (backdrop) backdrop.addEventListener('click', closeProjectModal);

    // Keyboard accessibility: Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeProjectModal();
        }
    });
}
// ==========================================================================
// 6. AI Chat Interface — Simulated Personality Bot
//
// ARCHITECTURE OVERVIEW:
//   - getBotResponse(userInput) handles all local response logic.
//   - showTypingIndicator() / hideTypingIndicator() control the animated dots.
//   - appendMessage(text, role) creates and inserts styled message bubbles.
//   - Suggestion chips auto-fill the input on click and trigger a send.
//   - The 'CLEAR' button resets the conversation to the welcome state.
//
// 🔌 API INTEGRATION POINT — How to connect a real AI:
//   Replace the contents of getBotResponse() with a fetch() call:
//
//   async function getBotResponse(userInput) {
//       // ── OpenAI GPT-4 example ─────────────────────────────────────────
//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${YOUR_OPENAI_API_KEY}`
//           },
//           body: JSON.stringify({
//               model: 'gpt-4o',
//               messages: [
//                   { role: 'system', content: SYSTEM_PROMPT },
//                   ...conversationHistory,
//                   { role: 'user', content: userInput }
//               ],
//               max_tokens: 300,
//               temperature: 0.7
//           })
//       });
//       const data = await response.json();
//       return data.choices[0].message.content;
//       // ── Google Gemini example ────────────────────────────────────────
//       // const response = await fetch(
//       //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${YOUR_GEMINI_KEY}`,
//       //   { method: 'POST', body: JSON.stringify({ contents: [{ parts: [{ text: userInput }] }] }) }
//       // );
//       // const data = await response.json();
//       // return data.candidates[0].content.parts[0].text;
//   }
//
//   IMPORTANT: Never expose API keys client-side in production.
//   Use a backend proxy (e.g. Node.js /api/chat endpoint) to keep keys secure.
// ==========================================================================

function initAIChat() {

    // ─── DOM References ────────────────────────────────────────────────────
    const messagesEl    = document.getElementById('ai-chat-messages');
    const form          = document.getElementById('ai-chat-form');
    const input         = document.getElementById('ai-chat-input');
    const sendBtn       = document.getElementById('ai-send-btn');
    const typingEl      = document.getElementById('ai-typing-indicator');
    const clearBtn      = document.getElementById('chat-clear-btn');
    const chips         = document.querySelectorAll('.ai-chip');

    if (!messagesEl || !form || !input) return; // Section not present

    // ─── System Prompt (used when integrating a real AI API) ──────────────
    // Replace 'Simulated AI' references and send this to your AI model's
    // system/instruction role to give it Poorvika's personality & context.
    const SYSTEM_PROMPT = `
        You are POORVIKA_BOT, a friendly and knowledgeable AI assistant representing
        Poorvika LM, a Software Engineer based in Bengaluru, India.
        Answer questions about Poorvika's skills, experience, projects, and personality
        in a professional yet warm and slightly playful tone.
        Keep responses concise (2–4 sentences). Use emojis sparingly.
        If asked something unrelated to Poorvika's portfolio, politely redirect.
    `.trim();

    // ─── Simulated Knowledge Base ──────────────────────────────────────────
    // Each entry has keyword triggers and a set of response variants.
    // The bot picks a random variant to avoid feeling robotic.
    // ⚡ Replace this entire section with a real API call when ready.
    const KB = [
        {
            keys: ['hello', 'hi', 'hey', 'greet', 'start', 'sup'],
            responses: [
                "Hey there! 👋 I'm POORVIKA_BOT — ask me anything about Poorvika's skills, projects, or availability!",
                "Hi! Great to meet you! I'm here to tell you all about Poorvika's engineering journey. What would you like to know? 🚀",
            ]
        },
        {
            keys: ['tech stack', 'stack', 'technologies', 'languages', 'tools', 'use'],
            responses: [
                "Poorvika's core tech stack includes JavaScript (ES6+), TypeScript, Python, React.js, Node.js, and Next.js on the frontend/backend. She's also proficient in PostgreSQL, MongoDB, Docker, Git, and deploying on cloud platforms. ⚡",
                "The main weapons in Poorvika's arsenal: React, TypeScript, Node.js, Python, REST APIs, GraphQL, PostgreSQL, Redis, Docker, and CI/CD pipelines. Basically a full-stack powerhouse! 🛠️",
            ]
        },
        {
            keys: ['project', 'projects', 'work', 'built', 'portfolio', 'made'],
            responses: [
                "Poorvika has built some amazing projects! Highlights include PixArcade Editor (a browser-based pixel art studio), a Microservices Observability Dashboard monitoring 45M+ daily requests, a gamified graph pathfinding visualizer, and a real-time trading terminal. Check the Projects section for details! 🏆",
                "Some featured projects: a 16-bit pixel art canvas editor, a distributed telemetry dashboard, Dijkstra's algorithm dungeon visualizer, and a high-frequency fintech trading terminal. Each one is linked with full details! 🔍",
            ]
        },
        {
            keys: ['experience', 'years', 'career', 'work history', 'background', 'job'],
            responses: [
                "Poorvika is a Software Engineer with experience building full-stack web applications, scalable REST APIs, and high-performance distributed systems. Her career highlights include agile sprint delivery, production deployments, and architectural ownership of key product features. 📜",
                "With a strong background in full-stack development, Poorvika has worked across frontend React systems, backend Node.js services, and cloud-based infrastructure — always focusing on clean, maintainable code. 💼",
            ]
        },
        {
            keys: ['available', 'availability', 'hire', 'open to work', 'hiring', 'opportunity', 'job', 'freelance'],
            responses: [
                "Yes! Poorvika is currently open to exciting engineering opportunities — full-time roles, interesting projects, and collaborations. Feel free to reach out via the Contact section! 📬",
                "Poorvika is actively exploring new opportunities. Whether it's a full-time role or a meaningful project, she'd love to connect. Hit the Contact section and say hello! ✉️",
            ]
        },
        {
            keys: ['contact', 'email', 'reach', 'connect', 'linkedin', 'github', 'social'],
            responses: [
                "You can reach Poorvika via the Contact section on this portfolio! She's also on LinkedIn and GitHub — links are in the footer. Don't hesitate to reach out! ✉️",
                "The best way to connect is through the Contact section below, or directly via LinkedIn. Poorvika responds quickly and loves hearing from fellow engineers! 🤝",
            ]
        },
        {
            keys: ['education', 'degree', 'college', 'university', 'study', 'studied'],
            responses: [
                "Poorvika has a strong academic foundation in Computer Science / Engineering, which she complemented with real-world projects and continuous self-learning in modern web technologies. 🎓",
                "Her education in Computer Science, combined with hands-on engineering experience, gave Poorvika a solid grounding in algorithms, data structures, and software design principles. 📚",
            ]
        },
        {
            keys: ['hobby', 'hobbies', 'interest', 'personal', 'fun', 'outside work'],
            responses: [
                "Outside of coding, Poorvika is a huge fan of 8-bit & 16-bit RPG games, pixel art, coffee brewing, and reading engineering blogs. She also loves tinkering with creative coding projects! 🎮☕",
                "Poorvika enjoys retro gaming, indie pixel art, solving algorithm puzzles, and staying up-to-date with the latest in web engineering. Coffee fuels it all! ☕🎮",
            ]
        },
        {
            keys: ['skill', 'skills', 'expert', 'good at', 'proficient', 'best at'],
            responses: [
                "Poorvika's top skills: JavaScript/TypeScript (LVL 95), React.js (LVL 94), HTML5 & CSS3 (LVL 96), Node.js (LVL 90), REST APIs/GraphQL (LVL 92), Python (LVL 90), Git (LVL 94), and SQL (LVL 88). Plus strong foundations in clean architecture, testing, and agile delivery. ⚡",
                "She excels in full-stack JavaScript, UI/UX engineering, scalable backend APIs, and developer tooling. Her deep understanding of data structures and algorithm design also makes her a sharp problem-solver. 🧠",
            ]
        },
        {
            keys: ['resume', 'cv', 'download', 'pdf'],
            responses: [
                "You can download Poorvika's resume directly from the Hero section — just click the 📜 RESUME button at the top! It's a full PDF with her experience, skills, and education. 📄",
                "The resume download button is in the hero section at the top of the page! It's a comprehensive PDF covering her full engineering background. 📄",
            ]
        },
        {
            keys: ['who', 'about', 'yourself', 'tell me', 'introduce', 'name'],
            responses: [
                "I'm POORVIKA_BOT, a digital assistant built to represent Poorvika LM — a Software Engineer from Bengaluru, India who loves clean code, scalable architecture, and pixel art aesthetics. What would you like to know? 🤖",
                "Poorvika LM is a passionate Software Engineer who builds pixel-perfect web apps and robust backend systems. Think of me as her always-online AI representative! Ask away 🚀",
            ]
        }
    ];

    // ─── Fallback responses for unrecognized input ─────────────────────────
    const FALLBACKS = [
        "That's an interesting question! I'm a simulated AI so I might not have that specific answer. Try asking about Poorvika's skills, projects, or availability — or scroll through the portfolio! 😊",
        "Hmm, I'm not sure about that one! I work best with questions about Poorvika's tech stack, experience, or how to get in touch. Give one of those a try! 🤖",
        "Great question! My knowledge is focused on Poorvika's portfolio. Try asking: 'What is your tech stack?' or 'Are you available for work?' 🚀",
    ];

    // ─── State ─────────────────────────────────────────────────────────────
    let isBotTyping = false;

    // ─── Utility: Get current timestamp string ─────────────────────────────
    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // ─── Render a message bubble into the chat log ─────────────────────────
    // role: 'bot' | 'user'
    function appendMessage(text, role) {
        const isBot = role === 'bot';

        const row = document.createElement('div');
        row.className = `ai-msg-row ${isBot ? 'bot-row' : 'user-row'}`;

        // Bot messages include a small avatar
        if (isBot) {
            const avatarWrap = document.createElement('div');
            avatarWrap.className = 'ai-msg-avatar';
            const avatarImg = document.createElement('img');
            avatarImg.src = 'profile photo.jpeg';
            avatarImg.alt = '';
            avatarImg.className = 'ai-bot-avatar-img';
            avatarWrap.appendChild(avatarImg);
            row.appendChild(avatarWrap);
        }

        const wrap = document.createElement('div');
        wrap.className = 'ai-msg-bubble-wrap';

        const sender = document.createElement('span');
        sender.className = 'ai-msg-sender';
        sender.textContent = isBot ? 'POORVIKA_BOT' : 'YOU';

        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';
        bubble.textContent = text;

        const timestamp = document.createElement('span');
        timestamp.className = 'ai-msg-time';
        timestamp.textContent = getTimestamp();

        wrap.appendChild(sender);
        wrap.appendChild(bubble);
        wrap.appendChild(timestamp);
        row.appendChild(wrap);

        messagesEl.appendChild(row);

        // Auto-scroll to the latest message
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // ─── Typing indicator visibility ───────────────────────────────────────
    function showTypingIndicator() {
        if (!typingEl) return;
        typingEl.classList.add('is-visible');
        typingEl.setAttribute('aria-hidden', 'false');
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTypingIndicator() {
        if (!typingEl) return;
        typingEl.classList.remove('is-visible');
        typingEl.setAttribute('aria-hidden', 'true');
    }

    // ─── Core response engine (SIMULATED) ─────────────────────────────────
    // 🔌 API INTEGRATION POINT:
    // Make this function async and replace the body with a fetch() call
    // to OpenAI, Gemini, or any other AI API. See the full template at
    // the top of this file.
    function getBotResponse(userInput) {
        const lower = userInput.toLowerCase().trim();

        // Score each KB entry by how many of its keywords appear in the input
        let bestScore = 0;
        let bestEntry = null;

        for (const entry of KB) {
            const score = entry.keys.filter(k => lower.includes(k)).length;
            if (score > bestScore) {
                bestScore = score;
                bestEntry = entry;
            }
        }

        if (bestEntry && bestScore > 0) {
            // Pick a random response variant from the matched entry
            const variants = bestEntry.responses;
            return variants[Math.floor(Math.random() * variants.length)];
        }

        // No match — return a fallback
        return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    }

    // ─── Send flow ─────────────────────────────────────────────────────────
    function sendMessage(text) {
        const trimmed = text.trim();
        if (!trimmed || isBotTyping) return;

        // Render user message
        appendMessage(trimmed, 'user');
        input.value = '';
        sendBtn.disabled = true;
        isBotTyping = true;

        // Show typing indicator with a realistic delay
        showTypingIndicator();

        // Simulate network / thinking latency (800–1800ms)
        // 🔌 API INTEGRATION POINT: Replace this timeout with an await getBotResponse()
        const delay = 800 + Math.random() * 1000;
        setTimeout(() => {
            hideTypingIndicator();
            const reply = getBotResponse(trimmed);
            appendMessage(reply, 'bot');
            isBotTyping = false;
            sendBtn.disabled = false;
            input.focus();
        }, delay);
    }

    // ─── Form submit handler ───────────────────────────────────────────────
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(input.value);
    });

    // ─── Suggestion chip click: auto-send the preset prompt ───────────────
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt && !isBotTyping) {
                input.value = prompt;
                sendMessage(prompt);
            }
        });
    });

    // ─── Clear conversation ────────────────────────────────────────────────
    function resetChat() {
        messagesEl.innerHTML = '';
        hideTypingIndicator();
        isBotTyping = false;
        sendBtn.disabled = false;
        // Re-show welcome message
        showWelcome();
    }

    if (clearBtn) clearBtn.addEventListener('click', resetChat);

    // ─── Initial welcome message ───────────────────────────────────────────
    function showWelcome() {
        appendMessage(
            "Hello! 👋 I'm POORVIKA_BOT — Poorvika's AI assistant. Ask me about her tech stack, projects, availability, or anything else! Use the suggestion chips below to get started.",
            'bot'
        );
    }

    // Boot the chat with the welcome message
    showWelcome();
}

