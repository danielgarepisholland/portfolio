const workerBase = "https://r2-asset-index.danielgarepisholland.workers.dev";
const gallery = document.getElementById("photo-gallery");
const status = document.getElementById("gallery-status");
const visualStories = document.getElementById("visual-stories");
const creativeStage = document.getElementById("creative-stage");

const photoDetails = [
  ["elementaryschoomural", "Leonard R. Flynn Elementary mural"],
  ["flowersinsf2", "San Francisco spring blossoms"],
  ["flowersinsf", "Street-side blossoms in San Francisco"],
  ["norcalcliff", "Northern California coastal bluff"],
  ["norcalocean", "Pacific coastline in Northern California"],
  ["paloaltohsdroneshot", "Palo Alto High School from above"],
  ["palysunset", "Palo Alto streetlight at sunset"],
  ["communitymosaic", "Community mosaic in progress"],
  ["elementaryschooflute", "Student flute performance"],
  ["gardenvolunteerwithkid", "Garden volunteer table"],
  ["graduation", "Graduation procession"],
  ["greenwasteeducationkid", "Green waste education table"],
  ["newbagelshop", "Neighborhood bagel shop opening"],
  ["pottery", "Pottery wheel demonstration"],
  ["spiritweekfloats", "Spirit week float building"],
  ["spiritweekhappy", "Student crowd during spirit week"],
  ["tiredesther", "Candid moment in a student crowd"],
  ["trumpet", "Marching band trumpet line"],
  ["udiststreetfar1", "University District street fair crowd"],
  ["udiststreetfar2", "Vendors and pedestrians at the U-District street fair"],
  ["riyakapi", "Portrait study"],
  ["shyannakapi", "Portrait study"],
  ["soyang", "Outdoor portrait by the water"],
  ["wedding", "Wedding portrait"],
  ["yash", "Portrait study"],
  ["cheertower", "Cheer stunt under stadium lights"],
  ["dancepompoms", "Poms performance in motion"],
  ["footballqbrush2", "Football play under pressure"],
  ["footballqbrush", "Football sideline action"],
  ["socceraerialcontest", "Soccer aerial contest"],
  ["soccercuttinginside", "Soccer player cutting inside"],
];

const photoStorylines = [
  {
    label: "Public realm",
    title: "Street fair as urban texture",
    text: "Crowds, tents, storefronts, crossings, and evening street light make the city feel active instead of abstract.",
    patterns: ["udiststreetfar2", "udiststreetfar1", "palysunset", "newbagelshop"],
    layout: "wide",
  },
  {
    label: "Civic making",
    title: "Hands, walls, gardens, classrooms",
    text: "The strongest community images are process images: people making, teaching, performing, and turning institutions into lived places.",
    patterns: ["communitymosaic", "elementaryschoomural", "greenwasteeducationkid", "gardenvolunteerwithkid", "pottery"],
    layout: "mosaic",
  },
  {
    label: "Campus rituals",
    title: "Institutions have atmosphere",
    text: "Graduation, spirit events, music, and school culture show institutions at human scale: organized, emotional, and visually dense.",
    patterns: ["graduation", "spiritweekhappy", "trumpet", "spiritweekfloats", "elementaryschooflute"],
    layout: "stack",
  },
  {
    label: "Motion",
    title: "Timing under stadium light",
    text: "Sports and performance images bring the clearest proof of timing: bodies suspended, crowds blurred, and the decisive frame doing the work.",
    patterns: ["cheertower", "socceraerialcontest", "soccercuttinginside", "dancepompoms", "footballqbrush2"],
    layout: "dark",
  },
  {
    label: "Portraits",
    title: "People with presence",
    text: "The portrait set should be treated more quietly: less portfolio wallpaper, more evidence that you can make people look composed and specific.",
    patterns: ["riyakapi", "shyannakapi", "soyang", "yash"],
    layout: "strip",
  },
  {
    label: "Quiet place",
    title: "Atmosphere as supporting material",
    text: "Flowers, coastline, campus edges, and landscape images work best as texture around the main stories, not as the center of the portfolio.",
    patterns: ["flowersinsf2", "norcalcliff", "norcalocean", "paloaltohsdroneshot"],
    layout: "quiet",
  },
];

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  document.documentElement.style.setProperty("--scroll", progress.toFixed(4));

  const splash = document.querySelector(".splash");
  if (splash) {
    const rect = splash.getBoundingClientRect();
    const splashProgress = Math.min(
      1,
      Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
    );
    document.documentElement.style.setProperty("--splash-progress", splashProgress.toFixed(4));
  }
}

