import { ARCHIVE_ITEMS } from "../data/archive-items.js";

const cardsGrid = document.querySelector("#cards-grid");
const navFilterOptions = document.querySelector("#nav-filter-options");
const navFilterBar = document.querySelector(".aoa-filter-nav");
const emptyState = document.querySelector("#empty-state");
const cardsSection = cardsGrid?.parentElement ?? null;

const allCategories = Array.from(
  new Set(ARCHIVE_ITEMS.flatMap((item) => item.categories))
).sort((a, b) => a.localeCompare(b));
const RANDOMIZED_ARCHIVE_ITEMS = getWeightedRandomizedItems(ARCHIVE_ITEMS);
const HAS_ARCHIVES = RANDOMIZED_ARCHIVE_ITEMS.length > 0;

const selectedCategories = new Set();
const CARD_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

const cardsSentinel = document.createElement("div");
cardsSentinel.className = "cards-sentinel";
cardsSentinel.setAttribute("aria-hidden", "true");
if (cardsSection) {
  cardsSection.appendChild(cardsSentinel);
}

let filteredItemsCache = [];
let renderedCount = 0;
let cardsObserver = null;
let marqueeRafId = 0;
let marqueeListenersBound = false;

function getResponsiveBatchSize() {
  const viewportWidth = window.innerWidth;
  if (viewportWidth < 700) {
    return 6;
  }

  if (viewportWidth < 1280) {
    return 12;
  }

  return 20;
}

function shuffleItems(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

function getWeightedRandomizedItems(items) {
  const topArchives = [];
  const otherArchives = [];

  items.forEach((item) => {
    if (item.isTopArchive === true) {
      topArchives.push(item);
      return;
    }

    otherArchives.push(item);
  });

  return [...shuffleItems(topArchives), ...shuffleItems(otherArchives)];
}

function applyMobileMarqueeWindow() {
  if (!cardsGrid) {
    return;
  }

  const cards = cardsGrid.querySelectorAll(".archive-card");

  if (window.innerWidth > 700) {
    cards.forEach((card) => card.classList.remove("is-marquee-active"));
    return;
  }

  const activeZoneTop = window.innerHeight / 6;
  const activeZoneBottom = window.innerHeight * (5 / 6);
  const viewportCenterY = window.innerHeight / 2;
  const activeCandidates = [];

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenterY = rect.top + rect.height / 2;
    const isInActiveZone =
      cardCenterY >= activeZoneTop && cardCenterY <= activeZoneBottom;

    card.classList.remove("is-marquee-active");

    if (isInActiveZone) {
      const distanceToViewportCenter = Math.abs(cardCenterY - viewportCenterY);
      activeCandidates.push({ card, distanceToViewportCenter });
    }
  });

  activeCandidates
    .sort((a, b) => a.distanceToViewportCenter - b.distanceToViewportCenter)
    .slice(0, 2)
    .forEach((entry) => {
      entry.card.classList.add("is-marquee-active");
    });
}

function scheduleMobileMarqueeUpdate() {
  if (marqueeRafId !== 0) {
    return;
  }

  marqueeRafId = window.requestAnimationFrame(() => {
    marqueeRafId = 0;
    applyMobileMarqueeWindow();
  });
}

function bindMobileMarqueeListeners() {
  if (marqueeListenersBound) {
    return;
  }

  marqueeListenersBound = true;
  window.addEventListener("scroll", scheduleMobileMarqueeUpdate, {
    passive: true,
  });
  window.addEventListener("resize", scheduleMobileMarqueeUpdate);
  window.addEventListener("orientationchange", scheduleMobileMarqueeUpdate);
}

function getSelectedFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("filters");
  if (!encoded) {
    return [];
  }

  return encoded
    .split(",")
    .map((value) => value.trim())
    .filter((value) => allCategories.includes(value));
}

function syncUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  if (selectedCategories.size === 0) {
    params.delete("filters");
  } else {
    params.set("filters", Array.from(selectedCategories).join(","));
  }

  const queryString = params.toString();
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;
  window.history.replaceState({}, "", newUrl);
}

function formatDisplayUrl(url) {
  try {
    const parsed = new URL(url);
    const hostAndPath = `${parsed.host}${parsed.pathname}`.replace(/\/$/, "");
    return hostAndPath.toUpperCase();
  } catch {
    return url.toUpperCase();
  }
}

function getThumbnailSrc(item) {
  return String(item.thumbnail ?? "");
}

function getCardStatus(item) {
  if (typeof item.status === "string" && item.status.trim().toLowerCase() === "active") {
    return CARD_STATUS.ACTIVE;
  }

  if (item.active === true) {
    return CARD_STATUS.ACTIVE;
  }

  return CARD_STATUS.INACTIVE;
}

