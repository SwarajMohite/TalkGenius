// ==================== PARTICLES BACKGROUND ====================
particlesJS("particles-js", {
    particles: {
        number: { value: 60 },
        color: { value: "#10A37F" },
        shape: { type: "circle" },
        opacity: { value: 0.3 },
        size: { value: 3 },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#10A37F",
            opacity: 0.3,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" }
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// ==================== SCROLL REVEAL ANIMATIONS ====================
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => observer.observe(el));
});

// ==================== TESTIMONIAL CAROUSEL ====================
let testimonialIndex = 0;
const testimonials = document.querySelectorAll(".testimonial");

function showTestimonial(index) {
    testimonials.forEach((t, i) => {
        t.classList.toggle("active", i === index);
    });
}

function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    showTestimonial(testimonialIndex);
}

if (testimonials.length > 0) {
    showTestimonial(testimonialIndex);
    setInterval(nextTestimonial, 5000);
}

// ==================== FAQ TOGGLE ====================
document.querySelectorAll(".faq").forEach((faq) => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active");
    });
});

// ==================== GSAP HERO ANIMATION ====================
if (typeof gsap !== "undefined") {
    gsap.from(".hero h1", { opacity: 0, y: -50, duration: 1 });
    gsap.from(".hero p", { opacity: 0, y: 20, duration: 1, delay: 0.3 });
    gsap.from(".btn-primary", { opacity: 0, scale: 0.8, duration: 0.8, delay: 0.6 });
}
