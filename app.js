const header = document.querySelector(".site-header");
const menuLayer = document.querySelector(".menu-layer");
const burger = document.querySelector(".burger");
const closeButton = document.querySelector(".menu-close");
const backdrop = document.querySelector(".menu-backdrop");

const menuLinks = document.querySelectorAll(
  ".menu-nav a, .menu-panel .brand, .menu-footer a",
);

function setMenu(open) {
  if (!menuLayer || !burger) return;

  menuLayer.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);

  burger.setAttribute("aria-expanded", String(open));
  menuLayer.setAttribute("aria-hidden", String(!open));

  if (open) {
    window.setTimeout(() => {
      closeButton?.focus();
    }, 120);
  }
}

burger?.addEventListener("click", () => {
  setMenu(true);
});

closeButton?.addEventListener("click", () => {
  setMenu(false);
});

backdrop?.addEventListener("click", () => {
  setMenu(false);
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMenu(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuLayer?.classList.contains("is-open")) {
    setMenu(false);
  }
});

function initSlider(slider) {
  const track = slider.querySelector(".cards-slider__track");
  const section = slider.closest(".section");

  const previousButton = section?.querySelector(".slider-button--prev");
  const nextButton = section?.querySelector(".slider-button--next");
  const currentElement = section?.querySelector(".slider-progress__current");
  const totalElement = section?.querySelector(".slider-progress__total");
  const progressElement = section?.querySelector(".slider-progress__line span");

  if (!track) return;

  const slides = Array.from(track.children);

  if (!slides.length) return;

  const formatNumber = (number) => {
    return String(number).padStart(2, "0");
  };

  const getGap = () => {
    const styles = window.getComputedStyle(track);

    return parseFloat(styles.columnGap || styles.gap) || 0;
  };

  const getStep = () => {
    return slides[0].getBoundingClientRect().width + getGap();
  };

  const getCurrentIndex = () => {
    return Math.min(
      slides.length - 1,
      Math.max(0, Math.round(track.scrollLeft / getStep())),
    );
  };

  const getVisibleSlides = () => {
    const sliderWidth = track.getBoundingClientRect().width;
    return Math.max(1, Math.round(sliderWidth / getStep()));
  };

  const updateSlider = () => {
    const currentIndex = getCurrentIndex();
    const visibleSlides = getVisibleSlides();
    const lastStartIndex = Math.max(0, slides.length - visibleSlides);
    const progress = (currentIndex + 1) / slides.length;

    if (currentElement) {
      currentElement.textContent = formatNumber(currentIndex + 1);
    }

    if (totalElement) {
      totalElement.textContent = formatNumber(slides.length);
    }

    if (progressElement) {
      progressElement.style.transform = `scaleX(${progress})`;
    }

    if (previousButton) {
      previousButton.disabled = currentIndex <= 0;
    }

    if (nextButton) {
      nextButton.disabled = currentIndex >= lastStartIndex;
    }
  };

  const moveSlider = (direction) => {
    track.scrollBy({
      left: getStep() * direction,
      behavior: "smooth",
    });
  };

  previousButton?.addEventListener("click", () => {
    moveSlider(-1);
  });

  nextButton?.addEventListener("click", () => {
    moveSlider(1);
  });

  track.addEventListener("scroll", updateSlider, {
    passive: true,
  });

  window.addEventListener("resize", updateSlider);

  updateSlider();
}

document.querySelectorAll("[data-slider]").forEach(initSlider);

const slides = document.querySelectorAll(".certificate-slide");
const prevBtn = document.querySelector(".cert-prev");
const nextBtn = document.querySelector(".cert-next");

let currentCert = 0;

function updateCertificateSlider() {
  slides.forEach((slide) => {
    slide.classList.remove("active", "prev", "next", "prev-2", "next-2");
  });

  const total = slides.length;

  const prev = (currentCert - 1 + total) % total;
  const next = (currentCert + 1) % total;
  const prev2 = (currentCert - 2 + total) % total;
  const next2 = (currentCert + 2) % total;

  slides[currentCert].classList.add("active");
  slides[prev].classList.add("prev");
  slides[next].classList.add("next");
  slides[prev2].classList.add("prev-2");
  slides[next2].classList.add("next-2");
}

prevBtn.addEventListener("click", () => {
  currentCert = (currentCert - 1 + slides.length) % slides.length;
  updateCertificateSlider();
});

nextBtn.addEventListener("click", () => {
  currentCert = (currentCert + 1) % slides.length;
  updateCertificateSlider();
});

updateCertificateSlider();

document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;

    document.querySelectorAll(".faq-item").forEach((faq) => {
      if (faq !== item) faq.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});

document.querySelectorAll(".about-section__read-more").forEach((button) => {
  const contentId = button.getAttribute("aria-controls");
  const content = document.getElementById(contentId);

  if (!content) return;

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    content.classList.toggle("is-open", !isOpen);

    const label = button.querySelector("span");

    if (label) {
      label.textContent = isOpen ? "Дізнатися більше" : "Згорнути";
    }
  });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const currentItem = button.closest(".faq-item");

    if (!currentItem) return;

    const shouldOpen = !currentItem.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");

      const itemButton = item.querySelector(".faq-question");
      itemButton?.setAttribute("aria-expanded", "false");
    });

    if (shouldOpen) {
      currentItem.classList.add("active");
      button.setAttribute("aria-expanded", "true");
    }
  });
});
