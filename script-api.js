// Portfolio Page JavaScript - API Version for Cross-Device Synchronization

// Global data variables
let portfolioData = [];
let servicesData = [];
let aboutData = {};
let contactData = {};
let settingsData = {};
let imagesData = {};
let API_BASE_URL = window.location.origin; // Use current origin for API calls

// API Service Functions
const apiService = {
    // Generic fetch wrapper with error handling
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            // Return fallback data for main page to still work
            return null;
        }
    },

    // Data retrieval methods
    async getAllData() {
        return await this.request('/data');
    },

    async getPortfolio() {
        return await this.request('/portfolio');
    },

    async getServices() {
        return await this.request('/services');
    },

    async getAbout() {
        return await this.request('/about');
    },

    async getContact() {
        return await this.request('/contact');
    },

    async getSettings() {
        return await this.request('/settings');
    },

    async getImages() {
        return await this.request('/images');
    }
};

// Load data from API
async function loadData() {
    try {
        // Load all data in parallel
        const [portfolio, services, about, contact, settings, images] = await Promise.all([
            apiService.getPortfolio(),
            apiService.getServices(),
            apiService.getAbout(),
            apiService.getContact(),
            apiService.getSettings(),
            apiService.getImages()
        ]);

        // Update global variables with API data (fallback to defaults if API fails)
        portfolioData = portfolio || getDefaultPortfolio();
        servicesData = services || getDefaultServices();
        aboutData = about || getDefaultAbout();
        contactData = contact || getDefaultContact();
        settingsData = settings || getDefaultSettings();
        imagesData = images || getDefaultImages();
        
    } catch (error) {
        console.error('Failed to load data from API:', error);
        // Fallback to default data
        loadDefaultData();
    }
}

// Fallback data functions
function getDefaultPortfolio() {
    return [
        {
            id: 1,
            title: 'Brand Identity Project',
            description: 'Complete brand identity for a tech startup',
            category: 'branding',
            image: 'fas fa-image'
        },
        {
            id: 2,
            title: 'Logo Design Collection',
            description: 'Modern logo designs for various industries',
            category: 'logo',
            image: 'fas fa-cube'
        },
        {
            id: 3,
            title: 'Print Design Campaign',
            description: 'Marketing materials and print advertisements',
            category: 'print',
            image: 'fas fa-print'
        },
        {
            id: 4,
            title: 'Digital Design Portfolio',
            description: 'Web and mobile app design projects',
            category: 'digital',
            image: 'fas fa-laptop'
        },
        {
            id: 5,
            title: 'Corporate Branding',
            description: 'Brand identity for corporate clients',
            category: 'branding',
            image: 'fas fa-briefcase'
        },
        {
            id: 6,
            title: 'Creative Logo Series',
            description: 'Innovative logo designs and concepts',
            category: 'logo',
            image: 'fas fa-star'
        }
    ];
}

function getDefaultServices() {
    return [
        {
            id: 1,
            title: 'Brand Identity',
            description: 'Complete brand identity design including logo, color palette, typography, and brand guidelines.',
            icon: 'fas fa-palette'
        },
        {
            id: 2,
            title: 'Logo Design',
            description: 'Custom logo design that captures your brand\'s essence and stands out in the market.',
            icon: 'fas fa-vector-square'
        },
        {
            id: 3,
            title: 'Print Design',
            description: 'Professional print materials including brochures, business cards, posters, and marketing collateral.',
            icon: 'fas fa-print'
        },
        {
            id: 4,
            title: 'Digital Design',
            description: 'Modern web and mobile app design with focus on user experience and visual appeal.',
            icon: 'fas fa-mobile-alt'
        }
    ];
}

function getDefaultAbout() {
    return {
        name: 'Alex Chen',
        profession: 'Creative Graphic Designer',
        bio: 'Hello! I\'m Alex Chen, a passionate graphic designer with over 5 years of experience creating compelling visual identities, branding solutions, and digital experiences. I believe in the power of design to communicate, inspire, and transform.',
        projects: '150',
        clients: '50',
        experience: '5',
        skills: ['Brand Identity', 'Logo Design', 'Print Design', 'Digital Design', 'Adobe Creative Suite', 'Figma', 'UI/UX Design', 'Typography']
    };
}

function getDefaultContact() {
    return {
        email: 'alex.chen@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        behance: '',
        dribbble: '',
        instagram: '',
        linkedin: ''
    };
}

