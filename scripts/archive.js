import { ARCHIVE_ITEMS } from "../data/archive-items.js";

const cardsGrid = document.querySelector("#cards-grid");
const navFilterOptions = document.querySelector("#nav-filter-options");
const emptyState = document.querySelector("#empty-state");

const allCategories = Array.from(
  new Set(ARCHIVE_ITEMS.flatMap((item) => item.categories))
).sort((a, b) => a.localeCompare(b));

const selectedCategories = new Set();
const CARD_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
});

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
  if (item.thumbnail) {
    return item.thumbnail;
  }

  return `https://picsum.photos/seed/${encodeURIComponent(item.id)}/700/700`;
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
  topMetaText.textContent = item.categories.slice(0, 3).join(" • ").toUpperCase();
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
  mediaLink.setAttribute("aria-label", `${item.title} (opens in new tab)`);

  const mediaImage = document.createElement("img");
  mediaImage.className = "card-image";
  mediaImage.src = getThumbnailSrc(item);
  mediaImage.alt = item.title;
  mediaLink.appendChild(mediaImage);

  const mediaOverlay = document.createElement("div");
  mediaOverlay.className = "card-media-overlay";
  mediaLink.appendChild(mediaOverlay);

  const rightRail = document.createElement("div");
  rightRail.className = "card-rail card-rail-right";

  const rightRailType = document.createElement("span");
  rightRailType.className = "card-rail-text";
  rightRailType.textContent = "WEBSITE";

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
  bottomMetaStatic.textContent = item.description;

  const bottomMetaTrack = document.createElement("span");
  bottomMetaTrack.className = "card-description-track";

  const loopText = `${item.description} \u2022 `;

  const bottomMetaLoopA = document.createElement("span");
  bottomMetaLoopA.textContent = loopText;

  const bottomMetaLoopB = document.createElement("span");
  bottomMetaLoopB.textContent = loopText;

  bottomMetaTrack.append(bottomMetaLoopA, bottomMetaLoopB);
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
    return ARCHIVE_ITEMS;
  }

  return ARCHIVE_ITEMS.filter((item) =>
    item.categories.some((category) => selectedCategories.has(category))
  );
}

function renderCards() {
  const filteredItems = getFilteredItems();
  cardsGrid.innerHTML = "";

  filteredItems.forEach((item) => {
    cardsGrid.appendChild(createCard(item));
  });

  emptyState.hidden = filteredItems.length !== 0;
}

function renderFilters() {
  if (!navFilterOptions) {
    return;
  }

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
renderFilters();
renderCards();
