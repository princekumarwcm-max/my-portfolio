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

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
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
const titles = ['AI Developer', 'Software Engineer', 'Web Designer', 'Tech Enthusiast'];
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
