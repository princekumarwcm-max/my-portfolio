// Starfield Canvas Background
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let shootingStars = [];

// Configuration
const numStars = 200;
const shootingStarFreq = 0.02; // Probability per frame

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseAlpha = Math.random() * 0.5 + 0.1;
        this.alpha = this.baseAlpha;
        this.shineSpeed = Math.random() * 0.02 + 0.005;
        this.shining = Math.random() > 0.8; // 20% of stars shine
        this.shineDir = 1;
        this.color = Math.random() > 0.5 ? '#ffffff' : '#00f3ff';
    }

    update() {
        // Subtle drift
        this.y -= 0.1 * this.size;
        
        if (this.y < 0) {
            this.y = height;
            this.x = Math.random() * width;
        }

        // Shining effect
        if (this.shining) {
            this.alpha += this.shineSpeed * this.shineDir;
            if (this.alpha > 1) {
                this.alpha = 1;
                this.shineDir = -1;
            } else if (this.alpha < this.baseAlpha) {
                this.alpha = this.baseAlpha;
                this.shineDir = 1;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        if (this.shining) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = 0;
        this.length = Math.random() * 80 + 20;
        this.speed = Math.random() * 10 + 5;
        this.size = Math.random() * 2 + 1;
        this.active = true;
        this.angle = Math.PI / 4; // 45 degrees
        this.opacity = 1;
    }

    update() {
        this.x -= this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.opacity -= 0.01;

        if (this.opacity <= 0 || this.x < 0 || this.y > height) {
            this.active = false;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const gradient = ctx.createLinearGradient(0, 0, -this.length, 0);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.length, 0);
        ctx.lineWidth = this.size;
        ctx.strokeStyle = gradient;
        ctx.stroke();
        
        ctx.restore();
    }
}

function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Randomly spawn shooting stars
    if (Math.random() < shootingStarFreq) {
        shootingStars.push(new ShootingStar());
    }

    // Update and draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        let ss = shootingStars[i];
        ss.update();
        ss.draw();
        if (!ss.active) {
            shootingStars.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();


// Mouse Follow Effect
const mouseGlow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
});


// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

