// Admin Panel JavaScript - API Version for Cross-Device Synchronization

// Global variables
let currentUser = null;
let portfolioData = [];
let servicesData = [];
let isEditing = false;
let currentEditId = null;
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
            throw error;
        }
    },

    // Authentication
    async login(username, password) {
        const response = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        if (response.success) {
            localStorage.setItem('adminToken', response.token);
            localStorage.setItem('adminUser', response.user);
        }
        return response;
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
    },

    // Data update methods
    async updatePortfolio(data) {
        return await this.request('/portfolio', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateServices(data) {
        return await this.request('/services', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateAbout(data) {
        return await this.request('/about', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateContact(data) {
        return await this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateSettings(data) {
        return await this.request('/settings', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateImages(data) {
        return await this.request('/images', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Helper method to convert file to base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Image upload methods
    async uploadHeroImage(file) {
        try {
            const imageData = await this.fileToBase64(file);
            
            const response = await fetch(`${API_BASE_URL}/api/upload/hero`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageData: imageData,
                    mimeType: file.type
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Hero image upload failed:', error);
            throw error;
        }
    },

    async uploadBackgroundImage(file) {
        try {
            const imageData = await this.fileToBase64(file);
            
            const response = await fetch(`${API_BASE_URL}/api/upload/background`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageData: imageData,
                    mimeType: file.type
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Background image upload failed:', error);
            throw error;
        }
    },

    async deleteHeroImage() {
        return await this.request('/images/hero', { method: 'DELETE' });
    },

    async deleteBackgroundImage() {
        return await this.request('/images/background', { method: 'DELETE' });
    }
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

// Initialize function
async function initializeAdminPanel() {
    try {
        await checkAuthentication();
        setupEventListeners();
        await loadStoredData();
        renderPortfolioGrid();
        renderServicesList();
        updateDashboardStats();
        bindSkillDeleteEvents();
        await loadHeroImagePreview();
        await loadHomeBackgroundPreview();
    } catch (error) {
        console.error('Failed to initialize admin panel:', error);
        showMessage('Failed to load data. Please check your connection.', 'error');
    }
}

// Authentication
function checkAuthentication() {
    return new Promise((resolve) => {
        const isLoggedIn = localStorage.getItem('adminToken');
        if (isLoggedIn) {
            showDashboard();
            currentUser = localStorage.getItem('adminUser');
            resolve();
        } else {
            showLoginScreen();
            resolve();
        }
    });
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
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await apiService.login(username, password);
        if (response.success) {
            showDashboard();
            showMessage('Login successful!', 'success');
            // Reload data after successful login
            await loadStoredData();
            renderPortfolioGrid();
            renderServicesList();
            updateDashboardStats();
        } else {
            showMessage('Invalid username or password', 'error');
        }
    } catch (error) {
        showMessage('Login failed. Please check your connection.', 'error');
    }
}

function handleLogout() {
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

// Data management
async function loadStoredData() {
    try {
        console.log('Loading stored data from API...');
        
        // Load all data in parallel
        const [portfolio, services, about, contact, settings, images] = await Promise.all([
            apiService.getPortfolio(),
            apiService.getServices(),
            apiService.getAbout(),
            apiService.getContact(),
            apiService.getSettings(),
            apiService.getImages()
        ]);

        portfolioData = portfolio || [];
        servicesData = services || [];

        console.log('Loaded data:', { about, contact, settings });

        // Populate forms with loaded data
        if (about) {
            document.getElementById('designerName').value = about.name || 'John Kurt Facturan';
            document.getElementById('profession').value = about.profession || 'Creative Graphic Designer';
            document.getElementById('bio').value = about.bio || '';
            document.getElementById('projectsCount').value = about.projects || '50';
            document.getElementById('clientsCount').value = about.clients || '0';
            document.getElementById('experienceYears').value = about.experience || '1';
            console.log('About form populated with:', about);
        } else {
            console.log('No about data received from API');
        }

        if (contact) {
            document.getElementById('email').value = contact.email || 'jkurtzhie12@gmail.com';
            document.getElementById('phone').value = contact.phone || '09944594696';
            document.getElementById('location').value = contact.location || 'Poblacion Mabinay Negros Oriental';
            document.getElementById('behance').value = contact.behance || '';
            document.getElementById('dribbble').value = contact.dribbble || '';
            document.getElementById('instagram').value = contact.instagram || '';
            document.getElementById('linkedin').value = contact.linkedin || '';
            console.log('Contact form populated with:', contact);
        } else {
            console.log('No contact data received from API');
        }

        if (settings) {
            document.getElementById('primaryColor').value = settings.primaryColor || '#667eea';
            document.getElementById('secondaryColor').value = settings.secondaryColor || '#764ba2';
            document.getElementById('portfolioTitle').value = settings.portfolioTitle || 'John Kurt Facturan - Graphic Designer Portfolio';
            document.getElementById('portfolioDescription').value = settings.portfolioDescription || '';
            console.log('Settings form populated with:', settings);
        } else {
            console.log('No settings data received from API');
        }

        renderSkillsList(about?.skills || []);
        
        console.log('Data loading completed successfully');
        
    } catch (error) {
        console.error('Error loading stored data:', error);
        showMessage('Failed to load data. Using default values.', 'error');
    }
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

function renderSkillsList(skills = []) {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `${skill} <i class="fas fa-times"></i>`;
        
        skillTag.querySelector('i').addEventListener('click', function() {
            skillsList.removeChild(skillTag);
        });
        
        skillsList.appendChild(skillTag);
    });
    
    bindSkillDeleteEvents();
}

// About section
async function handleAboutSave(e) {
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
    
    console.log('Saving about data:', aboutData);
    
    try {
        const result = await apiService.updateAbout(aboutData);
        console.log('About save result:', result);
        showMessage('About section updated successfully! Changes will appear on the main page within 5 seconds.', 'success');
        
        // Reload data to confirm it was saved
        setTimeout(async () => {
            try {
                const updatedData = await apiService.getAbout();
                console.log('Verified updated data:', updatedData);
                if (updatedData && updatedData.name === aboutData.name) {
                    showMessage('✅ Data saved and verified! Check the main page.', 'success');
                }
            } catch (verifyError) {
                console.error('Verification failed:', verifyError);
            }
        }, 1000);
        
    } catch (error) {
        console.error('About save failed:', error);
        showMessage('Failed to update about section: ' + error.message, 'error');
    }
}

// Contact section
async function handleContactSave(e) {
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
    
    try {
        await apiService.updateContact(contactData);
        showMessage('Contact information updated successfully!', 'success');
    } catch (error) {
        showMessage('Failed to update contact information', 'error');
    }
}

// Settings
async function handleSettingsSave(e) {
    e.preventDefault();
    
    const settingsData = {
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        portfolioTitle: document.getElementById('portfolioTitle').value,
        portfolioDescription: document.getElementById('portfolioDescription').value
    };
    
    try {
        await apiService.updateSettings(settingsData);
        showMessage('Settings updated successfully!', 'success');
    } catch (error) {
        showMessage('Failed to update settings', 'error');
    }
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

async function handleProjectSave(e) {
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
    
    try {
        await apiService.updatePortfolio(portfolioData);
        renderPortfolioGrid();
        closeModals();
        updateDashboardStats();
        showMessage(isEditing ? 'Project updated successfully!' : 'Project added successfully!', 'success');
    } catch (error) {
        showMessage('Failed to save project', 'error');
    }
}

function editProject(id) {
    openProjectModal(id);
}

async function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        portfolioData = portfolioData.filter(p => p.id !== id);
        try {
            await apiService.updatePortfolio(portfolioData);
            renderPortfolioGrid();
            updateDashboardStats();
            showMessage('Project deleted successfully!', 'success');
        } catch (error) {
            showMessage('Failed to delete project', 'error');
        }
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

async function handleServiceSave(e) {
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
    
    try {
        await apiService.updateServices(servicesData);
        renderServicesList();
        closeModals();
        updateDashboardStats();
        showMessage(isEditing ? 'Service updated successfully!' : 'Service added successfully!', 'success');
    } catch (error) {
        showMessage('Failed to save service', 'error');
    }
}

function editService(id) {
    openServiceModal(id);
}

async function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        servicesData = servicesData.filter(s => s.id !== id);
        try {
            await apiService.updateServices(servicesData);
            renderServicesList();
            updateDashboardStats();
            showMessage('Service deleted successfully!', 'success');
        } catch (error) {
            showMessage('Failed to delete service', 'error');
        }
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

// Hero Image Management
async function handleHeroImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showMessage('Please select a valid image file.', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showMessage('File size must be less than 5MB.', 'error');
        return;
    }
    
    try {
        const response = await apiService.uploadHeroImage(file);
        if (response.success) {
            updateHeroImagePreview(response.imageData);
            showMessage('Hero image uploaded successfully! Changes will appear on the main page within 2 seconds.', 'success');
            
            // Force refresh the main page images after a short delay
            setTimeout(async () => {
                try {
                    // Trigger refresh of main page if it's open as popup
                    if (window.opener && !window.opener.closed) {
                        // Call the main page's refresh function directly
                        if (window.opener.forceRefreshNow) {
                            window.opener.forceRefreshNow();
                        } else if (window.opener.refreshPageData) {
                            window.opener.refreshPageData();
                        } else {
                            window.opener.location.reload();
                        }
                    } else {
                        // If not a popup, try to refresh via localStorage event
                        localStorage.setItem('portfolio_refresh', Date.now().toString());
                        // Also try to refresh the current page if it's the main page
                        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                            window.location.reload();
                        }
                    }
                } catch (refreshError) {
                    console.log('Could not refresh main page:', refreshError);
                }
            }, 1000);
        }
    } catch (error) {
        showMessage('Failed to upload hero image', 'error');
    }
}

function updateHeroImagePreview(imageData) {
    const preview = document.getElementById('heroImagePreview');
    const removeBtn = document.getElementById('removeHeroImageBtn');
    
    preview.innerHTML = `
        <img src="${imageData}" alt="Hero Image" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
    `;
    
    removeBtn.style.display = 'inline-block';
}

async function removeHeroImage() {
    try {
        await apiService.deleteHeroImage();
        
        const preview = document.getElementById('heroImagePreview');
        const removeBtn = document.getElementById('removeHeroImageBtn');
        const fileInput = document.getElementById('heroImage');
        
        preview.innerHTML = `
            <div class="placeholder-image">
                <i class="fas fa-image"></i>
                <span>No hero image uploaded</span>
            </div>
        `;
        
        removeBtn.style.display = 'none';
        fileInput.value = '';
        
        showMessage('Hero image removed successfully! Changes will appear on the main page within 2 seconds.', 'success');
        
        // Force refresh the main page after a short delay
        setTimeout(async () => {
            try {
                // Trigger refresh of main page if it's open
                if (window.opener && !window.opener.closed) {
                    window.opener.location.reload();
                }
            } catch (refreshError) {
                console.log('Could not refresh main page:', refreshError);
            }
        }, 1000);
    } catch (error) {
        showMessage('Failed to remove hero image', 'error');
    }
}

async function loadHeroImagePreview() {
    try {
        const images = await apiService.getImages();
        if (images.heroImage) {
            updateHeroImagePreview(images.heroImage);
        }
    } catch (error) {
        console.error('Failed to load hero image preview:', error);
    }
}

// Home Background Management
async function handleHomeBackgroundUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showMessage('Please select a valid image file.', 'error');
        return;
    }
    
    // Validate file size (max 10MB for background images)
    if (file.size > 10 * 1024 * 1024) {
        showMessage('File size must be less than 10MB.', 'error');
        return;
    }
    
    try {
        const response = await apiService.uploadBackgroundImage(file);
        if (response.success) {
            updateHomeBackgroundPreview(response.imageData);
            showMessage('Home background uploaded successfully! Changes will appear on the main page within 2 seconds.', 'success');
            
            // Force refresh the main page images after a short delay
            setTimeout(async () => {
                try {
                    // Trigger refresh of main page if it's open as popup
                    if (window.opener && !window.opener.closed) {
                        // Call the main page's refresh function directly
                        if (window.opener.forceRefreshNow) {
                            window.opener.forceRefreshNow();
                        } else if (window.opener.refreshPageData) {
                            window.opener.refreshPageData();
                        } else {
                            window.opener.location.reload();
                        }
                    } else {
                        // If not a popup, try to refresh via localStorage event
                        localStorage.setItem('portfolio_refresh', Date.now().toString());
                        // Also try to refresh the current page if it's the main page
                        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                            window.location.reload();
                        }
                    }
                } catch (refreshError) {
                    console.log('Could not refresh main page:', refreshError);
                }
            }, 1000);
        }
    } catch (error) {
        showMessage('Failed to upload background image', 'error');
    }
}

function updateHomeBackgroundPreview(imageData) {
    const preview = document.getElementById('homeBackgroundPreview');
    const removeBtn = document.getElementById('removeHomeBackgroundBtn');
    
    preview.innerHTML = `
        <img src="${imageData}" alt="Home Background" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
    `;
    
    removeBtn.style.display = 'inline-block';
}

async function removeHomeBackground() {
    try {
        await apiService.deleteBackgroundImage();
        
        const preview = document.getElementById('homeBackgroundPreview');
        const removeBtn = document.getElementById('removeHomeBackgroundBtn');
        const fileInput = document.getElementById('homeBackground');
        
        preview.innerHTML = `
            <div class="placeholder-image">
                <i class="fas fa-image"></i>
                <span>No background image uploaded</span>
            </div>
        `;
        
        removeBtn.style.display = 'none';
        fileInput.value = '';
        
        showMessage('Home background removed successfully! Changes will appear on the main page within 2 seconds.', 'success');
        
        // Force refresh the main page after a short delay
        setTimeout(async () => {
            try {
                // Trigger refresh of main page if it's open
                if (window.opener && !window.opener.closed) {
                    window.opener.location.reload();
                }
            } catch (refreshError) {
                console.log('Could not refresh main page:', refreshError);
            }
        }, 1000);
    } catch (error) {
        showMessage('Failed to remove background image', 'error');
    }
}

async function loadHomeBackgroundPreview() {
    try {
        const images = await apiService.getImages();
        if (images.homeBackgroundImage) {
            updateHomeBackgroundPreview(images.homeBackgroundImage);
        }
        
        // Load background opacity
        if (images.backgroundOpacity) {
            document.getElementById('backgroundOpacity').value = images.backgroundOpacity;
            document.getElementById('opacityValue').textContent = images.backgroundOpacity + '%';
        }
    } catch (error) {
        console.error('Failed to load background preview:', error);
    }
}

// Background opacity control
async function handleBackgroundOpacityChange(e) {
    const opacity = e.target.value;
    document.getElementById('opacityValue').textContent = opacity + '%';
    
    try {
        await apiService.updateImages({ backgroundOpacity: opacity });
        showMessage('Background opacity updated!', 'success');
    } catch (error) {
        showMessage('Failed to update background opacity', 'error');
    }
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