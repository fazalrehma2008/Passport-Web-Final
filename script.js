// script.js

// --- NAVIGATION LOGIC ---
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

function navigateTo(pageId) {
    pageSections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    } else {
        document.getElementById('home').classList.add('active');
    }

    const activeLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');

    navLinksContainer.classList.remove('active');
    triggerScrollAnimations();

    if (history.pushState) {
        history.pushState(null, null, `#${pageId}`);
    }
}

// Nav link clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetAttr = link.getAttribute('href');
        if (targetAttr && targetAttr.startsWith('#')) {
            e.preventDefault();
            navigateTo(targetAttr.substring(1));
        }
    });
});

// Logo link clicks (navbar + footer)
document.querySelectorAll('a.logo, a.footer-logo').forEach(logoLink => {
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('home');
    });
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
    }
});

// Sticky Navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// --- SCROLL ANIMATIONS ---
function triggerScrollAnimations() {
    const animElements = document.querySelectorAll('.active .scroll-anim');
    animElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
}

// Initial load
window.addEventListener('DOMContentLoaded', () => {
    triggerScrollAnimations();
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        navigateTo(hash);
    }
});

// Back/forward browser navigation
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'home';
    navigateTo(hash);
});

// --- AUTO SLIDER LOGIC ---
(function initSlider() {
    const track = document.getElementById('sliderTrack');
    const dots  = document.querySelectorAll('#sliderDots .dot');
    if (!track || dots.length === 0) return;

    const total = dots.length;
    let current = 0;
    let timer;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function startAuto() { timer = setInterval(next, 4000); }
    function stopAuto()  { clearInterval(timer); }

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAuto();
            goTo(parseInt(dot.dataset.index));
            startAuto();
        });
    });

    // Pause on hover
    const wrapper = document.querySelector('.slider-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAuto);
        wrapper.addEventListener('mouseleave', startAuto);
    }

    // Intercept slide CTA links through SPA router
    document.querySelectorAll('.slide-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                navigateTo(href.substring(1));
            }
        });
    });

    startAuto();
})();

// --- VERIFY LICENSE LOGIC ---
const verifyForm = document.getElementById('verifyForm');
const verifyLoading = document.getElementById('verifyLoading');
const verifyResult = document.getElementById('verifyResult');

const mockDatabase = {
    '12345-1234567-1': {
        name: 'Ahmed Khan',
        status: 'Active',
        issueDate: '15 Jan 2020',
        expiryDate: '15 Jan 2025',
        type: 'LTV / Car / Jeep',
        city: 'Islamabad'
    },
    '98765-9876543-9': {
        name: 'Fatima Ali',
        status: 'Expired',
        issueDate: '02 Mar 2018',
        expiryDate: '02 Mar 2023',
        type: 'Motorcycle / Car',
        city: 'Lahore'
    }
};

if (verifyForm) {
    verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cnicVal = document.getElementById('cnic').value.trim();

        verifyResult.classList.add('hidden');
        verifyResult.innerHTML = '';
        verifyLoading.classList.remove('hidden');

        setTimeout(() => {
            verifyLoading.classList.add('hidden');
            verifyResult.classList.remove('hidden');

            const userData = mockDatabase[cnicVal];

            if (userData) {
                const statusClass = userData.status === 'Active' ? 'status-active' : 'status-expired';
                const statusIcon = userData.status === 'Active' ? 'fa-circle-check' : 'fa-circle-xmark';

                verifyResult.innerHTML = `
                    <div class="profile-card">
                        <div class="verified-badge">
                            <i class="fa-solid fa-shield-halved"></i> Secured Portal
                        </div>
                        <div class="profile-header">
                            <div class="profile-img">
                                <i class="fa-regular fa-user"></i>
                            </div>
                            <div class="profile-details">
                                <h3>${userData.name}</h3>
                                <p>CNIC: ${cnicVal}</p>
                            </div>
                        </div>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>License Status</label>
                                <p class="${statusClass}"><i class="fa-solid ${statusIcon}"></i> ${userData.status}</p>
                            </div>
                            <div class="info-item">
                                <label>Vehicle Type</label>
                                <p>${userData.type}</p>
                            </div>
                            <div class="info-item">
                                <label>Issue Date</label>
                                <p>${userData.issueDate}</p>
                            </div>
                            <div class="info-item">
                                <label>Expiry Date</label>
                                <p>${userData.expiryDate}</p>
                            </div>
                            <div class="info-item">
                                <label>Issuing Authority</label>
                                <p>Traffic Police ${userData.city}</p>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                verifyResult.innerHTML = `
                    <div class="no-record profile-card">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <h3>No Record Found</h3>
                        <p>We couldn't find any driving license associated with this CNIC.<br>Please check the number and try again.</p>
                    </div>
                `;
            }
        }, 1500);
    });
}

// --- CONTACT FORM ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your message has been securely transmitted to our support team.');
        contactForm.reset();
    });
}
