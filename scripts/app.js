/* ============================================================
   01. FOOTER YEAR
============================================================ */
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}


/* ============================================================
   02. CONTACT FORM — Basic Demo Handler + Validation
============================================================ */
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        

        const inputs = contactForm.querySelectorAll("input, textarea");
        let isValid = true;

        inputs.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.setCustomValidity("This field is required");
                field.reportValidity();
            } else {
                field.setCustomValidity("");
            }
        });

        if (isValid) {
            alert("Thank you for your message. I will get back to you soon.");
            contactForm.reset();
        }
    });
}


/* ============================================================
   03. SERVICES TABS — Switch Content Panel
============================================================ */
const serviceTabs = document.querySelectorAll(".service-tab");
const serviceContents = document.querySelectorAll(".service-content");

if (serviceTabs.length > 0) {
    serviceTabs.forEach(tab => {
        tab.addEventListener("click", () => {

            // Remove active states
            serviceTabs.forEach(t => t.classList.remove("active"));
            serviceContents.forEach(c => c.classList.remove("active"));

            // Activate clicked tab
            tab.classList.add("active");

            const target = document.getElementById(tab.dataset.tab);
            if (target) target.classList.add("active");
        });
    });
}


/* ============================================================
   04. SKILLS CAROUSEL 3D
============================================================ */

const skillsCarousel = document.getElementById("skillsCarousel");
const skillCards = document.querySelectorAll(".skill-card-3d");
const skillsPrev = document.getElementById("skillsPrev");
const skillsNext = document.getElementById("skillsNext");
const skillsIndicators = document.getElementById("skillsIndicators");

let currentSkillIndex = 0;
let currentSkillRotation = 0;
const totalSkills = skillCards.length;
const anglePerCard = 360 / totalSkills;

// Create indicators dynamically
if (skillsIndicators) {
    skillCards.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("indicator");
        dot.addEventListener("click", () => goToSkillSlide(index));
        skillsIndicators.appendChild(dot);
    });
}

// Update active dot
function updateSkillIndicators() {
    const dots = skillsIndicators.querySelectorAll(".indicator");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSkillIndex);
    });
}

// Update carousel rotation
function updateSkillView() {
    skillsCarousel.style.transform = `rotateY(${currentSkillRotation}deg)`;
    updateSkillIndicators();
}

// Go to specific slide
function goToSkillSlide(index) {
    currentSkillIndex = index;
    currentSkillRotation = -index * anglePerCard;
    updateSkillView();
}

// Prev button
if (skillsPrev) {
    skillsPrev.addEventListener("click", () => {
        currentSkillIndex = (currentSkillIndex - 1 + totalSkills) % totalSkills;
        currentSkillRotation += anglePerCard;
        updateSkillView();
    });
}

// Next button
if (skillsNext) {
    skillsNext.addEventListener("click", () => {
        currentSkillIndex = (currentSkillIndex + 1) % totalSkills;
        currentSkillRotation -= anglePerCard;
        updateSkillView();
    });
}

// Initialize carousel on load
if (skillCards.length > 0) updateSkillView();


/* ============================================================
   05. ABOUT — COUNTERS ANIMATION
============================================================ */

const counters = document.querySelectorAll(".counter");

function animateCounter(element) {
    if (element.classList.contains("animated")) return;
    element.classList.add("animated");

    const target = parseInt(element.getAttribute("data-count"));
    const increment = target / 70;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 25);
}

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) animateCounter(entry.target);
    });
}, { threshold: 0.6 });

counters.forEach(counter => counterObserver.observe(counter));


/* ============================================================
   06. WORKFLOW TIMELINE — REVEAL + PROGRESS
============================================================ */