links.forEach(link => {
    link.addEventListener('click', (e) => {
        // Trigger dangerous click animation
        link.classList.add('nav-click-dangerous');
        setTimeout(() => {
            link.classList.remove('nav-click-dangerous');
        }, 4000); // Wait for animation to finish

        navLinks.classList.remove('active');
        if (hamburger) hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});


// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Highlight active nav link based on scroll position
    let current = '';
    const sections = document.querySelectorAll('.section, .hero-section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});


// Typing Effect for Title
const titleElement = document.querySelector('.typing-text');
const titles = ['Aspiring Data Scientist', 'Machine Learning', 'Power BI Expert', 'SQL', 'NLP & LLM', 'Deep Learning', 'Artificial Intelligence', 'GAN AI'];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        titleElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        titleElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingDelay = 500; // Pause before typing new word
    }

    setTimeout(typeEffect, typingDelay);
}

// Start typing effect after a short delay
setTimeout(typeEffect, 1000);

// Modal Functionality
const modal = document.getElementById('project-modal');
const modalBody = document.querySelector('.modal-body');
const closeModal = document.querySelector('.close-modal');

const projectData = {
    'expense-tracker': `
        <h2>AI-Powered Expense Tracker</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="dd6a8543-6275-4331-9607-0b8bf2c90c78.png" alt="AI Expense Tracker Dashboard">
        </div>
        <p>Developed a full-stack AI-powered expense tracking application that enables users to efficiently manage and analyze their daily financial activities. The system integrates intelligent expense categorization, real-time insights, and voice input functionality to enhance user experience and automation.</p>
        <ul>
            <li>Implemented machine learning models to automatically classify expenses into relevant categories, improving accuracy and reducing manual input.</li>
            <li>Integrated voice recognition features to allow hands-free expense entry, enhancing accessibility and usability.</li>
            <li>Designed interactive dashboards to provide users with meaningful financial insights and spending patterns.</li>
            <li>Automated expense tracking and analysis, reducing manual effort by approximately 60%.</li>
            <li>Built using technologies such as Python, Streamlit, and AI/ML libraries for seamless performance.</li>
        </ul>
        <div style="margin-top: 1.5rem; text-align: center;">
            <a href="https://expense-tracker-with-ai-2.onrender.com/" class="btn btn-small btn-primary" target="_blank">Live Demo</a>
        </div>
    `,
    'agentic-chatbot': `
        <h2>Agentic AI Chatbot</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="507cc62c-1f63-4e6a-aa4e-c26bb162acb5.png" alt="Agentic AI Chatbot Workflow">
        </div>
        <p>Developed an advanced Agentic AI chatbot capable of autonomous decision-making, task execution, and multi-step reasoning to deliver intelligent and context-aware responses. The system leverages modern Large Language Models (LLMs) combined with an agent-based architecture to perform complex tasks beyond simple question-answering.</p>
        <ul>
            <li>Designed and implemented an agent-based workflow that enables the chatbot to plan, reason, and execute actions step by step.</li>
            <li>Integrated APIs and external tools to support real-time data fetching, task automation, and dynamic responses.</li>
            <li>Built a memory management system to maintain conversation context and improve response accuracy over time.</li>
            <li>Implemented Natural Language Understanding (NLU) for better intent detection and enhanced user interaction.</li>
            <li>Enabled multi-turn conversations with strong contextual awareness and decision-making capabilities.</li>
            <li>Developed using technologies such as Python, LangChain, OpenAI APIs, and vector databases for efficient information retrieval.</li>
        </ul>
    `,
    'ml-classification': `
        <h2>Machine Learning Classification Model</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="c327e36f-1b19-449b-9596-d45728aad397.png" alt="Machine Learning Classification Workflow">
        </div>
        <p>A machine learning classification model is a type of model used to predict categories (classes) instead of numeric values. It takes input data and assigns it to a predefined label.</p>
        
        <h3>🔹 Simple Meaning</h3>
        <p>It analyzes input data and classifies it into a specific category.</p>
        
        <p><strong>👉 Examples:</strong></p>
        <ul>
            <li>Email → Spam / Not Spam</li>
            <li>Expense → Food / Travel / Shopping</li>
            <li>Image → Cat / Dog / Human</li>
        </ul>

        <h3>🔹 How It Works</h3>
        <ul>
            <li>The model is trained using labeled data (training data).</li>
            <li>It learns patterns and relationships from the data.</li>
            <li>When new data is provided, it predicts the correct category.</li>
        </ul>

        <h3>🔹 Types of Classification</h3>
        <ul>
            <li><strong>Binary Classification:</strong> Two classes (e.g., Yes / No)</li>
            <li><strong>Multiclass Classification:</strong> More than two classes (e.g., expense categories)</li>
            <li><strong>Multilabel Classification:</strong> Multiple labels at the same time (e.g., image with “cat + dog”)</li>
        </ul>

        <h3>🔹 Common Algorithms</h3>
        <p>Logistic Regression, Decision Tree, Random Forest, Support Vector Machine (SVM), K-Nearest Neighbors (KNN), Neural Networks.</p>

        <h3>🔹 Real-Life Use Cases</h3>
        <ul>
            <li>Spam detection (Email systems)</li>
            <li>Fraud detection (Banking)</li>
            <li>Medical diagnosis</li>
            <li>Recommendation systems</li>
            <li>AI Expense Tracker (expense classification)</li>
        </ul>
    `
};

function openProjectModal(projectId, event) {
    if(event) event.preventDefault();
    if(projectData[projectId]) {
        modalBody.innerHTML = projectData[projectId];
        if(modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        }
    }
}

if(closeModal) {
    closeModal.onclick = function() {
        if(modal) modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

const certData = {
    'agentic-ai-cert': `
        <h2>Agentic AI: From Learner to Builder</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="ibm certifiacte agentic ai_page-0001.jpg" alt="Agentic AI Certificate">
        </div>
        <p>Successfully completed a certification program focused on building advanced Agentic AI systems. The program covered the fundamentals of Large Language Models (LLMs), agent-based architectures, and the real-world implementation of autonomous AI systems.</p>
        <ul>
            <li>Learned how to design and develop AI agents capable of reasoning, planning, and executing tasks.</li>
            <li>Gained hands-on experience with tools such as Python, LangChain, and OpenAI APIs.</li>
            <li>Built intelligent systems that can interact with external tools and APIs for real-time task execution.</li>
            <li>Explored concepts including memory management, multi-step reasoning, and decision-making in AI agents.</li>
            <li>Developed practical projects demonstrating end-to-end AI agent workflows.</li>
        </ul>
    `,
    'oracle-ai-cert': `
        <h2>OCI 2025: AI Foundations Associate</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="1769219189670.jpeg" alt="Oracle AI Certificate">
        </div>
        <p>Successfully earned the Oracle Cloud Infrastructure (OCI) 2025 Certified AI Foundations Associate certification, demonstrating a strong understanding of core artificial intelligence concepts and their application on cloud platforms.</p>
        <ul>
            <li>Gained knowledge of fundamental AI and Machine Learning concepts, including supervised and unsupervised learning.</li>
            <li>Learned about key AI services and tools available in Oracle Cloud Infrastructure (OCI).</li>
            <li>Developed an understanding of data preprocessing, model training, and evaluation techniques.</li>
            <li>Explored real-world AI use cases and cloud-based deployment strategies.</li>
            <li>Strengthened knowledge of responsible AI practices and ethical considerations.</li>
        </ul>
    `,
    'ibm-skillsbuild-cert': `
        <h2>IBM SkillsBuild: Mastering Data with ML</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="Internship prince Completion Certificate -  IBM SkillsBuild AI ML Internship_page-0001 (1).jpg" alt="IBM SkillsBuild Certificate">
        </div>
        <p>Successfully completed the IBM SkillsBuild certification program focused on mastering data analysis and machine learning techniques. This program provided practical knowledge of working with data and building intelligent models for real-world applications.</p>
        <ul>
            <li>Learned key concepts of data analysis, data preprocessing, and data visualization.</li>
            <li>Gained hands-on experience with machine learning algorithms and model building.</li>
            <li>Worked on real-world datasets to extract insights and make data-driven decisions.</li>
            <li>Explored supervised and unsupervised learning techniques.</li>
            <li>Developed practical skills in Python and AI/ML tools for data-driven applications.</li>
        </ul>
    `,
    'google-analytics-cert': `
        <h2>Google Analytics Certification</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="1770402028043.jpeg" alt="Google Analytics Certificate">
        </div>
        <p>Successfully completed the Google Analytics Certification, demonstrating a strong understanding of web analytics, user behavior tracking, and data-driven decision-making.</p>
        <ul>
            <li>Learned how to analyze website traffic and user interactions using Google Analytics tools.</li>
            <li>Gained knowledge of tracking metrics such as sessions, users, bounce rate, and conversions.</li>
            <li>Developed skills in creating reports and dashboards for data analysis and insights.</li>
            <li>Understood audience segmentation and behavior analysis to improve user experience.</li>
            <li>Applied data-driven strategies to optimize website performance and marketing campaigns.</li>
        </ul>
    `,
    'aws-cert': `
        <h2>AWS Training and Certification</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="1770567795180.jpeg" alt="AWS Certificate 1" style="margin-bottom: 1rem;">
            <img src="1770567809316.jpeg" alt="AWS Certificate 2">
        </div>
        <p>Successfully completed AWS Training and Certification programs, gaining foundational and practical knowledge of cloud computing and Amazon Web Services (AWS).</p>
        <ul>
            <li>Learned core cloud concepts including compute, storage, networking, and security in AWS.</li>
            <li>Gained hands-on experience with AWS services such as EC2, S3, and IAM.</li>
            <li>Developed an understanding of deploying and managing applications on the cloud.</li>
            <li>Explored best practices for scalability, reliability, and cost optimization in cloud environments.</li>
            <li>Strengthened knowledge of cloud architecture and real-world deployment strategies.</li>
        </ul>
    `,
    'gcp-cert': `
        <h2>Google Cloud Certification (Simplilearn)</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="1775372793210.jpeg" alt="Google Cloud Certificate 1" style="margin-bottom: 1rem;">
            <img src="1774806317472.jpeg" alt="Google Cloud Certificate 2">
        </div>
        <p>Successfully completed the Google Cloud Certification program in collaboration with Simplilearn, gaining in-depth knowledge of cloud computing concepts and hands-on experience with Google Cloud Platform (GCP). This certification strengthened my ability to design, deploy, and manage scalable applications in a cloud environment.</p>
        <ul>
            <li>Developed a strong understanding of core cloud computing concepts such as compute, storage, networking, and security.</li>
            <li>Gained hands-on experience with key Google Cloud services including Compute Engine, Cloud Storage, BigQuery, and IAM.</li>
            <li>Learned how to deploy, manage, and monitor applications on the Google Cloud Platform.</li>
            <li>Explored data analytics and machine learning capabilities within GCP for building intelligent solutions.</li>
            <li>Understood best practices for cloud architecture, scalability, performance optimization, and cost management.</li>
            <li>Implemented real-world use cases involving cloud deployment and data processing workflows.</li>
            <li>Strengthened knowledge of cloud security, identity management, and access control mechanisms.</li>
        </ul>
    `,
    'hp-life-cert': `
        <h2>HP LIFE: Data Science Certification</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="1755014606439.jpeg" alt="HP LIFE Data Science Certificate">
        </div>
        <p>Successfully completed the HP LIFE Data Science Certification program, gaining foundational and practical knowledge in data science concepts and real-world applications.</p>
        <ul>
            <li>Learned core concepts of data science, including data collection, cleaning, and analysis.</li>
            <li>Gained understanding of data visualization techniques to present insights effectively.</li>
            <li>Developed knowledge of basic statistical methods and data-driven decision-making.</li>
            <li>Explored real-world applications of data science across different industries.</li>
            <li>Strengthened problem-solving skills using data analysis approaches.</li>
        </ul>
    `,
    'cyber-security-cert': `
        <h2>Cyber Security Certification</h2>
        <div class="modal-image-container" style="margin-top: 0; margin-bottom: 1.5rem;">
            <img src="1749494575255.jpeg" alt="Cyber Security Certificate">
        </div>
        <p>Successfully completed a Cyber Security certification program, gaining essential knowledge and practical skills in protecting systems, networks, and data from cyber threats.</p>
        <ul>
            <li>Learned core concepts of cybersecurity, including threats, vulnerabilities, and risk management.</li>
            <li>Gained understanding of network security, encryption, and secure communication protocols.</li>
            <li>Explored common cyber attacks such as phishing, malware, and social engineering.</li>
            <li>Developed knowledge of security best practices and data protection techniques.</li>
            <li>Understood the importance of ethical hacking and system security monitoring.</li>
        </ul>
    `
};

function openCertModal(certId, event) {
    if(event) event.preventDefault();
    if(certData[certId]) {
        modalBody.innerHTML = certData[certId];
        if(modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
}

// Contact Form Submission Handler
async function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);

        const response = await fetch('https://formspree.io/f/mpqbwgwe', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formStatus.textContent = 'Thank you! Your message has been sent successfully. Please check your email for a confirmation from Formspree if this is the first time.';
            formStatus.style.color = 'var(--accent-cyan)';
            document.getElementById('contactForm').reset();
        } else {
            formStatus.textContent = 'Oops! Something went wrong. Please check if your internet is working or try again later.';
            formStatus.style.color = 'var(--accent-pink)';
        }
        formStatus.style.display = 'block';
    } catch (error) {
        console.error('Error submitting form:', error);
        formStatus.textContent = 'Error connecting to the server. Please try again later.';
        formStatus.style.color = 'var(--accent-pink)';
        formStatus.style.display = 'block';
    } finally {
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        submitBtn.disabled = false;
        
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}
