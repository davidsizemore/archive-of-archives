const BASE_ARCHIVE_ITEMS = [
  {
    id: "a11y-toolkit",
    title: "Accessibility Toolkit",
    url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/",
    dateAdded: "2026-03-02",
    description:
      "Practical accessibility fundamentals and standards guidance for web creators.",
    categories: ["Accessibility", "Guides"],
    thumbnail: "https://picsum.photos/seed/a11y-toolkit/700/700",
  },
  {
    id: "css-reference",
    title: "CSS Reference",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    dateAdded: "2026-03-02",
    description: "Comprehensive CSS documentation with examples and syntax support.",
    categories: ["CSS", "Documentation"],
    thumbnail: "https://picsum.photos/seed/css-reference/700/700",
  },
  {
    id: "ux-patterns",
    title: "UX Patterns Collection",
    url: "https://ui-patterns.com/patterns",
    dateAdded: "2026-03-02",
    description:
      "A catalog of common interface patterns and examples for product design.",
    categories: ["Design", "UX"],
    thumbnail: "https://picsum.photos/seed/ux-patterns/700/700",
  },
  {
    id: "html-spec",
    title: "HTML Living Standard",
    url: "https://html.spec.whatwg.org/",
    dateAdded: "2026-03-02",
    description:
      "The official source for modern HTML behavior and semantic elements.",
    categories: ["HTML", "Documentation"],
    thumbnail: "https://picsum.photos/seed/html-spec/700/700",
  },
  {
    id: "performance-guide",
    title: "Web Performance Guide",
    url: "https://web.dev/learn/performance/",
    dateAdded: "2026-03-02",
    description:
      "Core web performance concepts and optimization techniques for faster sites.",
    categories: ["Performance", "Guides"],
    thumbnail: "https://picsum.photos/seed/performance-guide/700/700",
  },
  {
    id: "open-source-handbook",
    title: "Open Source Guide",
    url: "https://opensource.guide/",
    dateAdded: "2026-03-02",
    description:
      "Best practices for contributing to open-source projects and communities.",
    categories: ["Open Source", "Guides"],
    thumbnail: "https://picsum.photos/seed/open-source-handbook/700/700",
  },
  {
    id: "type-scale-library",
    title: "Type Scale Library",
    url: "https://example.com/type-scale-library",
    dateAdded: "2026-03-02",
    description:
      "Placeholder resource for typography systems, hierarchy, and readable scale choices.",
    categories: ["Design", "Guides"],
    thumbnail: "https://picsum.photos/seed/type-scale-library/700/700",
  },
  {
    id: "frontend-pattern-notes",
    title: "Frontend Pattern Notes",
    url: "https://example.com/frontend-pattern-notes",
    dateAdded: "2026-03-02",
    description:
      "Placeholder collection of reusable UI implementation patterns for web projects.",
    categories: ["HTML", "CSS"],
    thumbnail: "https://picsum.photos/seed/frontend-pattern-notes/700/700",
  },
];

const DUPLICATE_BATCHES = 2;

const DUPLICATED_ARCHIVE_ITEMS = Array.from(
  { length: DUPLICATE_BATCHES },
  (_, batchIndex) =>
    BASE_ARCHIVE_ITEMS.map((item) => ({
      ...item,
      id: `${item.id}-dup-${batchIndex + 1}`,
    }))
).flat();

export const ARCHIVE_ITEMS = [...BASE_ARCHIVE_ITEMS, ...DUPLICATED_ARCHIVE_ITEMS];
