# Serverless Puppeteer

> Web search API that returns the first 5 result URLs for a given phrase. Built with **Next.js** and **Puppeteer**, using DuckDuckGo HTML for results.

---

## Tech stack

| Layer   | Tech              |
|--------|-------------------|
| Runtime| Node.js           |
| Framework | Next.js        |
| UI     | React             |
| Automation | Puppeteer      |

---

## Project structure

| Folder       | Purpose                                      |
|-------------|-----------------------------------------------|
| `basics/`   | Puppeteer helpers (browser, page, navigation) |
| `business/` | Search logic (DuckDuckGo HTML)                |
| `pages/api/`| Next.js API routes                           |

---

## Local setup

1. **Install dependencies**
   ```bash
   npm run setup
   ```

2. **Start the dev server**
   ```bash
   npm run run
   ```

3. **Open** [http://localhost:3030](http://localhost:3030)

---

## API

### `POST /api/search`

Returns the first 5 search result URLs for the given phrase.

**Request body (JSON):**

```json
{
  "searchPhrase": "your search query"
}
```

**Success response:**

```json
{
  "urls": [
    "https://example.com/...",
    "https://..."
  ]
}
```

**Error handling:** On failure the response includes `urls: []` and optionally an `error` field.

---

### Testing (production)

Examples below call the deployed API at **https://example-serverless-puppeteer.vercel.app/**.

**cURL:**

```bash
curl -X POST https://example-serverless-puppeteer.vercel.app/api/search \
  -H "Content-Type: application/json" \
  -d "{\"searchPhrase\": \"hello world\"}"
```
