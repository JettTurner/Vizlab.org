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
  - **Getting Started** – a currated collection of all the best resources for the beggining artist
  - **Documentation** – a quick way to get to various program documentation
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