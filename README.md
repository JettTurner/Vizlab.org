# Vizlab.org

**Vizlab.org** is a curated gateway to the best resources for 3D artists, animators, VFX professionals, and CGI creators. Whether you're seeking inspiration, tutorials, or high-quality assets, Vizlab helps you spend less time searching and more time creating.

---

## 🚀 Live Features

- 🌐 **Centralized Resource Hub** – Find educational content, references, and assets in one place.
- 🎨 **Color-Coded Resources** – Quickly distinguish between free, one-time, and subscription-based links.
  - 🟢 Free resources
  - 🟡 One-time paid tools
  - 🔴 Subscription-based platforms
- 📁 **Categorized Browsing** – Browse by Education, Reference, and Assets.
  - **Education** – Courses, tutorials, and learning platforms
  - **Reference** – High-quality visual inspiration and technical guides
  - **Assets** – 3D models, rigs, brushes, and texture libraries
- 🖥️ **Dual-Screen Optimized** – Built to complement production workflows across two monitors.
- 🧠 **Thoughtfully Curated** – Every link is handpicked for value and usefulness.

---

## 📁 Project Structure

Here's a breakdown of the key components of the codebase:

### `src/`
Top-level folder for source files.

- `app.css`, `app.html`: Main entry styles and HTML template.
- `New Text Document.txt`: Placeholder or scratchpad file (safe to delete if unused).

### `src/lib/`
This is the heart of your application’s logic and components:

| File | Description |
|------|-------------|
| `Box.svelte` | Component for displaying an individual resource box with visual styling and interaction. |
| `BoxHolder.svelte` | The main resource grid that holds and displays all `Box` components. Handles layout and filtering. |
| `CategoryBreakdownPage.svelte` | Page component used to render categorized breakdowns for each resource type. |
| `clicks.json` | Temporary local JSON file for simulating click tracking. |
| `clickTracker.js` | Utility function for tracking and storing user click interactions on resource links. |
| `FilterDropdown.svelte` | A dropdown UI component used for tag-based filtering of resources. |
| `Footer.svelte` | Site footer component with links or meta info. |
| `Header.svelte` | Top navigation component, including sticky behavior and responsive hamburger menu. |
| `index.js` | Entry point exporting major components or utilities for easy importing. |
| `PossibleTagsForSites.txt` | A tag list used for filtering logic and matching resources. |
| `Sidebar.svelte` | (Deprecated or alternate use) A component originally for sidebar-based tag filters. |
| `sites.js` | Main data file with all site/resource entries including URLs, categories, and tags. |
| `software.js` | A list of software used for filtering or tagging (Maya, Blender, etc.). |
| `timeDelay.js` | A small utility for introducing delays, likely used for animation or vote cooldowns. |
| `urlFilters.js` | Functions used for filtering or parsing URLs for search and filter purposes. |

#### 🔒 Archive
Located under `src/lib/archive/`, these are older backups of `BoxHolder.svelte`. Useful for restoring previous versions.

---

## 🔧 Development

To run the site locally:

```bash
npm install
npm run dev
```

Open your browser at `http://localhost:5173` (or whichever port is specified).

---

## 💡 Future Features

- ✅ Voting (upvote/downvote) system per resource
- ✅ Local click tracking (ready for backend integration)
- 🚧 User login & personalized collections
- 🚧 Search auto-suggestions & tag cloud
- 🚧 Bookmark and history panel

---

## 🤝 Contributing

Got suggestions or found a useful resource to add? Pull requests and issues are welcome!

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**.

---

Let me know if you want badges, screenshots, or deployment instructions (e.g. Vercel, Netlify) added to the README!
















Thanks! Here's the corrected and improved `README.md` file with GPL-3.0 licensing, no YAML issues, and better formatting for GitHub:

---

```markdown
# Vizlab.org

**Vizlab.org** is a curated gateway to the best resources for 3D artists, animators, VFX professionals, and CGI creators. Whether you're seeking inspiration, tutorials, or high-quality assets, Vizlab helps you spend less time searching and more time creating.

---

## 🌟 Features

- 🎯 **Curated Library** – Only the most useful, high-quality resources, hand-picked for relevance.
- 🎨 **Color-Coded Listings** – Instantly identify:
  - 🟢 Free resources
  - 🟡 One-time paid tools
  - 🔴 Subscription-based platforms
- 🧠 **Smart Categorization** – Resources are split into:
  - **Education** – Courses, tutorials, and learning platforms
  - **Reference** – High-quality visual inspiration and technical guides
  - **Assets** – 3D models, rigs, brushes, and texture libraries
- 🖥️ **Dual-Screen Optimized** – Designed for second-monitor use, so you can browse while you create
- 📈 **Click Tracking + Voting** – Track what’s popular and cast your vote (stored locally for now)

---

## 📂 Project Structure

### `src/`

- `app.html` – Main HTML scaffold
- `app.css` – Global styles
- `New Text Document.txt` – Placeholder, can be removed

### `src/lib/` – Core Components & Logic

| File | Description |
|------|-------------|
| `Box.svelte` | UI for each individual resource card |
| `BoxHolder.svelte` | Holds and filters all resource boxes |
| `CategoryBreakdownPage.svelte` | Renders breakdown of resources by category |
| `clickTracker.js` | Handles local click tracking and saves interaction data |
| `clicks.json` | Local data file simulating backend click storage |
| `FilterDropdown.svelte` | Tag and category filter UI component |
| `Footer.svelte` | Footer with static info and navigation |
| `Header.svelte` | Responsive header with sticky nav and hamburger menu |
| `index.js` | Entry point for shared exports |
| `PossibleTagsForSites.txt` | Internal tag list used for filtering logic |
| `Sidebar.svelte` | Optional older sidebar filter UI |
| `sites.js` | The core resource list with all URLs and metadata |
| `software.js` | List of supported software for tag filtering |
| `timeDelay.js` | Utility for simple async timing (e.g., vote delay) |
| `urlFilters.js` | URL helper functions used for filtering/search |

#### 🗃️ Archives

- Located in `src/lib/archive/`
- Backup versions of major components like `BoxHolder.svelte`

---

## 🛠️ Development

To run locally:

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📸 Screenshots

Coming soon! (Or drop some desktop screenshots of dual-screen workflows.)

---

## 📜 License

This project is licensed under the **GNU General Public License v3.0**.

See the full license in [`LICENSE`](./LICENSE).

---

## 🤝 Contributing

Pull requests, suggestions, and resource submissions are all welcome!  
Please open an issue or create a fork if you’d like to contribute.

---

## 💬 Contact

Have a question or want to collaborate? Open an issue or reach out via the site’s contact section.

---

Thank you for visiting Vizlab.org – we hope you find the perfect resource to elevate your craft! 🎨✨
```

---

Let me know if you'd like me to generate a `LICENSE` file for GPL-3.0 as well!