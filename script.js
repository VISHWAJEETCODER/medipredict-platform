// ===== Initialize AOS (Animate On Scroll) - Bidirectional =====
AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: false,  // Animation triggers both on scroll down AND up
    mirror: true, // Repeat animation when scrolling past element
    offset: 100,
    anchorPlacement: 'top-bottom'
});

// ===== Theme Toggle Functionality =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save theme preference
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    
    // Smooth transition effect
    body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 500);
});

// ===== Colorful Cursor Sparks Effect =====
const sparksContainer = document.getElementById('cursor-sparks');
const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#fa709a', '#fee140', '#30cfd0'];
let sparkCount = 0;

document.addEventListener('mousemove', (e) => {
    // Create spark every few pixels moved
    if (sparkCount % 3 === 0) {
        createSpark(e.clientX, e.clientY);
    }
    sparkCount++;
});

function createSpark(x, y) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    
    // Random color from array
    const color = colors[Math.floor(Math.random() * colors.length)];
    spark.style.backgroundColor = color;
    spark.style.boxShadow = `0 0 10px ${color}`;
    
    // Random position offset
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    
    // Random movement
    spark.style.setProperty('--tx', `${offsetX}px`);
    spark.style.setProperty('--ty', `${offsetY}px`);
    
    sparksContainer.appendChild(spark);
    
    // Remove after animation
    setTimeout(() => {
        spark.remove();
    }, 800);
}

// ===== Particles Canvas Animation =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = body.classList.contains('dark-mode') 
            ? 'rgba(15, 23, 42, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = body.classList.contains('dark-mode') 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Active Nav Link =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.style.color = body.classList.contains('dark-mode') ? '#94a3b8' : '#64748b';
            });
            if (navLink) {
                navLink.style.color = body.classList.contains('dark-mode') ? '#60a5fa' : '#667eea';
            }
        }
    });
});

// ===== Counter Animation =====
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target.querySelector('.counter');
            if (counter && !counter.classList.contains('counted')) {
                animateCounter(counter);
                counter.classList.add('counted');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-card').forEach(card => {
    observer.observe(card);
});

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ===== Form Input Animations =====
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ===== Form Submission =====
document.getElementById('predictForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        authority: document.getElementById('authority').value,
        course: document.getElementById('course').value,
        rankType: document.getElementById('rankType').value,
        quota: document.getElementById('quota').value,
        category: document.getElementById('category').value,
        gender: document.getElementById('gender').value,
        rank: document.getElementById('rank').value,
        domicile: document.getElementById('domicile').value
    };

    // Validate
    if (!formData.authority || !formData.course || !formData.rankType || 
        !formData.quota || !formData.category || !formData.gender || !formData.rank) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }

    // Button loading
    const btn = this.querySelector('.btn-predict');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');
    const originalText = btnText.textContent;
    
    btnText.textContent = 'Analyzing Your Data...';
    btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.style.opacity = '0.8';
    btn.disabled = true;

    // Simulate processing
    setTimeout(() => {
        generateResults(formData);
        
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.add('active');
        
        btnText.textContent = originalText;
        btnIcon.innerHTML = '<i class="fas fa-brain"></i>';
        btn.style.opacity = '1';
        btn.disabled = false;

        showNotification('Predictions generated successfully!', 'success');

        setTimeout(() => {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }, 2000);
});

