import type { CareerId } from "./types";

// ============================================================
// Projects database — 50+ projects covering all careers and languages.
// Each project has: title, description, difficulty, estimated time,
// required languages, relevant careers, skills learned.
//
// When a roadmap is generated, the engine selects relevant projects
// based on the user's career and selected languages.
// ============================================================

export type ProjectDifficulty = "beginner" | "intermediate" | "advanced";

export type Project = {
  id: string;
  title: string;
  description: string;
  difficulty: ProjectDifficulty;
  estHours: number;
  languages: string[]; // language IDs from LANGUAGES
  careers: CareerId[]; // which careers this project is relevant to
  skills: string[]; // skills learned
  tier: "foundational" | "core" | "capstone";
  deliverables: string[];
};

export const PROJECTS: Project[] = [
  // ===== Beginner projects (foundational tier) =====
  {
    id: "p-cli-calculator",
    title: "CLI Calculator",
    description: "Build a command-line calculator that supports basic arithmetic operations with input validation.",
    difficulty: "beginner",
    estHours: 4,
    languages: ["python", "javascript", "typescript", "java", "c", "cpp", "go", "rust", "kotlin", "swift", "ruby", "php"],
    careers: ["software-engineering", "web-dev", "data-science", "ai-ml", "cybersecurity", "mobile-dev", "game-dev", "hardware-embedded", "cloud-devops"],
    skills: ["Input/output", "Control flow", "Functions", "Error handling"],
    tier: "foundational",
    deliverables: [
      "Working CLI calculator",
      "Support for +, -, *, /, %, and **",
      "Input validation with helpful errors",
      "README with usage examples",
    ],
  },
  {
    id: "p-number-guessing",
    title: "Number Guessing Game",
    description: "Build a number guessing game where the computer picks a random number and gives hints.",
    difficulty: "beginner",
    estHours: 3,
    languages: ["python", "javascript", "typescript", "java", "c", "cpp", "csharp", "go", "kotlin", "swift", "ruby", "php"],
    careers: ["software-engineering", "web-dev", "mobile-dev", "game-dev"],
    skills: ["Random numbers", "Loops", "Conditionals", "User input"],
    tier: "foundational",
    deliverables: ["Playable game", "Hint system (higher/lower)", "Attempt counter", "Replay option"],
  },
  {
    id: "p-todo-cli",
    title: "Todo List CLI",
    description: "Build a command-line todo list manager with add, complete, list, and delete operations.",
    difficulty: "beginner",
    estHours: 5,
    languages: ["python", "javascript", "typescript", "java", "go", "rust", "ruby", "php", "bash"],
    careers: ["software-engineering", "web-dev", "cloud-devops"],
    skills: ["Data structures", "File I/O", "CLI parsing", "CRUD operations"],
    tier: "foundational",
    deliverables: ["Add/complete/delete tasks", "Persist to file", "Filter by status", "CLI help"],
  },
  {
    id: "p-text-stats",
    title: "Text Statistics Analyzer",
    description: "Build a program that analyzes a text file: word count, character count, most common words, reading time.",
    difficulty: "beginner",
    estHours: 4,
    languages: ["python", "javascript", "typescript", "java", "go", "rust", "ruby", "php", "r"],
    careers: ["software-engineering", "data-science", "ai-ml"],
    skills: ["File reading", "String manipulation", "Dictionaries/maps", "Sorting"],
    tier: "foundational",
    deliverables: ["Word/char/sentence counts", "Top 10 most common words", "Reading time estimate", "Handles large files"],
  },
  {
    id: "p-password-generator",
    title: "Password Generator",
    description: "Build a password generator that creates strong, customizable passwords with various options.",
    difficulty: "beginner",
    estHours: 3,
    languages: ["python", "javascript", "typescript", "java", "go", "rust", "kotlin", "swift", "ruby", "php"],
    careers: ["software-engineering", "cybersecurity", "web-dev", "mobile-dev"],
    skills: ["Random generation", "String building", "User input", "Validation"],
    tier: "foundational",
    deliverables: ["Configurable length", "Include/exclude character sets", "Strength meter", "Multiple passwords at once"],
  },
  {
    id: "p-unit-converter",
    title: "Unit Converter",
    description: "Build a unit converter supporting length, weight, temperature, and currency conversions.",
    difficulty: "beginner",
    estHours: 4,
    languages: ["python", "javascript", "typescript", "java", "kotlin", "swift", "csharp", "go", "ruby", "php"],
    careers: ["software-engineering", "web-dev", "mobile-dev"],
    skills: ["Functions", "Math", "Data structures", "UI basics"],
    tier: "foundational",
    deliverables: ["Multiple unit categories", "Bidirectional conversion", "Temperature handling", "Clean UI"],
  },

  // ===== Beginner-Intermediate: Web =====
  {
    id: "p-personal-portfolio",
    title: "Personal Portfolio Website",
    description: "Build a responsive portfolio website with about, projects, and contact sections.",
    difficulty: "beginner",
    estHours: 8,
    languages: ["javascript", "typescript", "html", "css", "react", "nextjs"],
    careers: ["web-dev", "software-engineering"],
    skills: ["HTML structure", "CSS layout", "Responsive design", "Deployment"],
    tier: "foundational",
    deliverables: ["Responsive layout", "Projects showcase", "Contact form", "Deployed to Vercel/Netlify"],
  },
  {
    id: "p-landing-page",
    title: "Product Landing Page",
    description: "Build a marketing landing page with hero, features, pricing, and CTA sections.",
    difficulty: "beginner",
    estHours: 6,
    languages: ["javascript", "typescript", "html", "css", "react", "nextjs"],
    careers: ["web-dev", "software-engineering"],
    skills: ["CSS animations", "Layouts", "Forms", "Performance"],
    tier: "foundational",
    deliverables: ["Hero section", "Feature grid", "Pricing table", "Newsletter signup"],
  },
  {
    id: "p-markdown-blog",
    title: "Markdown Blog",
    description: "Build a blog that renders Markdown posts from files with tags and pagination.",
    difficulty: "intermediate",
    estHours: 12,
    languages: ["javascript", "typescript", "react", "nextjs"],
    careers: ["web-dev", "software-engineering"],
    skills: ["Markdown parsing", "File system routing", "Static generation", "SEO"],
    tier: "core",
    deliverables: ["Post list page", "Individual post pages", "Tag filtering", "RSS feed"],
  },

  // ===== Intermediate: Backend/API =====
  {
    id: "p-rest-api-todo",
    title: "REST API for Todos",
    description: "Build a REST API with CRUD operations, authentication, and persistence.",
    difficulty: "intermediate",
    estHours: 10,
    languages: ["python", "javascript", "typescript", "java", "go", "rust", "ruby", "php", "django", "fastapi", "flask", "nextjs"],
    careers: ["software-engineering", "web-dev", "cloud-devops"],
    skills: ["HTTP methods", "REST design", "Authentication", "Database"],
    tier: "core",
    deliverables: ["CRUD endpoints", "JWT auth", "PostgreSQL/SQLite", "OpenAPI docs"],
  },
  {
    id: "p-url-shortener",
    title: "URL Shortener Service",
    description: "Build a URL shortener with analytics, custom aliases, and expiration.",
    difficulty: "intermediate",
    estHours: 12,
    languages: ["python", "javascript", "typescript", "java", "go", "rust", "ruby", "django", "fastapi", "nextjs"],
    careers: ["software-engineering", "web-dev", "cloud-devops"],
    skills: ["Database design", "Hashing", "Redirects", "Analytics"],
    tier: "core",
    deliverables: ["Shorten endpoint", "Redirect endpoint", "Click analytics", "Custom aliases"],
  },
  {
    id: "p-chat-app",
    title: "Real-time Chat App",
    description: "Build a real-time chat application with WebSocket, rooms, and typing indicators.",
    difficulty: "intermediate",
    estHours: 16,
    languages: ["javascript", "typescript", "python", "java", "go", "react", "nextjs", "fastapi"],
    careers: ["software-engineering", "web-dev"],
    skills: ["WebSocket", "Real-time UI", "State management", "Scaling"],
    tier: "core",
    deliverables: ["Real-time messaging", "Multiple rooms", "User presence", "Message history"],
  },
  {
    id: "p-ecommerce-api",
    title: "E-commerce API",
    description: "Build an e-commerce backend with products, cart, orders, payments, and inventory.",
    difficulty: "advanced",
    estHours: 30,
    languages: ["python", "javascript", "typescript", "java", "go", "django", "fastapi", "nextjs"],
    careers: ["software-engineering", "web-dev", "cloud-devops"],
    skills: ["Complex domain modeling", "Payment integration", "Transactions", "Inventory"],
    tier: "capstone",
    deliverables: ["Product catalog", "Shopping cart", "Order flow", "Stripe integration"],
  },

  // ===== Intermediate: Data/ML =====
  {
    id: "p-data-cleaner",
    title: "Data Cleaning Tool",
    description: "Build a tool that cleans messy CSV data: handles missing values, normalizes formats, deduplicates.",
    difficulty: "intermediate",
    estHours: 8,
    languages: ["python", "r", "sql"],
    careers: ["data-science", "ai-ml"],
    skills: ["Pandas", "Data wrangling", "Statistical imputation", "Validation"],
    tier: "core",
    deliverables: ["CSV input/output", "Missing value handling", "Format normalization", "Report"],
  },
  {
    id: "p-dashboard",
    title: "Data Visualization Dashboard",
    description: "Build an interactive dashboard with charts, filters, and data export.",
    difficulty: "intermediate",
    estHours: 14,
    languages: ["python", "javascript", "typescript", "react", "nextjs"],
    careers: ["data-science", "ai-ml", "web-dev"],
    skills: ["Charts", "Interactivity", "Filters", "Export"],
    tier: "core",
    deliverables: ["Multiple chart types", "Date range filter", "Drill-down", "CSV/PDF export"],
  },
  {
    id: "p-ml-classifier",
    title: "ML Classifier (Iris/Titanic)",
    description: "Build a machine learning classifier end-to-end: data, training, evaluation, prediction.",
    difficulty: "intermediate",
    estHours: 12,
    languages: ["python", "r"],
    careers: ["data-science", "ai-ml"],
    skills: ["Feature engineering", "Model training", "Evaluation", "Visualization"],
    tier: "core",
    deliverables: ["Data exploration notebook", "Trained model", "Evaluation metrics", "Prediction script"],
  },
  {
    id: "p-recommendation-engine",
    title: "Recommendation Engine",
    description: "Build a movie/product recommendation system using collaborative filtering.",
    difficulty: "advanced",
    estHours: 20,
    languages: ["python", "r"],
    careers: ["data-science", "ai-ml"],
    skills: ["Collaborative filtering", "Matrix factorization", "Evaluation", "Scaling"],
    tier: "capstone",
    deliverables: ["User-item matrix", "Similarity computation", "Recommendations", "A/B test plan"],
  },

  // ===== Intermediate: Cloud/DevOps =====
  {
    id: "p-docker-compose-stack",
    title: "Docker Compose Multi-service Stack",
    description: "Build a multi-service Docker Compose stack with web, API, database, and cache.",
    difficulty: "intermediate",
    estHours: 10,
    languages: ["python", "javascript", "typescript", "java", "go", "bash", "sql"],
    careers: ["cloud-devops", "software-engineering"],
    skills: ["Docker", "Compose", "Networking", "Volumes"],
    tier: "core",
    deliverables: ["docker-compose.yml", "Multiple services", "Health checks", "Documentation"],
  },
  {
    id: "p-ci-cd-pipeline",
    title: "CI/CD Pipeline",
    description: "Build a CI/CD pipeline with automated tests, builds, and deployments.",
    difficulty: "intermediate",
    estHours: 12,
    languages: ["bash", "javascript", "typescript", "python", "go"],
    careers: ["cloud-devops", "software-engineering"],
    skills: ["GitHub Actions", "Testing", "Automation", "Deployment"],
    tier: "core",
    deliverables: ["CI workflow", "CD workflow", "Test suite", "Staging + production"],
  },
  {
    id: "p-iac-terraform",
    title: "Infrastructure as Code (Terraform)",
    description: "Build reusable Terraform modules for cloud infrastructure.",
    difficulty: "advanced",
    estHours: 18,
    languages: ["bash"],
    careers: ["cloud-devops"],
    skills: ["Terraform", "AWS/GCP", "Modules", "State management"],
    tier: "capstone",
    deliverables: ["Reusable modules", "Multi-environment setup", "State backend", "Documentation"],
  },

  // ===== Intermediate: Cybersecurity =====
  {
    id: "p-port-scanner",
    title: "Port Scanner",
    description: "Build a port scanner that checks which ports are open on a target.",
    difficulty: "intermediate",
    estHours: 8,
    languages: ["python", "go", "rust", "c", "bash"],
    careers: ["cybersecurity"],
    skills: ["Networking", "Sockets", "Concurrency", "Reporting"],
    tier: "core",
    deliverables: ["Scan single host", "Scan range of ports", "Multi-threaded", "Output report"],
  },
  {
    id: "p-vuln-scanner",
    title: "Web Vulnerability Scanner",
    description: "Build a scanner that checks websites for common OWASP Top 10 vulnerabilities.",
    difficulty: "advanced",
    estHours: 25,
    languages: ["python", "go", "rust", "bash"],
    careers: ["cybersecurity"],
    skills: ["OWASP", "HTTP", "Vulnerability detection", "Reporting"],
    tier: "capstone",
    deliverables: ["SQLi detection", "XSS detection", "CSRF checks", "Detailed report"],
  },
  {
    id: "p-caesar-cipher",
    title: "Caesar Cipher Tool",
    description: "Build a tool that encrypts/decrypts text with the Caesar cipher and cracks ciphertexts.",
    difficulty: "beginner",
    estHours: 4,
    languages: ["python", "javascript", "typescript", "java", "c", "go", "rust", "ruby"],
    careers: ["cybersecurity", "software-engineering"],
    skills: ["Cryptography basics", "String manipulation", "Frequency analysis"],
    tier: "foundational",
    deliverables: ["Encrypt/decrypt", "Brute-force cracker", "Frequency analysis", "CLI"],
  },

  // ===== Intermediate: Mobile =====
  {
    id: "p-weather-app-mobile",
    title: "Weather App (Mobile)",
    description: "Build a mobile weather app with current conditions, forecast, and location search.",
    difficulty: "intermediate",
    estHours: 12,
    languages: ["kotlin", "swift", "dart", "typescript"],
    careers: ["mobile-dev"],
    skills: ["API integration", "Location services", "UI design", "Caching"],
    tier: "core",
    deliverables: ["Current weather", "7-day forecast", "Search by city", "GPS location"],
  },
  {
    id: "p-notes-app-mobile",
    title: "Notes App (Mobile)",
    description: "Build a mobile notes app with offline storage, sync, and rich text.",
    difficulty: "intermediate",
    estHours: 16,
    languages: ["kotlin", "swift", "dart", "typescript"],
    careers: ["mobile-dev"],
    skills: ["Local storage", "CRUD", "Sync", "Rich text"],
    tier: "core",
    deliverables: ["Create/edit/delete notes", "Offline-first", "Categories/tags", "Search"],
  },
  {
    id: "p-fitness-tracker-mobile",
    title: "Fitness Tracker (Mobile)",
    description: "Build a mobile fitness tracker with workout logging, charts, and goals.",
    difficulty: "advanced",
    estHours: 25,
    languages: ["kotlin", "swift", "dart"],
    careers: ["mobile-dev"],
    skills: ["Sensor integration", "Charts", "Local DB", "Notifications"],
    tier: "capstone",
    deliverables: ["Workout logging", "Progress charts", "Goal setting", "Export data"],
  },

  // ===== Intermediate: Game Dev =====
  {
    id: "p-pong-game",
    title: "Pong Clone",
    description: "Build a Pong clone with player vs AI mode and score tracking.",
    difficulty: "beginner",
    estHours: 6,
    languages: ["csharp", "cpp", "python", "javascript"],
    careers: ["game-dev"],
    skills: ["Game loop", "Collision detection", "Input handling", "Rendering"],
    tier: "foundational",
    deliverables: ["Player vs AI mode", "Score tracking", "Sound effects", "Menu"],
  },
  {
    id: "p-platformer",
    title: "2D Platformer Game",
    description: "Build a 2D platformer with levels, enemies, collectibles, and a level editor.",
    difficulty: "intermediate",
    estHours: 20,
    languages: ["csharp", "cpp", "python"],
    careers: ["game-dev"],
    skills: ["Physics", "Level design", "Sprite animation", "Game state"],
    tier: "core",
    deliverables: ["Multiple levels", "Player movement", "Enemy AI", "Level editor"],
  },
  {
    id: "p-rpg-game",
    title: "Top-down RPG",
    description: "Build a top-down RPG with combat, inventory, dialogue, and quests.",
    difficulty: "advanced",
    estHours: 40,
    languages: ["csharp", "cpp"],
    careers: ["game-dev"],
    skills: ["Combat system", "Inventory", "Dialogue trees", "Quest system"],
    tier: "capstone",
    deliverables: ["Player movement", "Combat", "Inventory", "At least 3 quests"],
  },

  // ===== Intermediate: Hardware/Embedded =====
  {
    id: "p-led-controller",
    title: "LED Controller (Arduino)",
    description: "Build an Arduino sketch that controls LEDs with patterns, buttons, and serial commands.",
    difficulty: "beginner",
    estHours: 5,
    languages: ["c", "cpp"],
    careers: ["hardware-embedded"],
    skills: ["Microcontroller I/O", "PWM", "Serial communication", "Timing"],
    tier: "foundational",
    deliverables: ["LED patterns", "Button control", "Serial commands", "Documentation"],
  },
  {
    id: "p-sensor-logger",
    title: "Sensor Data Logger",
    description: "Build an embedded system that reads sensors and logs data to SD card and/or cloud.",
    difficulty: "intermediate",
    estHours: 15,
    languages: ["c", "cpp", "python"],
    careers: ["hardware-embedded"],
    skills: ["I2C/SPI", "SD card", "RTC", "Cloud sync"],
    tier: "core",
    deliverables: ["Read temperature/humidity", "Log to SD", "Timestamps", "Cloud upload"],
  },
  {
    id: "p-iot-dashboard",
    title: "IoT Dashboard",
    description: "Build a full IoT system: device firmware + MQTT broker + web dashboard.",
    difficulty: "advanced",
    estHours: 30,
    languages: ["c", "cpp", "python", "javascript", "typescript"],
    careers: ["hardware-embedded", "cloud-devops", "web-dev"],
    skills: ["MQTT", "Embedded + web integration", "Real-time data", "Database"],
    tier: "capstone",
    deliverables: ["Device firmware", "MQTT broker", "Web dashboard", "Historical charts"],
  },

  // ===== Advanced: AI/ML =====
  {
    id: "p-llm-chatbot",
    title: "LLM-powered Chatbot",
    description: "Build a chatbot using an LLM API (OpenAI/Anthropic/Z.ai) with streaming and history.",
    difficulty: "intermediate",
    estHours: 12,
    languages: ["python", "javascript", "typescript", "react", "nextjs", "fastapi"],
    careers: ["ai-ml", "software-engineering", "web-dev"],
    skills: ["LLM APIs", "Streaming", "Prompt engineering", "State management"],
    tier: "core",
    deliverables: ["Chat UI", "Streaming responses", "Conversation history", "Model selection"],
  },
  {
    id: "p-rag-system",
    title: "RAG (Retrieval-Augmented Generation)",
    description: "Build a RAG system that answers questions from your documents using embeddings + LLM.",
    difficulty: "advanced",
    estHours: 25,
    languages: ["python", "typescript"],
    careers: ["ai-ml", "software-engineering"],
    skills: ["Embeddings", "Vector DB", "Retrieval", "LLM integration"],
    tier: "capstone",
    deliverables: ["Document ingestion", "Vector storage", "Retrieval", "Cited answers"],
  },
  {
    id: "p-image-classifier",
    title: "Image Classifier (CNN)",
    description: "Build and train a CNN to classify images (e.g., cats vs dogs).",
    difficulty: "advanced",
    estHours: 20,
    languages: ["python"],
    careers: ["ai-ml", "data-science"],
    skills: ["PyTorch/TensorFlow", "CNNs", "Data augmentation", "Transfer learning"],
    tier: "capstone",
    deliverables: ["Trained model", "Training notebook", "Evaluation metrics", "Inference script"],
  },

  // ===== Advanced: Full-stack capstones =====
  {
    id: "p-social-network",
    title: "Social Network",
    description: "Build a social network with posts, likes, comments, follows, and a feed.",
    difficulty: "advanced",
    estHours: 40,
    languages: ["javascript", "typescript", "python", "java", "react", "nextjs", "django", "fastapi"],
    careers: ["software-engineering", "web-dev"],
    skills: ["Full-stack", "Real-time", "Recommendations", "Scaling"],
    tier: "capstone",
    deliverables: ["User profiles", "Posts + likes + comments", "Follow system", "Feed algorithm"],
  },
  {
    id: "p-project-management-app",
    title: "Project Management App",
    description: "Build a Trello/Jira-like project management app with boards, cards, and teams.",
    difficulty: "advanced",
    estHours: 35,
    languages: ["javascript", "typescript", "python", "react", "nextjs", "django", "fastapi"],
    careers: ["software-engineering", "web-dev"],
    skills: ["Drag-and-drop", "Real-time sync", "Permissions", "Notifications"],
    tier: "capstone",
    deliverables: ["Boards + lists + cards", "Drag-and-drop", "Team members", "Activity log"],
  },
  {
    id: "p-booking-system",
    title: "Booking System",
    description: "Build a booking system (hotels/appointments) with availability, payments, and notifications.",
    difficulty: "advanced",
    estHours: 30,
    languages: ["javascript", "typescript", "python", "java", "react", "nextjs", "django", "fastapi"],
    careers: ["software-engineering", "web-dev"],
    skills: ["Calendar logic", "Payments", "Notifications", "Concurrency"],
    tier: "capstone",
    deliverables: ["Availability calendar", "Booking flow", "Payment integration", "Email confirmations"],
  },

  // ===== Intermediate: Misc =====
  {
    id: "p-weather-cli",
    title: "Weather CLI",
    description: "Build a CLI tool that fetches and displays weather for any city using a public API.",
    difficulty: "beginner",
    estHours: 4,
    languages: ["python", "javascript", "typescript", "go", "rust", "ruby", "php", "bash"],
    careers: ["software-engineering", "web-dev", "cloud-devops"],
    skills: ["HTTP APIs", "JSON parsing", "CLI design", "Caching"],
    tier: "foundational",
    deliverables: ["City lookup", "Current conditions", "Forecast", "Units toggle"],
  },
  {
    id: "p-file-encryptor",
    title: "File Encryptor",
    description: "Build a tool that encrypts and decrypts files with AES-256.",
    difficulty: "intermediate",
    estHours: 10,
    languages: ["python", "go", "rust", "c", "java"],
    careers: ["cybersecurity", "software-engineering"],
    skills: ["Symmetric encryption", "Key derivation", "File I/O", "CLI"],
    tier: "core",
    deliverables: ["Encrypt/decrypt files", "Password-based key", "Secure defaults", "CLI"],
  },
  {
    id: "p-static-site-generator",
    title: "Static Site Generator",
    description: "Build a static site generator that converts Markdown files into a complete HTML site.",
    difficulty: "intermediate",
    estHours: 14,
    languages: ["python", "javascript", "typescript", "go", "rust", "ruby"],
    careers: ["software-engineering", "web-dev", "cloud-devops"],
    skills: ["Markdown parsing", "Templating", "File generation", "CLI"],
    tier: "core",
    deliverables: ["Markdown → HTML", "Templates", "Assets", "Live reload"],
  },
  {
    id: "p-database-migration-tool",
    title: "Database Migration Tool",
    description: "Build a tool that manages database schema migrations with up/down support.",
    difficulty: "intermediate",
    estHours: 12,
    languages: ["python", "javascript", "typescript", "go", "java", "sql"],
    careers: ["software-engineering", "cloud-devops"],
    skills: ["SQL", "Schema versioning", "CLI", "Transactions"],
    tier: "core",
    deliverables: ["Create migrations", "Apply up/down", "Status command", "Rollback"],
  },
  {
    id: "p-api-rate-limiter",
    title: "API Rate Limiter",
    description: "Build a rate limiter middleware with multiple strategies (token bucket, sliding window).",
    difficulty: "intermediate",
    estHours: 10,
    languages: ["python", "javascript", "typescript", "go", "rust", "java"],
    careers: ["software-engineering", "cloud-devops", "web-dev"],
    skills: ["Middleware", "Algorithms", "Redis", "Distributed systems"],
    tier: "core",
    deliverables: ["Token bucket", "Sliding window", "Redis backend", "Per-user limits"],
  },
  {
    id: "p-web-scraper",
    title: "Web Scraper",
    description: "Build a web scraper that extracts data from websites with rate limiting and pagination.",
    difficulty: "intermediate",
    estHours: 8,
    languages: ["python", "javascript", "typescript", "go", "ruby", "php"],
    careers: ["data-science", "software-engineering", "ai-ml"],
    skills: ["HTTP", "HTML parsing", "Rate limiting", "Data extraction"],
    tier: "core",
    deliverables: ["Scrape pages", "Handle pagination", "Respect robots.txt", "Export CSV/JSON"],
  },
  {
    id: "p-log-analyzer",
    title: "Log Analyzer",
    description: "Build a tool that parses server logs, extracts insights, and generates reports.",
    difficulty: "intermediate",
    estHours: 10,
    languages: ["python", "go", "rust", "bash", "sql"],
    careers: ["cloud-devops", "data-science", "cybersecurity"],
    skills: ["Log parsing", "Regex", "Aggregation", "Reporting"],
    tier: "core",
    deliverables: ["Parse multiple formats", "Top errors", "Traffic stats", "HTML report"],
  },
  {
    id: "p-music-player",
    title: "Music Player",
    description: "Build a music player with playlist, search, and audio visualizer.",
    difficulty: "intermediate",
    estHours: 16,
    languages: ["javascript", "typescript", "react", "nextjs", "swift", "kotlin"],
    careers: ["web-dev", "mobile-dev", "software-engineering"],
    skills: ["Audio APIs", "UI state", "Playlists", "Visualization"],
    tier: "core",
    deliverables: ["Play/pause/seek", "Playlist management", "Search", "Visualizer"],
  },
  {
    id: "p-pomodoro-timer",
    title: "Pomodoro Timer",
    description: "Build a Pomodoro timer with work/break cycles, notifications, and statistics.",
    difficulty: "beginner",
    estHours: 5,
    languages: ["javascript", "typescript", "python", "kotlin", "swift", "react", "nextjs"],
    careers: ["software-engineering", "web-dev", "mobile-dev"],
    skills: ["Timers", "Notifications", "State", "Statistics"],
    tier: "foundational",
    deliverables: ["Work/break cycles", "Notifications", "Daily stats", "Settings"],
  },
  {
    id: "p-qr-code-generator",
    title: "QR Code Generator",
    description: "Build a tool that generates QR codes for URLs, text, and contact info.",
    difficulty: "beginner",
    estHours: 4,
    languages: ["python", "javascript", "typescript", "java", "go", "react", "nextjs"],
    careers: ["software-engineering", "web-dev", "mobile-dev"],
    skills: ["Libraries", "Image generation", "UI", "Export"],
    tier: "foundational",
    deliverables: ["Generate from text/URL", "Customizable size", "Download PNG/SVG", "Batch mode"],
  },
  {
    id: "p-mock-api-server",
    title: "Mock API Server",
    description: "Build a mock API server for testing that returns configurable responses with delays.",
    difficulty: "intermediate",
    estHours: 8,
    languages: ["javascript", "typescript", "python", "go", "ruby", "php"],
    careers: ["software-engineering", "web-dev", "cloud-devops"],
    skills: ["HTTP server", "Routing", "Configuration", "Middleware"],
    tier: "core",
    deliverables: ["Define endpoints", "Configurable responses", "Delay simulation", "Logging"],
  },
  {
    id: "p-image-resizer",
    title: "Batch Image Resizer",
    description: "Build a tool that batch-resizes images with multiple format support and watermarking.",
    difficulty: "intermediate",
    estHours: 8,
    languages: ["python", "javascript", "go", "rust", "csharp"],
    careers: ["software-engineering", "web-dev"],
    skills: ["Image processing", "Batch operations", "CLI", "Formats"],
    tier: "core",
    deliverables: ["Resize multiple images", "Format conversion", "Watermark", "CLI"],
  },
  {
    id: "p-realtime-collab-editor",
    title: "Real-time Collaborative Editor",
    description: "Build a real-time collaborative text editor with CRDT or OT for conflict resolution.",
    difficulty: "advanced",
    estHours: 30,
    languages: ["javascript", "typescript", "react", "nextjs"],
    careers: ["software-engineering", "web-dev"],
    skills: ["CRDT/OT", "WebSocket", "Real-time UI", "Conflict resolution"],
    tier: "capstone",
    deliverables: ["Real-time editing", "Multiple users", "Cursor presence", "History"],
  },
  {
    id: "p-search-engine",
    title: "Mini Search Engine",
    description: "Build a search engine with crawler, indexer, and ranking from scratch.",
    difficulty: "advanced",
    estHours: 35,
    languages: ["python", "go", "rust", "java"],
    careers: ["software-engineering", "data-science", "ai-ml"],
    skills: ["Crawling", "Inverted index", "TF-IDF", "Ranking"],
    tier: "capstone",
    deliverables: ["Web crawler", "Inverted index", "Search API", "Ranking algorithm"],
  },
  {
    id: "p-blockchain-explorer",
    title: "Blockchain Explorer",
    description: "Build a blockchain explorer that queries and displays blocks, transactions, and addresses.",
    difficulty: "advanced",
    estHours: 25,
    languages: ["javascript", "typescript", "python", "go", "rust", "react", "nextjs"],
    careers: ["software-engineering", "web-dev"],
    skills: ["Blockchain APIs", "Data visualization", "Caching", "Real-time updates"],
    tier: "capstone",
    deliverables: ["Block lookup", "Transaction viewer", "Address history", "Live updates"],
  },
  {
    id: "p-terminal-emulator",
    title: "Terminal Emulator",
    description: "Build a web-based terminal emulator with command history, autocomplete, and themes.",
    difficulty: "advanced",
    estHours: 20,
    languages: ["javascript", "typescript", "react", "nextjs"],
    careers: ["software-engineering", "web-dev", "cloud-devops"],
    skills: ["Terminal protocols", "xterm.js", "Themes", "Input handling"],
    tier: "capstone",
    deliverables: ["Command input", "History navigation", "Autocomplete", "Themes"],
  },
  {
    id: "p-code-playground",
    title: "In-browser Code Playground",
    description: "Build an in-browser code playground that runs JavaScript with console output.",
    difficulty: "intermediate",
    estHours: 14,
    languages: ["javascript", "typescript", "react", "nextjs"],
    careers: ["software-engineering", "web-dev"],
    skills: ["Code execution", "Sandboxing", "Editor integration", "Output capture"],
    tier: "core",
    deliverables: ["Code editor", "Run button", "Console output", "Examples"],
  },
];