function getDefaultSettings() {
    return {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        portfolioTitle: 'Alex Chen - Graphic Designer Portfolio',
        portfolioDescription: 'A modern, responsive portfolio showcasing creative graphic design work and branding solutions.'
    };
}

function getDefaultImages() {
    return {
        heroImage: null,
        homeBackgroundImage: null,
        backgroundOpacity: '50'
    };
}

function loadDefaultData() {
    portfolioData = getDefaultPortfolio();
    servicesData = getDefaultServices();
    aboutData = getDefaultAbout();
    contactData = getDefaultContact();
    settingsData = getDefaultSettings();
    imagesData = getDefaultImages();
}

// Update portfolio content dynamically
function updatePortfolioContent() {
    // Update navigation logo
    if (aboutData.name) {
        const logoElement = document.querySelector('.logo h2');
        if (logoElement) logoElement.textContent = aboutData.name;
    }
    
    // Update hero section
    if (aboutData.name) {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            heroTitle.textContent = aboutData.profession || 'Creative Graphic Designer';
            document.title = `${aboutData.name} - Graphic Designer Portfolio`;
        }
    }
    
    if (aboutData.bio) {
        const heroBio = document.querySelector('.hero-content p');
        if (heroBio) heroBio.textContent = aboutData.bio;
    }
    
    // Update about section
    if (aboutData.name) {
        const aboutTitle = document.querySelector('.about-text h2');
        if (aboutTitle) aboutTitle.textContent = 'About ' + aboutData.name;
    }
    
    if (aboutData.bio) {
        const aboutBio = document.querySelector('.about-text p');
        if (aboutBio) aboutBio.textContent = aboutData.bio;
    }
    
    // Update statistics
    if (aboutData.projects) {
        const projectsStat = document.querySelector('.about-stats .stat:first-child h3');
        if (projectsStat) projectsStat.textContent = aboutData.projects + '+';
    }
    
    if (aboutData.clients) {
        const clientsStat = document.querySelector('.about-stats .stat:nth-child(2) h3');
        if (clientsStat) clientsStat.textContent = aboutData.clients + '+';
    }
    
    if (aboutData.experience) {
        const experienceStat = document.querySelector('.about-stats .stat:last-child h3');
        if (experienceStat) experienceStat.textContent = aboutData.experience + '+';
    }
    
    // Update contact information
    if (contactData.email) {
        const emailElement = document.querySelector('.contact-item:nth-child(1) span');
        if (emailElement) emailElement.textContent = contactData.email;
    }
    
    if (contactData.phone) {
        const phoneElement = document.querySelector('.contact-item:nth-child(2) span');
        if (phoneElement) phoneElement.textContent = contactData.phone;
    }
    
    if (contactData.location) {
        const locationElement = document.querySelector('.contact-item:nth-child(3) span');
        if (locationElement) locationElement.textContent = contactData.location;
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
        const footerElement = document.querySelector('.footer p');
        if (footerElement) {
            footerElement.textContent = `© ${currentYear} ${aboutData.name}. All rights reserved.`;
        }
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
    
    if (imagesData.heroImage) {
        heroImageContainer.innerHTML = `
            <img src="${imagesData.heroImage}" alt="Hero Image" class="hero-image-loaded">
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
    
    const backgroundOpacity = imagesData.backgroundOpacity || '50';
    const opacityValue = parseInt(backgroundOpacity) / 100;
    
    if (imagesData.homeBackgroundImage) {
        // Apply background image with overlay and opacity
        heroSection.style.background = `url(${imagesData.homeBackgroundImage}) center center / cover no-repeat, linear-gradient(135deg, rgba(245, 247, 250, ${1 - opacityValue}) 0%, rgba(195, 207, 226, ${1 - opacityValue}) 100%)`;
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
    if (!portfolioGrid) return;
    
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
    if (!servicesGrid) return;
    
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

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

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
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
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
}

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
    if (heroTitle) {
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
    }
});

// Initialize portfolio when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load data from API
        await loadData();
        
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
    } catch (error) {
        console.error('Failed to initialize portfolio:', error);
        // Fallback to default data if API fails
        loadDefaultData();
        updatePortfolioContent();
        updatePortfolioGrid();
        updateServicesSection();
        bindPortfolioEvents();
    }
});