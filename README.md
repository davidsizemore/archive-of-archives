# Archive of Archives

An archive that curates outbound links to other archives. Submissions are welcome

## How to submit a new archive card

1. Open `data/archive-items.js`.
2. Add a new object to the `BASE_ARCHIVE_ITEMS` array, with the required card information.

- `id` (string): unique kebab-case key, example `experimental-jetset-magazine`
- `archiveName` (string): name shown first in the card meta row
- `archiveDescription` (string): phrase shown after the archive name in the card meta row; must begin with `is`
- `url` (string): full destination URL, must start with `https://`
- `dateAdded` (string): date the card is added, in `YYYY-MM-DD` format
- `typeOfSite` (string): short site type label shown on the card rail (example: `website`, `youtube`, `blogspot`)
- `status` (string): card status, must be `active` or `inactive`
- `categories` (string array): at least one category filter label, using an existing label unless adding something completely unique
- `thumbnail` (string): image path using local repo path (example: `/images/thumbnails/your-card-id.webp`)

### Card template example

```js
{
  id: "unique-id",
  archiveName: "Resource title",
  archiveDescription: "is a living archive of independent artist-run spaces.",
  url: "https://example.com",
  dateAdded: "2026-03-02",
  typeOfSite: "website",
  status: "active",
  categories: ["Category One", "Category Two"],
  thumbnail: "/images/thumbnails/unique-id.webp",
}
```

### Thumbnail requirements

- Max file size: `150 KB` per thumbnail
- Allowed formats: `.webp`, `.jpg`, `.jpeg`, `.png`
- Preferred format: `.webp` when possible
- Recommended dimensions: `600x600` square source image
- Store uploaded files in: `images/thumbnails/`

## Open-source contribution workflow

1. Fork this repository on GitHub.
2. Create a new branch (example: `add-my-resource-card`).
3. Add one or more cards in `data/archive-items.js`.
4. Add thumbnail files to `images/thumbnails/`.
5. Keep each thumbnail at or under `150 KB`.
6. Use only allowed thumbnail formats (`.webp`, `.jpg`, `.jpeg`, `.png`).
7. Confirm the site still loads and filters correctly.
8. Open a pull request with a concise description of your additions.

## Pull request checklist

- [ ] Card IDs are unique and kebab-case
- [ ] All URLs are valid and use HTTPS
- [ ] `dateAdded` uses `YYYY-MM-DD` and reflects when the card was added
- [ ] `archiveDescription` starts with `is`
- [ ] `typeOfSite` is provided (example: `website`, `youtube`, `blogspot`)
- [ ] `status` is set to `active` or `inactive`
- [ ] `thumbnail` points to a valid image (`/images/thumbnails/...`)
- [ ] Thumbnail file size is `<= 150 KB`
- [ ] Thumbnail file extension is `.webp`, `.jpg`, `.jpeg`, or `.png`
- [ ] `archiveDescription` is concise and clear
- [ ] Categories are relevant and consistent
- [ ] Archive page renders and filtering behaves as expected

Note: PRs automatically run a GitHub Action that fails if any file in
`images/thumbnails/` is over `150 KB` or uses a disallowed file extension.
