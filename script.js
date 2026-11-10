const moinsAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
 
/* ---------- 1. Menu : ombre au défilement ---------- */
const navbar = document.querySelector(".navbar");
 
function majNavbar() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", majNavbar, { passive: true });
majNavbar();
 
 
/* ---------- 2. Menu : lien de la section visible souligné ---------- */
const liensMenu = document.querySelectorAll('.navbar nav a[href^="#"]');
const sections = [...liensMenu]
    .map(lien => document.querySelector(lien.getAttribute("href")))
    .filter(Boolean);
 
function majLienActif() {
    // La section active est la dernière dont le haut a dépassé le tiers de l'écran
    const repere = window.innerHeight / 3;
    let active = null;
 
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= repere) {
            active = section;
        }
    });
 
    // Tout en bas de la page, on active la dernière section (Contact)
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        active = sections[sections.length - 1];
    }
 
    liensMenu.forEach(lien => {
        lien.classList.toggle("active", active && lien.getAttribute("href") === "#" + active.id);
    });
}
window.addEventListener("scroll", majLienActif, { passive: true });
majLienActif();
 
 
/* ---------- 3. Apparition des éléments au défilement ---------- */
if (!moinsAnimations && "IntersectionObserver" in window) {
    const aAnimer = document.querySelectorAll(
        "section:not(.hero) h2, section:not(.hero) .intro, .about-text, .fact, .skill-card, " +
        ".featured-project, .project-card, .timeline-item, .contact-text, .contact-buttons"
    );
 
    aAnimer.forEach(element => {
        element.classList.add("reveal");
 
        // Petit décalage entre les cartes d'une même grille (effet « cascade »)
        const freres = [...element.parentElement.children].filter(e => e.classList.contains("reveal"));
        const position = freres.indexOf(element);
        element.style.transitionDelay = Math.min(position, 5) * 90 + "ms";
    });
 
    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach(entree => {
            if (entree.isIntersecting) {
                const element = entree.target;
                element.classList.add("visible");
                observateur.unobserve(element); // l'animation ne joue qu'une fois
 
                // Une fois apparu, l'élément retrouve ses propres effets de survol
                element.addEventListener("transitionend", function nettoyer(e) {
                    if (e.propertyName !== "opacity") return;
                    element.classList.remove("reveal", "visible");
                    element.style.transitionDelay = "";
                    element.removeEventListener("transitionend", nettoyer);
                });
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
 
    aAnimer.forEach(element => observateur.observe(element));
}
 
 
/* ---------- 4. Agrandissement des captures de projets ---------- */
const lightbox = document.getElementById("lightbox");
const imageLightbox = lightbox.querySelector("img");
 
document.querySelectorAll(".project-preview img").forEach(image => {
    image.addEventListener("click", () => {
        imageLightbox.src = image.src;
        imageLightbox.alt = image.alt;
        lightbox.showModal();
    });
});
 
// Fermer avec le bouton ×, en cliquant à côté de l'image, ou avec Échap (natif)
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
});