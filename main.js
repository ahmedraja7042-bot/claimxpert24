// Vehicle Insurance Broker Website - Main JavaScript
// Handles all interactive functionality across pages

class InsuranceBrokerApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('plans.html')) return 'plans';
        if (path.includes('claims.html')) return 'claims';
        if (path.includes('dashboard.html')) return 'dashboard';
        if (path.includes('dealer.html')) return 'dealer';
        return 'index';
    }

    init() {
        this.initCommonFeatures();
        this.initPageSpecificFeatures();
        this.initScrollAnimations();
        this.initFormValidation();
    }

    initCommonFeatures() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Smooth scrolling for anchor links
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

        // Initialize particle background if on index page
        if (this.currentPage === 'index') {
            this.initParticleBackground();
        }
    }

    initPageSpecificFeatures() {
        switch (this.currentPage) {
            case 'index':
                this.initCostEstimator();
                this.initHeroAnimations();
                break;
            case 'plans':
                this.initPlanSelector();
                this.initPaymentGateway();
                break;
            case 'claims':
                this.initClaimForm();
                this.initFileUpload();
                break;
            case 'dashboard':
                this.initDashboard();
                this.initCharts();
                break;
            case 'dealer':
                this.initDealerPortal();
                this.initCommissionTracker();
                break;
        }
    }

    initParticleBackground() {
        // Simple particle background using p5.js
        if (typeof p5 !== 'undefined') {
            new p5((sketch) => {
                let particles = [];
                
                sketch.setup = () => {
                    const canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
                    canvas.parent('particle-bg');
                    canvas.style('position', 'fixed');
                    canvas.style('top', '0');
                    canvas.style('left', '0');
                    canvas.style('z-index', '-1');
                    
                    for (let i = 0; i < 50; i++) {
                        particles.push({
                            x: sketch.random(sketch.width),
                            y: sketch.random(sketch.height),
                            vx: sketch.random(-0.5, 0.5),
                            vy: sketch.random(-0.5, 0.5),
                            size: sketch.random(2, 6)
                        });
                    }
                };
                
                sketch.draw = () => {
                    sketch.clear();
                    sketch.fill(26, 54, 93, 30);
                    sketch.noStroke();
                    
                    particles.forEach(particle => {
                        sketch.circle(particle.x, particle.y, particle.size);
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        if (particle.x < 0 || particle.x > sketch.width) particle.vx *= -1;
                        if (particle.y < 0 || particle.y > sketch.height) particle.vy *= -1;
                    });
                };
                
                sketch.windowResized = () => {
                    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
                };
            });
        }
    }

    initCostEstimator() {
        const form = document.getElementById('cost-estimator-form');
        if (!form) return;

        const vehicleType = document.getElementById('vehicle-type');
        const vehicleValue = document.getElementById('vehicle-value');
        const coverageType = document.getElementById('coverage-type');
        const addons = document.querySelectorAll('input[name="addons"]');
        const premiumDisplay = document.getElementById('premium-display');

        const calculatePremium = () => {
            let basePremium = 0;
            
            // Vehicle type multiplier
            const vehicleMultipliers = {
                'car': 1.0,
                'bike': 0.6,
                'commercial': 1.5
            };
            
            // Coverage type rates (per $1000 of vehicle value)
            const coverageRates = {
                'basic': 25,
                'premium': 40,
                'comprehensive': 60
            };

            const vehicleMultiplier = vehicleMultipliers[vehicleType.value] || 1.0;
            const coverageRate = coverageRates[coverageType.value] || 25;
            const value = parseInt(vehicleValue.value) || 0;
            
            basePremium = (value / 1000) * coverageRate * vehicleMultiplier;
            
            // Add addon costs
            addons.forEach(addon => {
                if (addon.checked) {
                    switch (addon.value) {
                        case 'roadside': basePremium += 50; break;
                        case 'zerodep': basePremium += value * 0.02; break;
                        case 'engine': basePremium += 75; break;
                        case 'consumables': basePremium += 25; break;
                    }
                }
            });

            // Animate premium update
            if (premiumDisplay) {
                anime({
                    targets: premiumDisplay,
                    innerHTML: [premiumDisplay.innerHTML, `$${Math.round(basePremium).toLocaleString()}`],
                    duration: 800,
                    easing: 'easeOutQuart',
                    round: 1
                });
            }
        };

        // Add event listeners
        [vehicleType, vehicleValue, coverageType].forEach(element => {
            if (element) element.addEventListener('change', calculatePremium);
        });

        addons.forEach(addon => {
            addon.addEventListener('change', calculatePremium);
        });

        // Initial calculation
        calculatePremium();
    }

    initHeroAnimations() {
        // Typewriter effect for hero text
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && typeof Typed !== 'undefined') {
            new Typed('.hero-title', {
                strings: [
                    'Your Trusted Insurance Partner',
                    'Fast Claims, Fair Settlements',
                    'Protecting What Matters Most'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true
            });
        }

        // Animate hero elements on load
        anime.timeline()
            .add({
                targets: '.hero-content > *',
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(200),
                easing: 'easeOutQuart'
            });
    }

    initPlanSelector() {
        const planCards = document.querySelectorAll('.plan-card');
        const billingToggle = document.getElementById('billing-toggle');
        
        planCards.forEach(card => {
            card.addEventListener('click', () => {
                planCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                // Update pricing based on billing cycle
                this.updatePlanPricing();
            });
        });

        if (billingToggle) {
            billingToggle.addEventListener('change', () => {
                this.updatePlanPricing();
            });
        }
    }

    updatePlanPricing() {
        const isYearly = document.getElementById('billing-toggle')?.checked;
        const prices = document.querySelectorAll('.plan-price');
        
        prices.forEach(price => {
            const monthlyPrice = parseInt(price.dataset.monthly);
            const yearlyPrice = isYearly ? monthlyPrice * 10 : monthlyPrice; // 2 months free
            
            anime({
                targets: price,
                innerHTML: [price.innerHTML, `$${yearlyPrice}`],
                duration: 500,
                easing: 'easeOutQuart',
                round: 1
            });
        });
    }

    initPaymentGateway() {
        const paymentButtons = document.querySelectorAll('.payment-btn');
        
        paymentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.processPayment(button.dataset.gateway);
            });
        });
    }

    processPayment(gateway) {
        // Mock payment processing
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <h3 class="text-xl font-bold mb-4">Processing Payment</h3>
                <div class="flex items-center justify-center mb-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p class="text-center text-gray-600">Connecting to ${gateway}...</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Simulate payment processing
        setTimeout(() => {
            modal.innerHTML = `
                <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                    <div class="text-center">
                        <div class="text-green-500 text-5xl mb-4">✓</div>
                        <h3 class="text-xl font-bold mb-2">Payment Successful!</h3>
                        <p class="text-gray-600 mb-4">Your subscription has been activated.</p>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            Continue
                        </button>
                    </div>
                </div>
            `;
        }, 3000);
    }

    initClaimForm() {
        const form = document.getElementById('claim-form');
        if (!form) return;

        const steps = document.querySelectorAll('.form-step');
        const nextBtns = document.querySelectorAll('.next-step');
        const prevBtns = document.querySelectorAll('.prev-step');
        const progressBar = document.querySelector('.progress-bar');
        let currentStep = 0;

        const showStep = (stepIndex) => {
            steps.forEach((step, index) => {
                step.classList.toggle('hidden', index !== stepIndex);
            });
            
            if (progressBar) {
                const progress = ((stepIndex + 1) / steps.length) * 100;
                progressBar.style.width = `${progress}%`;
            }
        };

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        });

        // Initialize first step
        showStep(0);
    }

    initFileUpload() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                const preview = input.parentElement.querySelector('.file-preview');
                
                if (preview) {
                    preview.innerHTML = files.map(file => `
                        <div class="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <span class="text-sm text-gray-600">${file.name}</span>
                            <span class="text-xs text-gray-500">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    `).join('');
                }
            });
        });
    }

    initDashboard() {
        // Initialize dashboard components
        this.initClaimStatus();
        this.initRenewalReminders();
    }

    initClaimStatus() {
        const claimCards = document.querySelectorAll('.claim-card');
        
        claimCards.forEach(card => {
            const status = card.dataset.status;
            const progressBar = card.querySelector('.progress-bar');
            
            if (progressBar) {
                let progress = 0;
                switch (status) {
                    case 'submitted': progress = 25; break;
                    case 'under-review': progress = 50; break;
                    case 'approved': progress = 75; break;
                    case 'settled': progress = 100; break;
                }
                
                anime({
                    targets: progressBar,
                    width: `${progress}%`,
                    duration: 1000,
                    easing: 'easeOutQuart'
                });
            }
        });
    }

    initRenewalReminders() {
        const renewalCards = document.querySelectorAll('.renewal-card');
        
        renewalCards.forEach(card => {
            const daysLeft = parseInt(card.dataset.daysLeft);
            const urgencyClass = daysLeft <= 7 ? 'bg-red-100 border-red-300' :
                               daysLeft <= 30 ? 'bg-yellow-100 border-yellow-300' :
                               'bg-green-100 border-green-300';
            
            card.classList.add(...urgencyClass.split(' '));
        });
    }

    initCharts() {
        // Initialize ECharts for dashboard
        if (typeof echarts !== 'undefined') {
            this.initClaimChart();
            this.initPerformanceChart();
        }
    }

    initClaimChart() {
        const chartDom = document.getElementById('claim-chart');
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text: 'Claims Overview'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [{
                name: 'Claims',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 12, name: 'Settled' },
                    { value: 8, name: 'In Progress' },
                    { value: 3, name: 'Pending' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        myChart.setOption(option);
    }

    initPerformanceChart() {
        const chartDom = document.getElementById('performance-chart');
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text: 'Monthly Performance'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'Claims Settled',
                type: 'line',
                data: [8, 12, 15, 10, 18, 22],
                smooth: true
            }]
        };

        myChart.setOption(option);
    }

    initDealerPortal() {
        this.initCommissionCalculator();
        this.initLeadManagement();
    }

    initCommissionCalculator() {
        const calculator = document.getElementById('commission-calculator');
        if (!calculator) return;

        const policiesInput = calculator.querySelector('#policies-sold');
        const avgPremiumInput = calculator.querySelector('#avg-premium');
        const commissionRateInput = calculator.querySelector('#commission-rate');
        const resultDisplay = calculator.querySelector('#commission-result');

        const calculateCommission = () => {
            const policies = parseInt(policiesInput.value) || 0;
            const avgPremium = parseFloat(avgPremiumInput.value) || 0;
            const commissionRate = parseFloat(commissionRateInput.value) || 0;
            
            const totalCommission = (policies * avgPremium * commissionRate) / 100;
            
            if (resultDisplay) {
                anime({
                    targets: resultDisplay,
                    innerHTML: [resultDisplay.innerHTML, `$${totalCommission.toLocaleString()}`],
                    duration: 800,
                    easing: 'easeOutQuart',
                    round: 1
                });
            }
        };

        [policiesInput, avgPremiumInput, commissionRateInput].forEach(input => {
            if (input) input.addEventListener('input', calculateCommission);
        });

        // Initial calculation
        calculateCommission();
    }

    initLeadManagement() {
        const leadTable = document.getElementById('lead-table');
        if (!leadTable) return;

        // Mock lead data
        const leads = [
            { id: 1, name: 'John Doe', status: 'New', value: '$2,500', date: '2024-01-15' },
            { id: 2, name: 'Jane Smith', status: 'Contacted', value: '$3,200', date: '2024-01-14' },
            { id: 3, name: 'Bob Johnson', status: 'Qualified', value: '$1,800', date: '2024-01-13' }
        ];

        this.renderLeadTable(leads);
    }

    renderLeadTable(leads) {
        const tbody = document.querySelector('#lead-table tbody');
        if (!tbody) return;

        tbody.innerHTML = leads.map(lead => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-2">${lead.id}</td>
                <td class="px-4 py-2">${lead.name}</td>
                <td class="px-4 py-2">
                    <span class="px-2 py-1 rounded text-xs ${this.getStatusColor(lead.status)}">
                        ${lead.status}
                    </span>
                </td>
                <td class="px-4 py-2">${lead.value}</td>
                <td class="px-4 py-2">${lead.date}</td>
            </tr>
        `).join('');
    }

    getStatusColor(status) {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Contacted': return 'bg-yellow-100 text-yellow-800';
            case 'Qualified': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    initScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observe all elements with scroll animation class
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = message;
        } else {
            const error = document.createElement('div');
            error.className = 'field-error text-red-500 text-sm mt-1';
            error.textContent = message;
            field.parentElement.appendChild(error);
        }
        field.classList.add('border-red-500');
    }

    clearFieldError(field) {
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('border-red-500');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InsuranceBrokerApp();
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-black' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}