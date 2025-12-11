// Admin Panel JavaScript - Fallback Version for Testing
// This version works without server initially for testing login

// Global variables
let currentUser = null;
let portfolioData = [];
let servicesData = [];
let isEditing = false;
let currentEditId = null;

// Check if server is available
async function checkServerConnection() {
    try {
        const response = await fetch('/api/health');
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Simple fallback authentication for testing
function fallbackLogin(username, password) {
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', username);
        return true;
    }
    return false;
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

// Initialize function
async function initializeAdminPanel() {
    const serverAvailable = await checkServerConnection();
    
    if (serverAvailable) {
        // Server is available, use API version
        console.log('Server detected, switching to API mode');
        loadScript('admin-script-api.js');
    } else {
        // Server not available, use fallback mode
        console.log('Server not detected, using fallback mode');
        initializeFallbackMode();
    }
}

// Load script dynamically
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
        console.log('API script loaded successfully');
        // Reinitialize with API script
        if (window.initializeAPIAdmin) {
            window.initializeAPIAdmin();
        }
    };
    script.onerror = () => {
        console.error('Failed to load API script, using fallback');
        initializeFallbackMode();
    };
    document.head.appendChild(script);
}

// Fallback initialization (works without server)
function initializeFallbackMode() {
    checkAuthentication();
    setupEventListeners();
    loadStoredData();
    renderPortfolioGrid();
    renderServicesList();
    updateDashboardStats();
    bindSkillDeleteEvents();
    
    // Show notification about server mode
    showMessage('Running in offline mode. Start server for cross-device sync.', 'info');
}

// Authentication
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
        currentUser = localStorage.getItem('adminUser');
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
}

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Tab navigation
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', handleTabSwitch);
    });
    
    // Form submissions
    document.getElementById('aboutForm').addEventListener('submit', handleAboutSave);
    document.getElementById('contactForm').addEventListener('submit', handleContactSave);
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSave);
    
    // Skills management
    document.getElementById('addSkillBtn').addEventListener('click', addSkill);
    
    // Portfolio management
    document.getElementById('addProjectBtn').addEventListener('click', () => openProjectModal());
    document.getElementById('projectForm').addEventListener('submit', handleProjectSave);
    
    // Services management
    document.getElementById('addServiceBtn').addEventListener('click', () => openServiceModal());
    document.getElementById('serviceForm').addEventListener('submit', handleServiceSave);
    
    // Quick actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });
    
    // Modal close handlers
    document.querySelectorAll('.close, .modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Color picker
    document.getElementById('applyColors').addEventListener('click', applyColorScheme);
    
    // Hero image upload
    document.getElementById('heroImage').addEventListener('change', handleHeroImageUpload);
    document.getElementById('removeHeroImageBtn').addEventListener('click', removeHeroImage);
    
    // Home background upload
    document.getElementById('homeBackground').addEventListener('change', handleHomeBackgroundUpload);
    document.getElementById('removeHomeBackgroundBtn').addEventListener('click', removeHomeBackground);
    
    // Background opacity control
    document.getElementById('backgroundOpacity').addEventListener('input', handleBackgroundOpacityChange);
    
    // Modal backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModals();
            }
        });
    });
}

// Login handling
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Try server login first, fallback to local
    checkServerConnection().then(serverAvailable => {
        if (serverAvailable) {
            // Server available, try API login
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', data.user);
                    showDashboard();
                    showMessage('Login successful! Server mode active.', 'success');
                    loadScript('admin-script-api.js');
                } else {
                    showMessage('Invalid username or password', 'error');
                }
            })
            .catch(error => {
                console.log('API login failed, using fallback');
                fallbackLogin(username, password);
                showDashboard();
                showMessage('Login successful! (Offline mode)', 'success');
            });
        } else {
            // Server not available, use fallback
            if (fallbackLogin(username, password)) {
                showDashboard();
                showMessage('Login successful! (Offline mode - start server for sync)', 'success');
            } else {
                showMessage('Invalid username or password', 'error');
            }
        }
    });
}