function initTimeline() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    const timelineProgress = document.querySelector(".timeline-progress");

    // Scroll-based progress line
    function updateTimelineProgress() {
        const container = document.querySelector(".timeline-container");
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = Math.max(0, Math.min(1,
                (windowHeight - rect.top) / (rect.height + windowHeight)
            ));
            timelineProgress.style.height = `${progress * 100}%`;
        }
    }

    // Reveal step items
    function updateTimelineItems() {
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8;

            if (isVisible && !item.classList.contains("visible")) {
                setTimeout(() => item.classList.add("visible"), index * 180);
            }
        });
    }

    // Node interaction scroll
    document.querySelectorAll(".timeline-node").forEach(node => {
        node.addEventListener("click", function () {
            document.querySelectorAll(".timeline-node")
                    .forEach(n => n.classList.remove("active"));

            this.classList.add("active");

            const timelineItem = this.closest(".timeline-item");
            timelineItem.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });

    // Scroll listeners
    window.addEventListener("scroll", () => {
        updateTimelineItems();
        updateTimelineProgress();
    });

    // Run once on load
    updateTimelineItems();
    updateTimelineProgress();
}

// Initialize timeline
initTimeline();


/* ============================================================
   07. SERVICES TITLE — ON-SCROLL ANIMATION
============================================================ */

const servicesTitle = document.querySelector(".services-title-animated h2");

if (servicesTitle) {
    servicesTitle.style.opacity = 0;
    servicesTitle.style.transform = "translateY(22px)";

    const observerServices = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                servicesTitle.style.animation =
                    "servicesTitleSlide 0.8s ease-out forwards";
            }
        });
    }, { threshold: 0.6 });

    observerServices.observe(servicesTitle);
}

/* ============================================================
   08. AUTO ROTACIÓN DE SERVICIOS (How I Can Help You)
============================================================ */

let autoRotate = true; 
let currentTabIndex = 0;
const tabButtons = document.querySelectorAll(".service-tab");
const contentPanels = document.querySelectorAll(".service-content");
const rotateIntervalTime = 3000; // 3 segundos

// --- Cambiar a un tab específico ---
function switchToTab(index) {
    tabButtons.forEach(t => t.classList.remove("active"));
    contentPanels.forEach(c => c.classList.remove("active"));

    tabButtons[index].classList.add("active");
    const targetPanel = document.getElementById(tabButtons[index].dataset.tab);
    targetPanel.classList.add("active");
}

// --- Rotación automática ---
function autoRotateTabs() {
    if (!autoRotate) return;

    currentTabIndex = (currentTabIndex + 1) % tabButtons.length;
    switchToTab(currentTabIndex);
}

let autoRotateInterval = setInterval(autoRotateTabs, rotateIntervalTime);

// --- Cuando el usuario hace clic → detener rotación ---
tabButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        autoRotate = false;
        clearInterval(autoRotateInterval);
        currentTabIndex = index; 
    });
});

/* ============================================================
   09. AUTO-ROTACIÓN DEL CAROUSEL 3D (Skills & Tools)
============================================================ */

// Estado de auto-rotación
let autoRotateCarousel = true;
const carouselIntervalTime = 3500; // 3.5 segundos por giro

// Función para avanzar una tarjeta
function autoRotateSkills() {
    if (!autoRotateCarousel) return;

    currentSkillIndex = (currentSkillIndex + 1) % totalSkills;
    currentSkillRotation -= anglePerCard;
    updateSkillView();
}

let autoCarouselInterval = setInterval(autoRotateSkills, carouselIntervalTime);

// Cuando el usuario interactúa → detener auto-rotación
if (skillsPrev && skillsNext) {
    skillsPrev.addEventListener("click", () => {
        autoRotateCarousel = false;
        clearInterval(autoCarouselInterval);
    });

    skillsNext.addEventListener("click", () => {
        autoRotateCarousel = false;
        clearInterval(autoCarouselInterval);
    });
}

// También detener si hace clic en un dot (indicador)
document.querySelectorAll(".indicator").forEach(dot => {
    dot.addEventListener("click", () => {
        autoRotateCarousel = false;
        clearInterval(autoCarouselInterval);
    });
});