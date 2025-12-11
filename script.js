// Global data variables
let portfolioData = [];
let servicesData = [];
let aboutData = {};
let contactData = {};
let settingsData = {};

// Load data from localStorage
function loadData() {
    // Load portfolio data
    const storedPortfolio = localStorage.getItem('portfolioData');
    if (storedPortfolio) {
        portfolioData = JSON.parse(storedPortfolio);
    }
    
    // Load services data
    const storedServices = localStorage.getItem('servicesData');
    if (storedServices) {
        servicesData = JSON.parse(storedServices);
    }
    
    // Load about data
    const storedAbout = localStorage.getItem('aboutData');
    if (storedAbout) {
        aboutData = JSON.parse(storedAbout);
    }
    
    // Load contact data
    const storedContact = localStorage.getItem('contactData');
    if (storedContact) {
        contactData = JSON.parse(storedContact);
    }
    
    // Load settings data
    const storedSettings = localStorage.getItem('settingsData');
    if (storedSettings) {
        settingsData = JSON.parse(storedSettings);
    }
}

// Update portfolio content dynamically
function updatePortfolioContent() {
    // Update navigation logo
    if (aboutData.name) {
        document.querySelector('.logo h2').textContent = aboutData.name;
    }
    
    // Update hero section
    if (aboutData.name) {
        document.querySelector('.hero-content h1').textContent = aboutData.profession || 'Creative Graphic Designer';
        document.title = `${aboutData.name} - Graphic Designer Portfolio`;
    }
    
    if (aboutData.bio) {
        document.querySelector('.hero-content p').textContent = aboutData.bio;
    }
    
    // Update about section
    if (aboutData.name) {
        document.querySelector('.about-text h2').textContent = 'About ' + aboutData.name;
    }
    
    if (aboutData.bio) {
        document.querySelector('.about-text p').textContent = aboutData.bio;
    }
    
    // Update statistics
    if (aboutData.projects) {
        document.querySelector('.about-stats .stat:first-child h3').textContent = aboutData.projects + '+';
    }
    
    if (aboutData.clients) {
        document.querySelector('.about-stats .stat:nth-child(2) h3').textContent = aboutData.clients + '+';
    }
    
    if (aboutData.experience) {
        document.querySelector('.about-stats .stat:last-child h3').textContent = aboutData.experience + '+';
    }
    
    // Update contact information
    if (contactData.email) {
        document.querySelector('.contact-item:nth-child(1) span').textContent = contactData.email;
    }
    
    if (contactData.phone) {
        document.querySelector('.contact-item:nth-child(2) span').textContent = contactData.phone;
    }
    
    if (contactData.location) {
        document.querySelector('.contact-item:nth-child(3) span').textContent = contactData.location;
    }
    
    // Update social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    if (contactData.behance && socialLinks[0]) {
        socialLinks[0].href = contactData.behance;
    }
    if (contactData.dribbble && socialLinks[1]) {
        socialLinks[1].href = contactData.dribbble;
    }
    if (contactData.instagram && socialLinks[2]) {
        socialLinks[2].href = contactData.instagram;
    }
    if (contactData.linkedin && socialLinks[3]) {
        socialLinks[3].href = contactData.linkedin;
    }
    
    // Update footer
    if (aboutData.name) {
        const currentYear = new Date().getFullYear();
        document.querySelector('.footer p').textContent = `© ${currentYear} ${aboutData.name}. All rights reserved.`;
    }
    
    // Update skills section
    updateSkillsSection();
    
    // Update hero image
    updateHeroImage();
    
    // Update home background
    updateHomeBackground();
    
    // Restart counter animation after updating content
    setTimeout(animateCounters, 100);
}

// Update skills section
function updateSkillsSection() {
    const skillsList = document.querySelector('.skill-list');
    if (!skillsList) return;
    
    // Clear existing skills
    skillsList.innerHTML = '';
    
    // Add skills from admin panel data
    if (aboutData.skills && aboutData.skills.length > 0) {
        aboutData.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-item';
            skillTag.textContent = skill;
            skillsList.appendChild(skillTag);
        });
    } else {
        // Default skills if none saved
        const defaultSkills = ['Brand Identity', 'Logo Design', 'Print Design', 'Digital Design', 'Adobe Creative Suite', 'Figma', 'UI/UX Design', 'Typography'];
        defaultSkills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-item';
            skillTag.textContent = skill;
            skillsList.appendChild(skillTag);
        });
    }
    
    // Re-apply animation to new skill items
    animateSkillItems();
}

// Update hero image
function updateHeroImage() {
    const heroImageContainer = document.getElementById('heroImageContainer');
    if (!heroImageContainer) return;
    
    const storedHeroImage = localStorage.getItem('heroImage');
    
    if (storedHeroImage) {
        heroImageContainer.innerHTML = `
            <img src="${storedHeroImage}" alt="Hero Image" class="hero-image-loaded">
        `;
    } else {
        // Show placeholder
        heroImageContainer.innerHTML = `
            <div class="placeholder-image">
                <i class="fas fa-palette"></i>
            </div>
        `;
    }
}

