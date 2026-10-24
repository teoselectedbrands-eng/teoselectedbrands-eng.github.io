# Aetherion — Public search-launch v0.9.3

## Precisely what this release does

- Keeps the current v0.9.2 website content, movement-first design and contact address unchanged.
- Changes the existing homepage robots meta tag from `noindex,nofollow` to `index,follow,max-image-preview:large`.
- Adds a canonical homepage URL, Open Graph sharing metadata, Twitter summary card, and Schema.org `WebSite` JSON-LD.
- Includes a root-only sitemap and permissive robots.txt.
- Keeps CNAME exactly `aetherionmovement.com`.

## Limitations and next release

This is **a single HTML page** containing 22 sections with `#/...` navigation. The sitemap contains **only the actual homepage**, not fictitious `/classes/` or `/journal/` URLs. Search engines will not index the 22 hash sections as independent pages. A later multi-page static export (real directory URLs, unique title/description/canonical per page, clean anchor links, updated sitemap) is needed for strong section-specific SEO. No Google ranking or indexing date can be guaranteed.

## Publishing on iPhone with Working Copy

1. Keep a backup of the current `main` version (the latest GitHub commit is your rollback point).
2. If replacing a full file is easy, replace only the root `index.html` with the one in this package. Otherwise follow the *minimal manual fix* below.
3. Add `robots.txt` and `sitemap.xml` at the repository root. Ensure `CNAME` remains unchanged.
4. In Working Copy, Commit changes and Push to `origin/main`. Verify GitHub Actions shows a green Pages deployment.
5. Visit `https://aetherionmovement.com/` on another browser and inspect the HTML for robots index instructions, then visit `https://aetherionmovement.com/robots.txt` and `/sitemap.xml`.
6. In Google Search Console, add a **Domain** property for `aetherionmovement.com`, copy Google's *unique* TXT verification string into Spaceship DNS, verify ownership, submit `sitemap.xml`, then use URL Inspection → Request indexing for the homepage.
7. In Bing Webmaster Tools, import your verified Search Console property or verify separately.

### Minimal manual fix when download/import of large HTML fails

Use the Working Copy HTML editor's Find & Replace feature in the root `index.html`:

Find EXACTLY: `noindex,nofollow`

Replace with EXACTLY: `index,follow,max-image-preview:large`

Then Commit and Push. Do **not** replace arbitrary other text or change your email/DNS records. This minimal fix allows indexing, but does not add the optional SEO metadata, sitemap or robots.txt. Do not press Fork & Push: authorize the existing remote instead.

## Notes

- Google ignores `<meta name="keywords">`; don't waste time stuffing keywords there.
- Avoid adding made-up business addresses, practitioner services, event dates, reviews or workshop bookings.
- Spaceship MX/SPF/DKIM/DMARC mail records are separate from website indexing. Don't replace or remove them.
- Avoid keeping a staging/noindex build on the same production domain after this change.
