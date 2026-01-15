const toggleBtn = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');

toggleBtn.addEventListener('click', () => {
  const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
  toggleBtn.setAttribute('aria-expanded', !expanded);
  navLinks.classList.toggle('show');
});


let lastScrollTop = 0;
const stickyBar = document.querySelector('.sticky-bar');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Background toggle
  if (scrollTop === 0) {
    stickyBar.classList.remove('scrolled'); // transparent at very top
  } else {
    stickyBar.classList.add('scrolled');    // white when scrolled down
  }

  // Show/hide on scroll direction
  if (scrollTop > lastScrollTop) {
    // scrolling down → hide
    stickyBar.classList.add('hidden');
  } else {
    // scrolling up → show
    stickyBar.classList.remove('hidden');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});


// Open Today Dynamic Text
document.addEventListener("DOMContentLoaded", function() {
  const openToday = document.getElementById("openToday");
  if (!openToday) return;

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex];

  openToday.textContent = `Open today – ${todayName}, 8:00 am – 7:00 pm`;
});


// Carousel Functionality
const carousel = document.querySelector('.carousel');
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const thumbs = Array.from(document.querySelectorAll('.carousel-thumbs img'));
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

let autoPlay = null;
let slideCount = slides.length;

// --- Clone first and last for seamless looping ---
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slideCount - 1].cloneNode(true);
firstClone.classList.add('clone');
lastClone.classList.add('clone');

track.insertBefore(lastClone, track.firstChild);
track.appendChild(firstClone);

const allSlides = Array.from(track.children); // includes clones
let currentIndex = 1; // start at first real slide

// --- Helper: calculate offset based on inner width + gap ---
function getStepSize() {
  const cStyle = getComputedStyle(carousel);
  const tStyle = getComputedStyle(track);

  // Read actual paddings (CSS uses %, computed style gives px)
  const paddingLeft = parseFloat(cStyle.paddingLeft) || 0;
  const paddingRight = parseFloat(cStyle.paddingRight) || 0;

  // Inner width = content box minus paddings
  const innerWidth = carousel.clientWidth - paddingLeft - paddingRight;

  // Gap between slides (in px)
  const gap = parseFloat(tStyle.gap) || 0;

  return innerWidth + gap;
}

// --- Move to slide ---
function updateTransform(animate = true) {
  const step = getStepSize();
  const offset = -(currentIndex * step);
  track.style.transition = animate ? 'transform 0.8s ease' : 'none'; // smoother speed
  track.style.transform = `translateX(${offset}px)`;
}

// --- Highlight active slide (for dimming logic) ---
function setActiveSlide(index) {
  allSlides.forEach((slide, i) => {
    if (!slide.classList.contains('clone')) {
      slide.classList.toggle('active', i === index);
    }
  });
}

// --- Normalize index after hitting clones ---
function normalizeIndex() {
  if (allSlides[currentIndex].classList.contains('clone')) {
    if (currentIndex === 0) {
      currentIndex = slideCount; // jump to last real
    } else if (currentIndex === allSlides.length - 1) {
      currentIndex = 1; // jump to first real
    }
    updateTransform(false); // jump without animation
  }
  const realIndex = currentIndex - 1;
  thumbs.forEach((t, i) => t.classList.toggle('active', i === realIndex));
  setActiveSlide(currentIndex); // ensure dimming is correct
}

// --- Navigation ---
function nextSlide() {
  currentIndex++;
  setActiveSlide(currentIndex);
  updateTransform(true);
}

function prevSlide() {
  currentIndex--;
  setActiveSlide(currentIndex);
  updateTransform(true);
}

// --- Autoplay ---
function startAutoPlay() {
  stopAutoPlay();
  autoPlay = setInterval(nextSlide, 5000);
}
function stopAutoPlay() {
  if (autoPlay) clearInterval(autoPlay);
}

// --- Events ---
nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

thumbs.forEach((thumb, i) => {
  thumb.addEventListener('click', () => {
    currentIndex = i + 1; // offset by leading clone
    setActiveSlide(currentIndex);
    updateTransform(true);
    startAutoPlay();
  });
});

track.addEventListener('transitionend', normalizeIndex);
window.addEventListener('resize', () => updateTransform(false));

// --- Init ---
updateTransform(false);
normalizeIndex();
startAutoPlay();