// Update hero section background
function updateHomeBackground() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const storedBackgroundImage = localStorage.getItem('homeBackgroundImage');
    const backgroundOpacity = localStorage.getItem('backgroundOpacity') || '50';
    const opacityValue = parseInt(backgroundOpacity) / 100;
    
    if (storedBackgroundImage) {
        // Apply background image with overlay and opacity
        heroSection.style.background = `url(${storedBackgroundImage}) center center / cover no-repeat, linear-gradient(135deg, rgba(245, 247, 250, ${1 - opacityValue}) 0%, rgba(195, 207, 226, ${1 - opacityValue}) 100%)`;
        heroSection.style.backgroundBlendMode = 'overlay';
    } else {
        // Reset to default gradient
        heroSection.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        heroSection.style.backgroundBlendMode = 'normal';
    }
}

// Animate skill items
function animateSkillItems() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Update portfolio grid with dynamic data
function updatePortfolioGrid() {
    if (portfolioData.length === 0) return;
    
    const portfolioGrid = document.querySelector('.portfolio-grid');
    portfolioGrid.innerHTML = '';
    
    portfolioData.forEach(project => {
        const portfolioItem = createPortfolioItem(project);
        portfolioGrid.appendChild(portfolioItem);
    });
    
    // Re-bind event listeners for new portfolio items
    bindPortfolioEvents();
}

// Create portfolio item element
function createPortfolioItem(project) {
    const portfolioItem = document.createElement('div');
    portfolioItem.className = 'portfolio-item';
    portfolioItem.setAttribute('data-category', project.category);
    
    portfolioItem.innerHTML = `
        <div class="portfolio-image">
            <div class="placeholder-image">
                <i class="${project.image || 'fas fa-image'}"></i>
            </div>
            <div class="portfolio-overlay">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <button class="view-project">View Project</button>
            </div>
        </div>
    `;
    
    return portfolioItem;
}

// Update services section
function updateServicesSection() {
    if (servicesData.length === 0) return;
    
    const servicesGrid = document.querySelector('.services-grid');
    servicesGrid.innerHTML = '';
    
    servicesData.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
}

// Create service card element
function createServiceCard(service) {
    const serviceCard = document.createElement('div');
    serviceCard.className = 'service-card';
    
    serviceCard.innerHTML = `
        <div class="service-icon">
            <i class="${service.icon}"></i>
        </div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
    `;
    
    return serviceCard;
}

// Counter Animation for Stats with admin data
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    
    counters.forEach(counter => {
        // Get target value from admin data or fallback to current text
        let target;
        if (aboutData.projects && counter.textContent.includes('Projects')) {
            target = parseInt(aboutData.projects) || 150;
        } else if (aboutData.clients && counter.textContent.includes('Clients')) {
            target = parseInt(aboutData.clients) || 50;
        } else if (aboutData.experience && counter.textContent.includes('Years')) {
            target = parseInt(aboutData.experience) || 5;
        } else {
            target = parseInt(counter.textContent.replace('+', '')) || 0;
        }
        
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Bind portfolio events after dynamic content update
function bindPortfolioEvents() {
    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
    
            const filterValue = button.getAttribute('data-filter');
    
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.classList.add('show');
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                    item.classList.remove('show');
                }
            });
        });
    });
    
    // Portfolio item click handlers
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const portfolioItem = this.closest('.portfolio-item');
            const projectTitle = portfolioItem.querySelector('h3').textContent;
            const projectDescription = portfolioItem.querySelector('p').textContent;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'project-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>${projectTitle}</h3>
                    <p>${projectDescription}</p>
                    <p>This is a demo project. In a real portfolio, this would show detailed project information, process images, and client testimonials.</p>
                    <button class="btn btn-primary close-modal">Close</button>
                </div>
            `;
            
            // Add modal styles
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 500px;
                margin: 0 20px;
                text-align: center;
                transform: scale(0.7);
                transition: transform 0.3s ease;
            `;
            
            document.body.appendChild(modal);
            
            // Animate modal in
            setTimeout(() => {
                modal.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
            
            // Close modal handlers
            const closeModal = () => {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.7)';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            };
            
            modal.querySelectorAll('.close-modal').forEach(btn => {
                btn.addEventListener('click', closeModal);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });
    });
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
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

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelectorAll('input[type="text"]')[1].value;
    const message = this.querySelector('textarea').value;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate form submission
    const submitButton = this.querySelector('.btn-primary');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.portfolio-item, .service-card, .about-content, .contact-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Active Navigation Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image .placeholder-image, .hero-image .hero-image-loaded');
    if (heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Typing Animation for Hero Text
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid #667eea';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    setTimeout(typeWriter, 500);
});

// Initialize portfolio when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load data from admin panel
    loadData();
    
    // Update content with loaded data
    updatePortfolioContent();
    updatePortfolioGrid();
    updateServicesSection();
    
    // Bind events for dynamic content
    bindPortfolioEvents();
    
    // Start counter animation when stats section is visible
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        
        statsObserver.observe(statsSection);
    }
});

// Listen for changes in localStorage (when admin panel updates data)
window.addEventListener('storage', (e) => {
    if (e.key === 'portfolioData' || e.key === 'servicesData' || 
        e.key === 'aboutData' || e.key === 'contactData' || e.key === 'settingsData' || 
        e.key === 'heroImage' || e.key === 'homeBackgroundImage' || e.key === 'backgroundOpacity') {
        // Reload data and update content
        loadData();
        updatePortfolioContent();
        updatePortfolioGrid();
        updateServicesSection();
        bindPortfolioEvents();
    }
});