// ===== Generate Results =====
function generateResults(formData) {
    const resultsContainer = document.getElementById('collegeResults');
    const rank = parseInt(formData.rank);
    
    const colleges = [
        {
            name: 'All India Institute of Medical Sciences (AIIMS) Delhi',
            state: 'Delhi',
            type: 'Central Government',
            fees: '₹5,856/year',
            seats: '125',
            lastRank: 50
        },
        {
            name: 'Maulana Azad Medical College (MAMC) Delhi',
            state: 'Delhi',
            type: 'State Government',
            fees: '₹25,000/year',
            seats: '250',
            lastRank: 600
        },
        {
            name: 'Lady Hardinge Medical College Delhi',
            state: 'Delhi',
            type: 'State Government',
            fees: '₹25,000/year',
            seats: '142',
            lastRank: 800
        },
        {
            name: 'Grant Medical College Mumbai',
            state: 'Maharashtra',
            type: 'State Government',
            fees: '₹30,000/year',
            seats: '260',
            lastRank: 1500
        },
        {
            name: 'Armed Forces Medical College (AFMC) Pune',
            state: 'Maharashtra',
            type: 'Central Government',
            fees: '₹9,000/year',
            seats: '140',
            lastRank: 200
        },
        {
            name: 'King George Medical University Lucknow',
            state: 'Uttar Pradesh',
            type: 'State Government',
            fees: '₹48,000/year',
            seats: '250',
            lastRank: 2000
        },
        {
            name: 'Institute of Medical Sciences BHU Varanasi',
            state: 'Uttar Pradesh',
            type: 'Central Government',
            fees: '₹10,000/year',
            seats: '170',
            lastRank: 500
        },
        {
            name: 'Patna Medical College',
            state: 'Bihar',
            type: 'State Government',
            fees: '₹48,000/year',
            seats: '150',
            lastRank: 5000
        },
        {
            name: 'Christian Medical College (CMC) Vellore',
            state: 'Tamil Nadu',
            type: 'Private',
            fees: '₹5,50,000/year',
            seats: '100',
            lastRank: 100
        },
        {
            name: 'Kasturba Medical College Manipal',
            state: 'Karnataka',
            type: 'Deemed University',
            fees: '₹19,50,000/year',
            seats: '250',
            lastRank: 10000
        }
    ];

    colleges.forEach(college => {
        college.chance = calculateChance(rank, college.lastRank);
    });
    colleges.sort((a, b) => b.chance - a.chance);

    let html = '';
    
    colleges.forEach((college, index) => {
        const chanceClass = college.chance >= 75 ? 'high-chance' : 
                           college.chance >= 50 ? 'medium-chance' : 'low-chance';
        const chanceText = college.chance >= 75 ? 'High Chance' : 
                          college.chance >= 50 ? 'Medium Chance' : 'Low Chance';

        html += `
            <div class="college-card-result" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="college-result-header">
                    <div class="college-name">${college.name}</div>
                    <div class="chance-badge ${chanceClass}">
                        ${chanceText} - ${college.chance}%
                    </div>
                </div>
                <div class="college-details">
                    <span><i class="fas fa-map-marker-alt"></i> ${college.state}</span>
                    <span><i class="fas fa-building"></i> ${college.type}</span>
                    <span><i class="fas fa-rupee-sign"></i> ${college.fees}</span>
                    <span><i class="fas fa-users"></i> ${college.seats} Seats</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <small style="color: #64748b;">
                        Last Year Closing Rank: <strong style="color: var(--primary)">${college.lastRank.toLocaleString()}</strong> | 
                        Your Rank: <strong style="color: var(--dark)">${rank.toLocaleString()}</strong>
                    </small>
                </div>
                <div class="probability-bar">
                    <div class="probability-fill" style="width: ${college.chance}%"></div>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = html;

    // Refresh AOS for new elements
    setTimeout(() => {
        AOS.refresh();
    }, 100);
}

// ===== Calculate Chance =====
function calculateChance(userRank, collegeLastRank) {
    const difference = userRank - collegeLastRank;
    
    if (difference <= -1000) {
        return Math.min(98, 90 + Math.floor(Math.random() * 8));
    } else if (difference <= 0) {
        return Math.floor(75 + Math.random() * 20);
    } else if (difference <= 1000) {
        return Math.floor(60 + Math.random() * 15);
    } else if (difference <= 3000) {
        return Math.floor(45 + Math.random() * 15);
    } else if (difference <= 5000) {
        return Math.floor(30 + Math.random() * 15);
    } else {
        return Math.floor(10 + Math.random() * 20);
    }
}

// ===== Notification System =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 3s forwards;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notifStyle);

// ===== Contact Form =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    showNotification('Message sent successfully! We will get back to you soon.', 'success');
    this.reset();
});

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < 800) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 800);
    }
});

// ===== Button Ripple Effect =====
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple-effect 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '70px';
            navMenu.style.right = '20px';
            navMenu.style.background = body.classList.contains('dark-mode') 
                ? 'rgba(15, 23, 42, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
            navMenu.style.padding = '20px';
            navMenu.style.borderRadius = '15px';
            navMenu.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
        }
    });
}

// ===== Refresh AOS on Dynamic Content =====
setInterval(() => {
    AOS.refresh();
}, 1000);

// ===== Console Art =====
console.log('%c🎓 MediPredict', 'color: #667eea; font-size: 48px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
console.log('%c✨ ULTIMATE ANIMATED VERSION 3.0', 'color: #764ba2; font-size: 20px; font-weight: bold;');
console.log('%c🌓 Dark/Light Theme Toggle', 'color: #10b981; font-size: 14px;');
console.log('%c🎨 Colorful Cursor Sparks + Glowing Text in Dark Mode', 'color: #f59e0b; font-size: 14px;');
console.log('%c🔄 Bidirectional Scroll Animations', 'color: #60a5fa; font-size: 14px;');

// ===== Easter Egg =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.animation = 'rainbow-effect 2s linear infinite';
        showNotification('🎉 Secret Unlocked! Good luck with NEET!', 'success');
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow-effect {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// ===== Download Button =====
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-download')) {
        showNotification('Download feature coming soon!', 'success');
    }
});

console.log('%c🎮 Try the Konami Code Easter Egg!', 'color: #f093fb; font-size: 12px; font-style: italic;');
console.log('%c💡 Press the theme toggle button (bottom-right) to switch themes!', 'color: #4facfe; font-size: 12px;');
