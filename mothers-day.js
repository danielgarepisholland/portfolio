const publicBase = "https://pub-37e8787d920641d2a27e7f0655dcc64e.r2.dev/mothersday/";
const localBase = "./assets/mothersday/";
const webBase = "./assets/mothersday/web/";

const memories = [
  ["2004", "2004.JPG"],
  ["2005", "2005.JPG"],
  ["2006", "2006.JPG"],
  ["2007", "2007.JPG"],
  ["2008", "2008.JPG"],
  ["2009", "2009.JPG"],
  ["2010", "2010.JPG"],
  ["2011", "2011.JPG"],
  ["2012", "2012.JPG"],
  ["2013", "2013.jpg"],
  ["2014", "2014.JPG"],
  ["2015", "2015.JPG"],
  ["2016", "2016.JPG"],
  ["2017", "2017.JPG"],
  ["2018", "2018.JPG"],
  ["2019", "2019.JPG"],
  ["2020", "2020.jpeg"],
  ["2021", "2021.JPG"],
  ["2022", "2022.jpeg"],
  ["2023", "2023.jpg"],
  ["2024", "2024.jpeg"],
  ["2025", "2025.jpeg"],
  ["2026", "2026.jpeg"],
].map(([year, file]) => ({
  year,
  file,
  src: `${webBase}${year}.jpg`,
  original: `${publicBase}${file}`,
  fallback: `${localBase}${file}`,
}));

const activePhoto = document.getElementById("active-photo");
const activeYear = document.getElementById("active-year");
const strip = document.getElementById("year-strip");
const previousButton = document.getElementById("previous-year");
const nextButton = document.getElementById("next-year");
const playButton = document.getElementById("play-pause");
const photoButton = document.querySelector(".photo-button");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

let activeIndex = 0;
let isPlaying = true;
let timer = null;

function setImageSource(image, memory) {
  image.dataset.fallback = memory.fallback;
  image.src = memory.src;
}

function renderButtons() {
  strip.innerHTML = memories
    .map(
      (memory, index) => `
        <button
          class="year-button"
          type="button"
          data-index="${index}"
          aria-current="${index === activeIndex ? "true" : "false"}"
        >
          ${memory.year}
        </button>
      `
    )
    .join("");
}

function selectMemory(index, { keepPlayback = false } = {}) {
  activeIndex = (index + memories.length) % memories.length;
  const memory = memories[activeIndex];

  setImageSource(activePhoto, memory);
  activePhoto.alt = `${memory.year}`;
  activeYear.textContent = memory.year;

  document.querySelectorAll(".year-button").forEach((button, buttonIndex) => {
    button.setAttribute("aria-current", String(buttonIndex === activeIndex));
  });

  const currentButton = strip.querySelector(`[data-index="${activeIndex}"]`);
  currentButton?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

  if (!keepPlayback) pause();
}

function next({ keepPlayback = false } = {}) {
  selectMemory(activeIndex + 1, { keepPlayback });
}

function previous() {
  selectMemory(activeIndex - 1);
}

function play() {
  isPlaying = true;
  playButton.textContent = "Pause";
  clearInterval(timer);
  timer = setInterval(() => next({ keepPlayback: true }), 4200);
}

function pause() {
  isPlaying = false;
  playButton.textContent = "Play";
  clearInterval(timer);
}

function togglePlayback() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function openLightbox() {
  const memory = memories[activeIndex];
  setImageSource(lightboxImage, memory);
  lightboxImage.dataset.original = memory.original;
  lightboxImage.alt = activePhoto.alt;
  lightboxCaption.textContent = memory.year;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  pause();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
}

function handleImageError(event) {
  const image = event.target;
  const fallback = image.dataset.fallback;
  if (fallback && image.src !== new URL(fallback, window.location.href).toString()) {
    image.src = fallback;
  }
}

document.querySelectorAll("img[data-fallback]").forEach((image) => {
  image.addEventListener("error", handleImageError);
});

activePhoto.addEventListener("error", handleImageError);
lightboxImage.addEventListener("error", handleImageError);
previousButton.addEventListener("click", previous);
nextButton.addEventListener("click", () => next());
playButton.addEventListener("click", togglePlayback);
photoButton.addEventListener("click", openLightbox);
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.hidden && event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") next();
  if (event.key === "ArrowLeft") previous();
});

strip.addEventListener("click", (event) => {
  const button = event.target.closest(".year-button");
  if (!button) return;
  selectMemory(Number(button.dataset.index));
});

renderButtons();
selectMemory(0, { keepPlayback: true });
play();
