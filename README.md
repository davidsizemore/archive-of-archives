# Archive of Archives

A simple, responsive archive website that curates outbound links to useful resources.

## Project scope (MVP)

- One responsive archive page (`index.html`)
- Reusable card layout rendered from a single hardcoded data source
- Multi-select category filtering

## Local development

This project is static HTML/CSS/JS. You can open `index.html` directly in your
browser, or run a local static server if you prefer.

Example with Python:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## How to add a new archive card

1. Open `data/archive-items.js`.
2. Add a new object to the `ARCHIVE_ITEMS` array:

```js
{
  id: "unique-id",
  title: "Resource title",
  url: "https://example.com",
  dateAdded: "2026-03-02",
  description: "One concise sentence about why this resource is useful.",
  categories: ["Category One", "Category Two"],
  thumbnail: "https://example.com/image.jpg",
}
```

### Field conventions

- `id`: lowercase kebab-case and unique across all cards
- `title`: short and clear
- `url`: full `https://` URL
- `dateAdded`: date the card was added, using `YYYY-MM-DD`
- `description`: one sentence, plain language
- `categories`: 1-3 categories; reuse existing labels when possible
- `thumbnail`: direct image URL used in the card preview panel

## Open-source contribution workflow

1. Fork this repository on GitHub.
2. Create a new branch (example: `add-my-resource-card`).
3. Add one or more cards in `data/archive-items.js`.
4. Confirm the site still loads and filters correctly.
5. Open a pull request with a concise description of your additions.

## Pull request checklist

- [ ] Card IDs are unique and kebab-case
- [ ] All URLs are valid and use HTTPS
- [ ] `dateAdded` uses `YYYY-MM-DD` and reflects when the card was added
- [ ] Descriptions are concise and clear
- [ ] Categories are relevant and consistent
- [ ] Archive page renders and filtering behaves as expected

## Deploy to Hostinger (GitHub Actions)

This repository includes `.github/workflows/deploy-hostinger.yml`.

- It runs on pushes to `main` (including when a PR is merged).
- It deploys site files to Hostinger over FTPS.

### Required GitHub repository secrets

Add these in GitHub -> Settings -> Secrets and variables -> Actions:

- `HOSTINGER_FTP_SERVER` (example: `ftp.yourdomain.com`)
- `HOSTINGER_FTP_USERNAME`
- `HOSTINGER_FTP_PASSWORD`
- `HOSTINGER_SERVER_DIR` (example: `/public_html/`)

### Notes

- If your Hostinger plan requires plain FTP instead of FTPS, change `protocol: ftps` to `protocol: ftp` in the workflow.
- If your default branch is not `main`, update the workflow trigger branch accordingly.
