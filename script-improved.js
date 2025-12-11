// Portfolio Page JavaScript - Improved API Version with Better Sync Detection

// Global data variables
let portfolioData = [];
let servicesData = [];
let aboutData = {};
let contactData = {};
let settingsData = {};
let imagesData = {};
let API_BASE_URL = window.location.origin;
let syncInterval = null;
let isRefreshing = false;
let lastRefreshTime = 0;
const REFRESH_COOLDOWN = 2000; // 2 seconds between refreshes

// Initialize portfolio when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Portfolio page initializing...');
    
    // Clean up any existing intervals/timeouts
    cleanupExistingTimers();
    
    try {
        // Load data from API
        await loadData();
        
        // Update content with loaded data
        updatePortfolioContent();
        updatePortfolioGrid();
        updateServicesSection();
        
        // Bind events for dynamic content
        bindPortfolioEvents();
        
        console.log('Portfolio page initialization completed');
        
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

// Cleanup function to prevent conflicts
function cleanupExistingTimers() {
    if (window.visibilityTimeout) {
        clearTimeout(window.visibilityTimeout);
        window.visibilityTimeout = null;
    }
    if (window.focusTimeout) {
        clearTimeout(window.focusTimeout);
        window.focusTimeout = null;
    }
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
    console.log('Cleaned up existing timers');
}

// Refresh data when page becomes visible again (e.g., when user returns from admin panel)
document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
        console.log('Page became visible, refreshing data...');
        // Use a debounced refresh to prevent too frequent updates
        clearTimeout(window.visibilityTimeout);
        window.visibilityTimeout = setTimeout(async () => {
            await refreshPageData();
        }, 800);
    }
});

// Also refresh data when window gets focus (in case visibilitychange doesn't work)
window.addEventListener('focus', async () => {
    console.log('Window got focus, refreshing data...');
    // Use a debounced refresh to prevent too frequent updates
    clearTimeout(window.focusTimeout);
    window.focusTimeout = setTimeout(async () => {
        await refreshPageData();
    }, 1500);
});

// API Service Functions
const apiService = {
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
            return null; // Return null instead of throwing
        }
    },

    async getAllData() {
        const result = await this.request('/data');
        return result;
    },

    async getPortfolio() {
        const result = await this.request('/portfolio');
        return result;
    },

    async getServices() {
        const result = await this.request('/services');
        return result;
    },

    async getAbout() {
        const result = await this.request('/about');
        return result;
    },

    async getContact() {
        const result = await this.request('/contact');
        return result;
    },

    async getSettings() {
        const result = await this.request('/settings');
        return result;
    },

    async getImages() {
        const result = await this.request('/images');
        return result;
    }
};

// Fallback data functions
function getDefaultPortfolio() {
    return [
        { id: 1, title: 'Brand Identity Project', description: 'Complete brand identity for a tech startup', category: 'branding', image: 'fas fa-image' },
        { id: 2, title: 'Logo Design Collection', description: 'Modern logo designs for various industries', category: 'logo', image: 'fas fa-cube' },
        { id: 3, title: 'Print Design Campaign', description: 'Marketing materials and print advertisements', category: 'print', image: 'fas fa-print' },
        { id: 4, title: 'Digital Design Portfolio', description: 'Web and mobile app design projects', category: 'digital', image: 'fas fa-laptop' },
        { id: 5, title: 'Corporate Branding', description: 'Brand identity for corporate clients', category: 'branding', image: 'fas fa-briefcase' },
        { id: 6, title: 'Creative Logo Series', description: 'Innovative logo designs and concepts', category: 'logo', image: 'fas fa-star' }
    ];
}