function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    currentUser = null;
    showLoginScreen();
    showMessage('Logged out successfully!', 'success');
}

// Tab switching
function handleTabSwitch(e) {
    e.preventDefault();
    const targetTab = e.currentTarget.getAttribute('data-tab');
    
    // Update active tab link
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show target content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(targetTab).classList.add('active');
}

// Data management (fallback to localStorage)
function loadStoredData() {
    const storedPortfolio = localStorage.getItem('portfolioData');
    const storedServices = localStorage.getItem('servicesData');
    const storedAbout = localStorage.getItem('aboutData');
    const storedContact = localStorage.getItem('contactData');
    const storedSettings = localStorage.getItem('settingsData');
    
    if (storedPortfolio) {
        portfolioData = JSON.parse(storedPortfolio);
    } else {
        // Default portfolio data
        portfolioData = [
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
    
    if (storedServices) {
        servicesData = JSON.parse(storedServices);
    } else {
        // Default services data
        servicesData = [
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
    
    if (storedAbout) {
        const aboutData = JSON.parse(storedAbout);
        document.getElementById('designerName').value = aboutData.name || 'Alex Chen';
        document.getElementById('profession').value = aboutData.profession || 'Creative Graphic Designer';
        document.getElementById('bio').value = aboutData.bio || '';
        document.getElementById('projectsCount').value = aboutData.projects || '150';
        document.getElementById('clientsCount').value = aboutData.clients || '50';
        document.getElementById('experienceYears').value = aboutData.experience || '5';
    }
    
    if (storedContact) {
        const contactData = JSON.parse(storedContact);
        document.getElementById('email').value = contactData.email || 'alex.chen@email.com';
        document.getElementById('phone').value = contactData.phone || '+1 (555) 123-4567';
        document.getElementById('location').value = contactData.location || 'New York, NY';
        document.getElementById('behance').value = contactData.behance || '';
        document.getElementById('dribbble').value = contactData.dribbble || '';
        document.getElementById('instagram').value = contactData.instagram || '';
        document.getElementById('linkedin').value = contactData.linkedin || '';
    }
    
    if (storedSettings) {
        const settingsData = JSON.parse(storedSettings);
        document.getElementById('primaryColor').value = settingsData.primaryColor || '#667eea';
        document.getElementById('secondaryColor').value = settingsData.secondaryColor || '#764ba2';
        document.getElementById('portfolioTitle').value = settingsData.portfolioTitle || 'Alex Chen - Graphic Designer Portfolio';
        document.getElementById('portfolioDescription').value = settingsData.portfolioDescription || '';
    }
    
    renderSkillsList();
}

// Skills management
function addSkill() {
    const input = document.getElementById('newSkill');
    const skill = input.value.trim();
    
    if (skill) {
        const skillsList = document.getElementById('skillsList');
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `${skill} <i class="fas fa-times"></i>`;
        
        skillTag.querySelector('i').addEventListener('click', function() {
            skillsList.removeChild(skillTag);
        });
        
        skillsList.appendChild(skillTag);
        input.value = '';
    }
}

function bindSkillDeleteEvents() {
    // Attach delete event listeners to all skill tags
    document.querySelectorAll('.skill-tag i').forEach(deleteBtn => {
        deleteBtn.addEventListener('click', function() {
            const skillTag = this.parentElement;
            skillTag.remove();
        });
    });
}

function renderSkillsList() {
    // Load skills from stored data if available
    const storedAbout = localStorage.getItem('aboutData');
    if (storedAbout) {
        const aboutData = JSON.parse(storedAbout);
        if (aboutData.skills && aboutData.skills.length > 0) {
            const skillsList = document.getElementById('skillsList');
            skillsList.innerHTML = '';
            aboutData.skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.innerHTML = `${skill} <i class="fas fa-times"></i>`;
                
                skillTag.querySelector('i').addEventListener('click', function() {
                    skillsList.removeChild(skillTag);
                });
                
                skillsList.appendChild(skillTag);
            });
        }
    }
    
    // Bind delete events to any existing skill tags
    bindSkillDeleteEvents();
}

// About section
function handleAboutSave(e) {
    e.preventDefault();
    
    const aboutData = {
        name: document.getElementById('designerName').value,
        profession: document.getElementById('profession').value,
        bio: document.getElementById('bio').value,
        projects: document.getElementById('projectsCount').value,
        clients: document.getElementById('clientsCount').value,
        experience: document.getElementById('experienceYears').value,
        skills: Array.from(document.querySelectorAll('.skill-tag')).map(tag => 
            tag.textContent.replace('×', '').trim()
        )
    };
    
    localStorage.setItem('aboutData', JSON.stringify(aboutData));
    showMessage('About section updated successfully! (Saved locally)', 'success');
}

// Contact section
function handleContactSave(e) {
    e.preventDefault();
    
    const contactData = {
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        behance: document.getElementById('behance').value,
        dribbble: document.getElementById('dribbble').value,
        instagram: document.getElementById('instagram').value,
        linkedin: document.getElementById('linkedin').value
    };
    
    localStorage.setItem('contactData', JSON.stringify(contactData));
    showMessage('Contact information updated successfully! (Saved locally)', 'success');
}

// Settings
function handleSettingsSave(e) {
    e.preventDefault();
    
    const settingsData = {
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        portfolioTitle: document.getElementById('portfolioTitle').value,
        portfolioDescription: document.getElementById('portfolioDescription').value
    };
    
    localStorage.setItem('settingsData', JSON.stringify(settingsData));
    showMessage('Settings updated successfully! (Saved locally)', 'success');
}

function applyColorScheme() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    
    // Apply colors to the page
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    
    showMessage('Color scheme applied!', 'success');
}

// Portfolio management
function renderPortfolioGrid() {
    const grid = document.getElementById('portfolioGrid');
    grid.innerHTML = '';
    
    portfolioData.forEach(project => {
        const item = createPortfolioItem(project);
        grid.appendChild(item);
    });
}

function createPortfolioItem(project) {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.innerHTML = `
        <div class="portfolio-item-image">
            <i class="${project.image}"></i>
        </div>
        <div class="portfolio-item-content">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="portfolio-item-meta">
                <span class="portfolio-item-category">${project.category}</span>
            </div>
            <div class="portfolio-item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editProject(${project.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return item;
}

function openProjectModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    const title = document.getElementById('projectModalTitle');
    const form = document.getElementById('projectForm');
    
    if (projectId) {
        // Edit mode
        const project = portfolioData.find(p => p.id === projectId);
        if (project) {
            title.textContent = 'Edit Project';
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectCategory').value = project.category;
            isEditing = true;
            currentEditId = projectId;
        }
    } else {
        // Add mode
        title.textContent = 'Add New Project';
        form.reset();
        isEditing = false;
        currentEditId = null;
    }
    
    modal.style.display = 'flex';
}

function handleProjectSave(e) {
    e.preventDefault();
    
    const projectData = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        category: document.getElementById('projectCategory').value,
        image: 'fas fa-image' // Default image
    };
    
    if (isEditing && currentEditId) {
        // Update existing project
        const index = portfolioData.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            portfolioData[index] = { ...portfolioData[index], ...projectData };
        }
    } else {
        // Add new project
        projectData.id = Date.now();
        portfolioData.push(projectData);
    }
    
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    renderPortfolioGrid();
    closeModals();
    updateDashboardStats();
    showMessage(isEditing ? 'Project updated successfully!' : 'Project added successfully!', 'success');
}

function editProject(id) {
    openProjectModal(id);
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        portfolioData = portfolioData.filter(p => p.id !== id);
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        renderPortfolioGrid();
        updateDashboardStats();
        showMessage('Project deleted successfully!', 'success');
    }
}

// Services management
function renderServicesList() {
    const list = document.getElementById('servicesList');
    list.innerHTML = '';
    
    servicesData.forEach(service => {
        const item = createServiceItem(service);
        list.appendChild(item);
    });
}

function createServiceItem(service) {
    const item = document.createElement('div');
    item.className = 'service-item';
    item.innerHTML = `
        <div class="service-item-actions">
            <button class="btn btn-secondary btn-sm" onclick="editService(${service.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteService(${service.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="service-icon">
            <i class="${service.icon}"></i>
        </div>
        <h4>${service.title}</h4>
        <p>${service.description}</p>
    `;
    return item;
}

function openServiceModal(serviceId = null) {
    const modal = document.getElementById('serviceModal');
    const title = document.getElementById('serviceModalTitle');
    const form = document.getElementById('serviceForm');
    
    if (serviceId) {
        // Edit mode
        const service = servicesData.find(s => s.id === serviceId);
        if (service) {
            title.textContent = 'Edit Service';
            document.getElementById('serviceTitle').value = service.title;
            document.getElementById('serviceDescription').value = service.description;
            document.getElementById('serviceIcon').value = service.icon;
            isEditing = true;
            currentEditId = serviceId;
        }
    } else {
        // Add mode
        title.textContent = 'Add New Service';
        form.reset();
        isEditing = false;
        currentEditId = null;
    }
    
    modal.style.display = 'flex';
}

function handleServiceSave(e) {
    e.preventDefault();
    
    const serviceData = {
        title: document.getElementById('serviceTitle').value,
        description: document.getElementById('serviceDescription').value,
        icon: document.getElementById('serviceIcon').value
    };
    
    if (isEditing && currentEditId) {
        // Update existing service
        const index = servicesData.findIndex(s => s.id === currentEditId);
        if (index !== -1) {
            servicesData[index] = { ...servicesData[index], ...serviceData };
        }
    } else {
        // Add new service
        serviceData.id = Date.now();
        servicesData.push(serviceData);
    }
    
    localStorage.setItem('servicesData', JSON.stringify(servicesData));
    renderServicesList();
    closeModals();
    updateDashboardStats();
    showMessage(isEditing ? 'Service updated successfully!' : 'Service added successfully!', 'success');
}

function editService(id) {
    openServiceModal(id);
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        servicesData = servicesData.filter(s => s.id !== id);
        localStorage.setItem('servicesData', JSON.stringify(servicesData));
        renderServicesList();
        updateDashboardStats();
        showMessage('Service deleted successfully!', 'success');
    }
}

// Quick actions
function handleQuickAction(e) {
    const action = e.currentTarget.getAttribute('data-action');
    
    switch(action) {
        case 'add-project':
            openProjectModal();
            break;
        case 'edit-about':
            document.querySelector('[data-tab="about"]').click();
            break;
        case 'manage-services':
            document.querySelector('[data-tab="services"]').click();
            break;
    }
}

// Dashboard stats
function updateDashboardStats() {
    document.getElementById('totalProjects').textContent = portfolioData.length;
    document.getElementById('totalServices').textContent = servicesData.length;
}

// Utility functions
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showMessage(message, type = 'success') {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.admin-main');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Image management (simplified for fallback)
function handleHeroImageUpload(e) {
    showMessage('Image upload requires server. Start server for full functionality.', 'info');
}

function removeHeroImage() {
    showMessage('Image management requires server. Start server for full functionality.', 'info');
}

function handleHomeBackgroundUpload(e) {
    showMessage('Image upload requires server. Start server for full functionality.', 'info');
}

function removeHomeBackground() {
    showMessage('Image management requires server. Start server for full functionality.', 'info');
}

function handleBackgroundOpacityChange(e) {
    showMessage('Background opacity requires server. Start server for full functionality.', 'info');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save current form
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const activeForm = document.querySelector('.tab-content.active form');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModals();
    }
});

// Make functions globally available
window.editProject = editProject;
window.deleteProject = deleteProject;
window.editService = editService;
window.deleteService = deleteService;