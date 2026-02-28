// --- THEME TOGGLE LOGIC WITH CINEMATIC WIPE ---
const themeToggleBtn = document.getElementById('theme-toggle');
const overlay = document.getElementById('theme-overlay');
const body = document.body;

// Check local storage for preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    themeToggleBtn.textContent = savedTheme === 'light' ? '🌙' : '🌞';
}

themeToggleBtn.addEventListener('click', (e) => {
    // 1. Add spinning pop animation to the button
    themeToggleBtn.classList.remove('theme-btn-spin');
    // Trigger reflow to restart animation
    void themeToggleBtn.offsetWidth; 
    themeToggleBtn.classList.add('theme-btn-spin');

    // 2. Get the exact click coordinates for the circle wipe
    const rect = themeToggleBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Position the overlay dot exactly behind the button
    overlay.style.left = `${x - 10}px`; 
    overlay.style.top = `${y - 10}px`;

    // 3. Determine the *next* background color
    const isLight = body.getAttribute('data-theme') === 'light';
    const nextBgColor = isLight ? '#03040b' : '#f4f6f9'; // Dark : Light background hex
    overlay.style.backgroundColor = nextBgColor;
    
    // 4. Trigger the massive scale wipe
    overlay.style.opacity = '1';
    overlay.style.transform = 'scale(200)'; // Large enough to cover any screen

    // 5. Halfway through the wipe, actually change the theme values
    setTimeout(() => {
        if (isLight) {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '🌞';
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        }
        
        // 6. Fade the overlay out seamlessly revealing the new theme
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.transform = 'scale(0)'; // reset scale hidden
        }, 600);
    }, 350); // Timing matches the scale animation halfway point
});

// --- GSAP SCROLLYTELLING ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

const introTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#intro-sequence",
    start: "top top",
    end: "+=1200", 
    pin: true,     
    scrub: 1,      
    onLeave: () => {
      gsap.to("#navbar", { top: 20, opacity: 1, duration: 0.6, ease: "power3.out" });
    },
    onEnterBack: () => {
      gsap.to("#navbar", { top: -100, opacity: 0, duration: 0.4 });
    }
  }
});

introTl.to(".intro-content", {
  scale: 30,           
  opacity: 0,          
  ease: "power2.inOut",
  duration: 1
});

introTl.to("#intro-sequence", { autoAlpha: 0, duration: 0.1 });

gsap.from(".hero-kicker", { 
    opacity: 0, y: 30, duration: 1, ease: "power3.out", 
    scrollTrigger: { trigger: "#hero", start: "top 60%" }
});
gsap.from(".hero-title", { 
    opacity: 0, y: 30, duration: 1, ease: "power3.out", delay: 0.2,
    scrollTrigger: { trigger: "#hero", start: "top 60%" }
});
gsap.from(".hero-subtitle, .hero-meta, .btn", { 
    opacity: 0, y: 20, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.4,
    scrollTrigger: { trigger: "#hero", start: "top 60%" }
});

gsap.from(".hero-portrait-card", { 
    opacity: 0, y: 30, duration: 1.5, ease: "power3.out", delay: 0.2,
    scrollTrigger: { trigger: "#hero", start: "top 60%" }
});

gsap.to(".timeline-progress", {
    height: "100%", ease: "none",
    scrollTrigger: { trigger: ".timeline", start: "top center", end: "bottom center", scrub: true }
});

gsap.utils.toArray(".timeline-item").forEach((item) => {
    gsap.from(item, {
        opacity: 0, x: -30, duration: 0.8,
        scrollTrigger: { trigger: item, start: "top 70%", toggleClass: "active" }
    });
});

gsap.from(".skill-card", {
    opacity: 0, y: 50, duration: 0.8, stagger: 0.15,
    scrollTrigger: { trigger: "#skills", start: "top 60%" }
});

let mm = gsap.matchMedia();
mm.add("(min-width: 900px)", () => {
    const projectWrapper = document.querySelector(".projects-wrapper");
    gsap.to(projectWrapper, {
        x: () => -(projectWrapper.scrollWidth - window.innerWidth) + "px",
        ease: "none",
        scrollTrigger: {
            trigger: ".projects-section",
            start: "top top", 
            pin: true, 
            scrub: 1,  
            end: () => "+=" + projectWrapper.scrollWidth
        }
    });
});