function formatAddedDate(dateAdded) {
  if (typeof dateAdded === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateAdded.trim())) {
    return dateAdded.trim();
  }

  const parsed = new Date(dateAdded);
  if (Number.isNaN(parsed.getTime())) {
    return "UNKNOWN";
  }

  return parsed.toISOString().slice(0, 10);
}

function formatArchiveDescription(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return "IS AN ARCHIVE.";
  }

  const startsWithIs = /^is\b/i.test(normalized);
  const withPrefix = startsWithIs ? normalized : `is ${normalized}`;
  return withPrefix.toUpperCase();
}

function getArchiveName(item) {
  return String(item.archiveName ?? "UNTITLED ARCHIVE").toUpperCase();
}

function getArchiveLabel(item) {
  return String(item.archiveName ?? "Untitled archive");
}

function getArchiveDescription(item) {
  return formatArchiveDescription(item.archiveDescription);
}

function getTypeOfSite(item) {
  return String(item.typeOfSite ?? "website").toUpperCase();
}

function getCategoryMetaText(item) {
  if (!Array.isArray(item.categories) || item.categories.length === 0) {
    return "UNCATEGORIZED";
  }

  return item.categories
    .map((category) => String(category).trim())
    .filter(Boolean)
    .join(" • ")
    .toUpperCase();
}

function createBottomDescriptionChunk(item, includeBullet = false) {
  const chunk = document.createElement("span");
  chunk.className = "card-description-chunk";

  const name = document.createElement("span");
  name.className = "card-description-name";
  name.textContent = getArchiveName(item);

  const description = document.createElement("span");
  description.className = "card-description-archive-description";
  description.textContent = ` ${getArchiveDescription(item)}`;

  chunk.append(name, description);

  if (includeBullet) {
    const bullet = document.createElement("span");
    bullet.className = "card-description-bullet";
    bullet.textContent = " • ";
    chunk.appendChild(bullet);
  }

  return chunk;
}

function createCard(item) {
  const article = document.createElement("article");
  article.className = "archive-card";

  const topBar = document.createElement("div");
  topBar.className = "card-top-bar";

  const topCornerLeft = document.createElement("div");
  topCornerLeft.className = "card-corner";

  const topMeta = document.createElement("div");
  topMeta.className = "card-meta-row";
  const topMetaText = document.createElement("p");
  topMetaText.className = "card-meta-text";
  topMetaText.textContent = getCategoryMetaText(item);
  topMeta.appendChild(topMetaText);

  const topCornerRight = document.createElement("div");
  topCornerRight.className = "card-corner";

  topBar.append(topCornerLeft, topMeta, topCornerRight);

  const cardMain = document.createElement("div");
  cardMain.className = "card-main";
  cardMain.addEventListener("mouseenter", () => {
    article.classList.add("is-main-hovered");
  });
  cardMain.addEventListener("mouseleave", () => {
    article.classList.remove("is-main-hovered");
  });

  const leftRail = document.createElement("div");
  leftRail.className = "card-rail card-rail-left";
  const cardStatus = getCardStatus(item);
  leftRail.setAttribute("data-status", cardStatus.toLowerCase());
  const leftRailIcon = document.createElement("span");
  leftRailIcon.className = "card-rail-icon";
  leftRailIcon.setAttribute("aria-hidden", "true");

  const leftRailText = document.createElement("span");
  leftRailText.className = "card-rail-text";
  leftRailText.textContent = cardStatus;

  const leftRailStatus = document.createElement("div");
  leftRailStatus.className = "card-rail-status";
  leftRailStatus.append(leftRailIcon, leftRailText);

  const leftRailDate = document.createElement("span");
  leftRailDate.className = "card-rail-text card-rail-date";
  leftRailDate.textContent = formatAddedDate(item.dateAdded);

  leftRail.append(leftRailStatus, leftRailDate);

  const mediaLink = document.createElement("a");
  mediaLink.className = "card-media";
  mediaLink.href = item.url;
  mediaLink.target = "_blank";
  mediaLink.rel = "noopener noreferrer";
  mediaLink.setAttribute("aria-label", `${getArchiveLabel(item)} (opens in new tab)`);

  const mediaImage = document.createElement("img");
  mediaImage.className = "card-image";
  mediaImage.src = getThumbnailSrc(item);
  mediaImage.alt = getArchiveLabel(item);
  mediaImage.loading = "lazy";
  mediaImage.decoding = "async";
  mediaLink.appendChild(mediaImage);

  const mediaOverlay = document.createElement("div");
  mediaOverlay.className = "card-media-overlay";
  mediaLink.appendChild(mediaOverlay);

  const rightRail = document.createElement("div");
  rightRail.className = "card-rail card-rail-right";

  const rightRailType = document.createElement("span");
  rightRailType.className = "card-rail-text";
  rightRailType.textContent = getTypeOfSite(item);

  const rightRailUrl = document.createElement("span");
  rightRailUrl.className = "card-rail-text card-rail-url";
  rightRailUrl.textContent = formatDisplayUrl(item.url);

  rightRail.append(rightRailType, rightRailUrl);

  cardMain.append(leftRail, mediaLink, rightRail);

  const bottomBar = document.createElement("div");
  bottomBar.className = "card-bottom-bar";

  const bottomCornerLeft = document.createElement("div");
  bottomCornerLeft.className = "card-corner";

  const bottomMeta = document.createElement("div");
  bottomMeta.className = "card-meta-row";

  const bottomMetaText = document.createElement("p");
  bottomMetaText.className = "card-description";
  const bottomMetaStatic = document.createElement("span");
  bottomMetaStatic.className = "card-description-static";
  bottomMetaStatic.appendChild(createBottomDescriptionChunk(item, false));

  const bottomMetaTrack = document.createElement("span");
  bottomMetaTrack.className = "card-description-track";
  bottomMetaTrack.append(
    createBottomDescriptionChunk(item, true),
    createBottomDescriptionChunk(item, true)
  );
  bottomMetaText.append(bottomMetaStatic, bottomMetaTrack);
  bottomMeta.appendChild(bottomMetaText);

  const bottomCornerRight = document.createElement("div");
  bottomCornerRight.className = "card-corner";

  bottomBar.append(bottomCornerLeft, bottomMeta, bottomCornerRight);

  article.append(topBar, cardMain, bottomBar);
  return article;
}