function observeReveals() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

function formatLabel(key) {
  const lowerKey = key.toLowerCase();
  const detail = photoDetails.find(([pattern]) => lowerKey.includes(pattern));
  if (detail) return detail[1];

  return key
    .split("/")
    .pop()
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function photosForStory(items, story) {
  return story.patterns
    .map((pattern) => items.find((item) => item.key.toLowerCase().includes(pattern)))
    .filter(Boolean);
}

function photoByPattern(items, pattern) {
  return items.find((item) => item.key.toLowerCase().includes(pattern));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function photoExpandButton(photo, alt, imgClass = "") {
  const safeUrl = escapeHtml(photo.url);
  const safeAlt = escapeHtml(alt);
  const safeClass = escapeHtml(imgClass);

  return `
    <button
      class="photo-expand"
      type="button"
      data-full="${safeUrl}"
      data-caption="${safeAlt}"
      aria-label="Expand photograph: ${safeAlt}"
    >
      <img
        ${safeClass ? `class="${safeClass}"` : ""}
        src="${safeUrl}"
        alt="${safeAlt}"
        loading="lazy"
      >
    </button>
  `;
}

function renderCreativeStage(items) {
  if (!creativeStage) return;

  if (creativeStage.classList.contains("massive")) {
    const feature = photoByPattern(items, "cheertower") || items[0];
    const secondary = [
      ["udiststreetfar2", "Public realm"],
      ["communitymosaic", "Civic making"],
      ["socceraerialcontest", "Motion"],
    ]
      .map(([pattern, label]) => {
        const photo = photoByPattern(items, pattern);
        return photo ? { ...photo, label } : null;
      })
      .filter(Boolean);

    creativeStage.innerHTML = `
      <figure class="stage-feature-photo">
        ${photoExpandButton(feature, formatLabel(feature.key), "stage-feature-img")}
      </figure>
      <div class="stage-graphic" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="stage-index" aria-label="Creative photo directions">
        ${secondary
          .map(
            (photo) => `
              <button
                class="stage-index-item photo-expand"
                type="button"
                data-full="${escapeHtml(photo.url)}"
                data-caption="${escapeHtml(formatLabel(photo.key))}"
                aria-label="Expand photograph: ${escapeHtml(formatLabel(photo.key))}"
              >
                <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(formatLabel(photo.key))}" loading="lazy">
                <span>${photo.label}</span>
              </button>
            `
          )
          .join("")}
      </div>
    `;
    return;
  }

  const stagePhotos = [
    ["cheertower", "Motion"],
    ["communitymosaic", "Civic making"],
    ["udiststreetfar2", "Public realm"],
    ["trumpet", "Campus ritual"],
    ["socceraerialcontest", "Action"],
  ]
    .map(([pattern, label]) => {
      const photo = photoByPattern(items, pattern);
      return photo ? { ...photo, label } : null;
    })
    .filter(Boolean);

  creativeStage.innerHTML = stagePhotos
    .map(
      (photo, index) => `
        <figure class="stage-photo stage-photo-${index + 1}">
          <button
            class="photo-expand"
            type="button"
            data-full="${escapeHtml(photo.url)}"
            data-caption="${escapeHtml(photo.label)}"
            aria-label="Expand photograph: ${escapeHtml(photo.label)}"
          >
            <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.label)}" loading="${index === 0 ? "eager" : "lazy"}">
          </button>
          <figcaption>${photo.label}</figcaption>
        </figure>
      `
    )
    .join("");
}

function renderVisualStories(items) {
  if (!visualStories) return;

  const storyMarkup = photoStorylines
    .map((story) => {
      const photos = photosForStory(items, story);
      if (!photos.length) return "";

      const [leadPhoto, ...supportingPhotos] = photos;
      const supportingMarkup = supportingPhotos
        .map((photo, index) => `
          <figure class="story-support-photo story-support-photo-${(index % 4) + 1}">
            <div class="story-support-frame">
              ${photoExpandButton(photo, formatLabel(photo.key))}
            </div>
            <figcaption>${formatLabel(photo.key)}</figcaption>
          </figure>
        `)
        .join("");

      return `
        <article class="visual-story visual-story-${story.layout} reveal">
          <div class="visual-story-hero">
            <div class="visual-story-media">
              ${photoExpandButton(leadPhoto, story.title, "visual-story-lead")}
            </div>
            <div class="visual-story-copy">
              <span>${story.label}</span>
              <h3>${story.title}</h3>
              <p>${story.text}</p>
            </div>
          </div>
          <div class="story-support-wall">
            ${supportingMarkup}
          </div>
        </article>
      `;
    })
    .join("");

  visualStories.innerHTML = storyMarkup;
}

async function loadGallery() {
  if (!gallery && !status && !visualStories && !creativeStage) return;

  try {
    const response = await fetch(`${workerBase}/assets?prefix=photos/&limit=1000`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const items = Array.isArray(data.objects) ? data.objects : [];

    if (!items.length) {
      if (status) {
        status.textContent = "No images found in the photos/ prefix yet.";
      }
      return;
    }

    renderCreativeStage(items);
    renderVisualStories(items);

    if (!gallery) {
      if (status) {
        status.textContent = `${items.length} images available in the current R2 archive.`;
      }
      observeReveals();
      return;
    }

    const galleryLimit = Number.parseInt(gallery.dataset.galleryLimit || "", 10);
    const visibleItems = Number.isFinite(galleryLimit) ? items.slice(0, galleryLimit) : items;

    if (status) {
      status.textContent =
        visibleItems.length === items.length
          ? `${items.length} images loaded from the current R2 archive.`
          : `Showing ${visibleItems.length} selected images from ${items.length} current R2 uploads.`;
    }

    gallery.innerHTML = visibleItems
      .map((item, index) => {
        const label = formatLabel(item.key);
        return `
          <figure class="gallery-card gallery-card-${(index % 9) + 1} reveal">
            <div class="gallery-frame">
              ${photoExpandButton(item, label)}
            </div>
            <figcaption class="gallery-caption">${label}</figcaption>
          </figure>
        `;
      })
      .join("");

    observeReveals();
  } catch (error) {
    if (status) {
      status.textContent = "Photo archive unavailable. Check the Worker endpoint or the R2 photos/ prefix.";
    }
    console.error(error);
  }
}

function closeLightbox() {
  const lightbox = document.querySelector(".photo-lightbox");
  if (lightbox) {
    lightbox.remove();
    document.body.classList.remove("lightbox-open");
  }
}

function openLightbox(src, caption) {
  closeLightbox();

  const lightbox = document.createElement("div");
  lightbox.className = "photo-lightbox";

  const closeButton = document.createElement("button");
  closeButton.className = "photo-lightbox-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close expanded photograph");
  closeButton.textContent = "Close";

  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  image.src = src;
  image.alt = caption;
  figcaption.textContent = caption;
  figure.append(image, figcaption);
  lightbox.append(closeButton, figure);

  document.body.appendChild(lightbox);
  document.body.classList.add("lightbox-open");
  closeButton.focus();
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest(".photo-expand");
  if (trigger) {
    openLightbox(trigger.dataset.full, trigger.dataset.caption || "Expanded photograph");
    return;
  }

  if (
    event.target.matches(".photo-lightbox") ||
    event.target.matches(".photo-lightbox-close")
  ) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

updateScrollState();
observeReveals();
loadGallery();