// ============================================================
// Project selection — given a roadmap's career and languages,
// return relevant projects sorted by difficulty.
// ============================================================

export type SelectedProject = Project & {
  // Reason this project was selected for this user
  matchReason: string;
};

export function selectProjectsForRoadmap(
  careerId: CareerId,
  languageIds: string[],
  maxProjects: number = 8,
): SelectedProject[] {
  // Score each project based on:
  // - Career match (highest weight)
  // - Language overlap
  // - Tier diversity (we want some beginner, some intermediate, some capstone)
  const scored = PROJECTS.map((p) => {
    let score = 0;
    let reason = "";

    const careerMatch = p.careers.includes(careerId);
    if (careerMatch) {
      score += 100;
      reason += "matches your career; ";
    }

    const langOverlap = p.languages.filter((l) => languageIds.includes(l)).length;
    if (langOverlap > 0) {
      score += langOverlap * 30;
      reason += `uses ${langOverlap} of your languages; `;
    }

    return { project: p, score, reason: reason.trim().replace(/; $/, "") };
  });

  // Filter to projects with at least some relevance (career match OR language overlap)
  const relevant = scored.filter((s) => s.score > 0);

  // Sort by score descending
  relevant.sort((a, b) => b.score - a.score);

  // Ensure tier diversity: pick 2-3 beginner, 2-3 intermediate, 1-2 capstone
  const byTier: Record<string, typeof relevant> = {
    foundational: relevant.filter((s) => s.project.tier === "foundational"),
    core: relevant.filter((s) => s.project.tier === "core"),
    capstone: relevant.filter((s) => s.project.tier === "capstone"),
  };

  const result: SelectedProject[] = [];
  const targetPerTier = {
    foundational: Math.min(3, byTier.foundational.length),
    core: Math.min(3, byTier.core.length),
    capstone: Math.min(2, byTier.capstone.length),
  };

  // Take from each tier, capped at maxProjects total
  let total = 0;
  for (const tier of ["foundational", "core", "capstone"] as const) {
    const target = targetPerTier[tier];
    for (let i = 0; i < target && total < maxProjects; i++) {
      const item = byTier[tier][i];
      if (item) {
        result.push({ ...item.project, matchReason: item.reason });
        total++;
      }
    }
  }

  // If we still have room, add more from any tier
  if (result.length < maxProjects) {
    const used = new Set(result.map((r) => r.id));
    for (const s of relevant) {
      if (result.length >= maxProjects) break;
      if (used.has(s.project.id)) continue;
      result.push({ ...s.project, matchReason: s.reason });
    }
  }

  return result;
}

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export const PROJECT_MAP: Record<string, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.id, p]),
);