function getDefaultServices() {
    return [
        { id: 1, title: 'Brand Identity', description: 'Complete brand identity design including logo, color palette, typography, and brand guidelines.', icon: 'fas fa-palette' },
        { id: 2, title: 'Logo Design', description: 'Custom logo design that captures your brand\'s essence and stands out in the market.', icon: 'fas fa-vector-square' },
        { id: 3, title: 'Print Design', description: 'Professional print materials including brochures, business cards, posters, and marketing collateral.', icon: 'fas fa-print' },
        { id: 4, title: 'Digital Design', description: 'Modern web and mobile app design with focus on user experience and visual appeal.', icon: 'fas fa-mobile-alt' }
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

// Load data with retry logic and better error handling
async function loadData() {
    try {
        console.log('Loading data from API...');
        
        // Load all data in parallel with error handling for each
        const results = await Promise.allSettled([
            apiService.getPortfolio(),
            apiService.getServices(),
            apiService.getAbout(),
            apiService.getContact(),
            apiService.getSettings(),
            apiService.getImages()
        ]);

        const [portfolioResult, servicesResult, aboutResult, contactResult, settingsResult, imagesResult] = results;

        // Update global variables with API data (fallback to defaults if API fails)
        portfolioData = portfolioResult.status === 'fulfilled' ? (portfolioResult.value || getDefaultPortfolio()) : getDefaultPortfolio();
        servicesData = servicesResult.status === 'fulfilled' ? (servicesResult.value || getDefaultServices()) : getDefaultServices();
        aboutData = aboutResult.status === 'fulfilled' ? (aboutResult.value || getDefaultAbout()) : getDefaultAbout();
        contactData = contactResult.status === 'fulfilled' ? (contactResult.value || getDefaultContact()) : getDefaultContact();
        settingsData = settingsResult.status === 'fulfilled' ? (settingsResult.value || getDefaultSettings()) : getDefaultSettings();
        imagesData = imagesResult.status === 'fulfilled' ? (imagesResult.value || getDefaultImages()) : getDefaultImages();
        
        console.log('Data loaded successfully:', {
            portfolio: portfolioData.length,
            services: servicesData.length,
            hasAbout: !!aboutData.name,
            hasContact: !!contactData.email,
            apiResults: results.map(r => r.status)
        });
        
    } catch (error) {
        console.error('Failed to load data from API:', error);
        // Fallback to default data
        console.log('Using fallback data...');
        loadDefaultData();
    }
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
    console.log('Updating portfolio content...');
    console.log('About data:', aboutData);
    console.log('Contact data:', contactData);
    
    // Update navigation logo
    if (aboutData.name) {
        const logoElement = document.querySelector('.logo h2');
        if (logoElement) {
            logoElement.textContent = aboutData.name;
            console.log('Updated logo:', aboutData.name);
        } else {
            console.log('Logo element not found');
        }
    } else {
        console.log('No about data name found');
    }
    
    // Update hero section
    if (aboutData.name) {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            heroTitle.textContent = aboutData.profession || 'Creative Graphic Designer';
            document.title = `${aboutData.name} - Graphic Designer Portfolio`;
            console.log('Updated hero title:', heroTitle.textContent);
        }
    }
    
    if (aboutData.bio) {
        const heroBio = document.querySelector('.hero-content p');
        if (heroBio) {
            heroBio.textContent = aboutData.bio;
            console.log('Updated hero bio');
        }
    }
    
    // Update about section
    if (aboutData.name) {
        const aboutTitle = document.querySelector('.about-text h2');
        if (aboutTitle) {
            aboutTitle.textContent = 'About ' + aboutData.name;
            console.log('Updated about title');
        }
    }
    
    if (aboutData.bio) {
        const aboutBio = document.querySelector('.about-text p');
        if (aboutBio) {
            aboutBio.textContent = aboutData.bio;
            console.log('Updated about bio');
        }
    }
    
    // Update statistics
    if (aboutData.projects) {
        const projectsStat = document.querySelector('.about-stats .stat:first-child h3');
        if (projectsStat) {
            projectsStat.textContent = aboutData.projects + '+';
            console.log('Updated projects count');
        }
    }
    
    if (aboutData.clients) {
        const clientsStat = document.querySelector('.about-stats .stat:nth-child(2) h3');
        if (clientsStat) {
            clientsStat.textContent = aboutData.clients + '+';
            console.log('Updated clients count');
        }
    }
    
    if (aboutData.experience) {
        const experienceStat = document.querySelector('.about-stats .stat:last-child h3');
        if (experienceStat) {
            experienceStat.textContent = aboutData.experience + '+';
            console.log('Updated experience count');
        }
    }
    
    // Update contact information
    if (contactData.email) {
        const emailElement = document.querySelector('.contact-item:nth-child(1) span');
        if (emailElement) {
            emailElement.textContent = contactData.email;
            console.log('Updated email');
        }
    }
    
    if (contactData.phone) {
        const phoneElement = document.querySelector('.contact-item:nth-child(2) span');
        if (phoneElement) {
            phoneElement.textContent = contactData.phone;
            console.log('Updated phone');
        }
    }
    
    if (contactData.location) {
        const locationElement = document.querySelector('.contact-item:nth-child(3) span');
        if (locationElement) {
            locationElement.textContent = contactData.location;
            console.log('Updated location');
        }
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
            console.log('Updated footer');
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
    
    console.log('Portfolio content update completed');
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
    if (!heroImageContainer) {
        console.log('Hero image container not found');
        return;
    }
    
    console.log('Updating hero image with data:', imagesData.heroImage ? 'Image found' : 'No image');
    
    if (imagesData.heroImage) {
        heroImageContainer.innerHTML = `
            <img src="${imagesData.heroImage}" alt="Hero Image" class="hero-image-loaded" 
                 onload="console.log('Hero image loaded successfully')"
                 onerror="console.error('Hero image failed to load')">
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
    if (!heroSection) {
        console.log('Hero section not found');
        return;
    }
    
    const backgroundOpacity = imagesData.backgroundOpacity || '50';
    const opacityValue = parseInt(backgroundOpacity) / 100;
    
    console.log('Updating background with opacity:', backgroundOpacity, 'Has background:', !!imagesData.homeBackgroundImage);
    
    if (imagesData.homeBackgroundImage) {
        // Apply background image with overlay and opacity
        const backgroundStyle = `url(${imagesData.homeBackgroundImage}) center center / cover no-repeat, linear-gradient(135deg, rgba(245, 247, 250, ${1 - opacityValue}) 0%, rgba(195, 207, 226, ${1 - opacityValue}) 100%)`;
        heroSection.style.background = backgroundStyle;
        heroSection.style.backgroundBlendMode = 'overlay';
        console.log('Applied background image with custom styling');
    } else {
        // Reset to default gradient
        heroSection.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        heroSection.style.backgroundBlendMode = 'normal';
        console.log('Applied default gradient background');
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
    console.log('Portfolio grid updated with', portfolioData.length, 'items');
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
    console.log('Services section updated with', servicesData.length, 'services');
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
    
    // Portfolio item click handlers (simplified for now)
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('This is a demo project. In a real portfolio, this would show detailed project information.');
        });
    });
}

// Manual sync function for immediate updates
async function forceSyncNow() {
    console.log('Manual sync triggered...');
    try {
        const newData = await apiService.getAllData();
        if (newData) {
            portfolioData = newData.portfolio || portfolioData;
            servicesData = newData.services || servicesData;
            aboutData = newData.about || aboutData;
            contactData = newData.contact || contactData;
            settingsData = newData.settings || settingsData;
            imagesData = newData.images || imagesData;
            
            // Update UI with slight delay to ensure data is properly set
            setTimeout(() => {
                updatePortfolioContent();
                updatePortfolioGrid();
                updateServicesSection();
                console.log('Manual sync completed');
            }, 100);
            return true;
        }
    } catch (error) {
        console.error('Manual sync failed:', error);
        return false;
    }
}

// Centralized refresh function to prevent conflicts
async function refreshPageData() {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing) {
        console.log('Refresh already in progress, skipping...');
        return;
    }
    
    // Check cooldown period
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
        console.log('Refresh too recent, skipping...');
        return;
    }
    
    isRefreshing = true;
    lastRefreshTime = now;
    
    try {
        console.log('Starting page data refresh...');
        await loadData();
        
        // Update all content
        updatePortfolioContent();
        updatePortfolioGrid();
        updateServicesSection();
        
        // Specifically refresh images with additional logging
        console.log('Refreshing images specifically...');
        updateHeroImage();
        updateHomeBackground();
        
        console.log('Page data refreshed successfully with images');
    } catch (error) {
        console.error('Failed to refresh page data:', error);
    } finally {
        isRefreshing = false;
    }
}

// Make sync function globally available for testing
window.forceSyncNow = forceSyncNow;
window.refreshPageData = refreshPageData;

// Listen for storage events from admin panel
window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio_refresh') {
        console.log('Refresh triggered by admin panel');
        refreshPageData();
    }
});

// Force immediate refresh function for admin panel calls
window.forceRefreshNow = async function() {
    console.log('Force refresh called from admin panel');
    await refreshPageData();
};

// Rest of the original JavaScript for navigation, animations, etc.
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

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
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelectorAll('input[type="text"]')[1].value;
        const message = this.querySelector('textarea').value;
        
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
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

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.portfolio-item, .service-card, .about-content, .contact-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

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

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image .placeholder-image, .hero-image .hero-image-loaded');
    if (heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

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