function getFilteredItems() {
  if (selectedCategories.size === 0) {
    return RANDOMIZED_ARCHIVE_ITEMS;
  }

  return RANDOMIZED_ARCHIVE_ITEMS.filter((item) =>
    item.categories.some((category) => selectedCategories.has(category))
  );
}

function renderNextBatch() {
  const batchSize = getResponsiveBatchSize();
  const nextItems = filteredItemsCache.slice(
    renderedCount,
    renderedCount + batchSize
  );

  nextItems.forEach((item) => {
    cardsGrid.appendChild(createCard(item));
  });

  renderedCount += nextItems.length;
  const hasMore = renderedCount < filteredItemsCache.length;
  cardsSentinel.hidden = !hasMore;

  if (!hasMore && cardsObserver) {
    cardsObserver.disconnect();
  }

  scheduleMobileMarqueeUpdate();
}

function setupLazyBatchLoading() {
  if (cardsObserver) {
    cardsObserver.disconnect();
  }

  if (!cardsSection) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    while (renderedCount < filteredItemsCache.length) {
      renderNextBatch();
    }
    return;
  }

  if (filteredItemsCache.length <= renderedCount) {
    cardsSentinel.hidden = true;
    return;
  }

  cardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          renderNextBatch();
        }
      });
    },
    { root: null, rootMargin: "220px 0px", threshold: 0 }
  );

  cardsObserver.observe(cardsSentinel);
}

function renderCards() {
  filteredItemsCache = getFilteredItems();
  renderedCount = 0;
  cardsGrid.innerHTML = "";

  renderNextBatch();
  setupLazyBatchLoading();
  scheduleMobileMarqueeUpdate();

  emptyState.hidden = filteredItemsCache.length !== 0;
  emptyState.textContent = HAS_ARCHIVES
    ? "No links match your current filters."
    : "No archives yet. Add cards to data/archive-items.js.";
}

function renderFilters() {
  if (!navFilterOptions || !navFilterBar) {
    return;
  }

  if (!HAS_ARCHIVES || allCategories.length === 0) {
    navFilterBar.hidden = true;
    return;
  }

  navFilterBar.hidden = false;
  navFilterOptions.innerHTML = "";

  allCategories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "aoa-filter-item";
    button.textContent = category;

    if (selectedCategories.has(category)) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
      if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
        button.classList.remove("is-active");
      } else {
        selectedCategories.add(category);
        button.classList.add("is-active");
      }

      syncUrlFilters();
      renderCards();
    });

    navFilterOptions.appendChild(button);
  });
}

getSelectedFromUrl().forEach((category) => selectedCategories.add(category));
bindMobileMarqueeListeners();
renderFilters();
renderCards();
