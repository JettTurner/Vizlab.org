import { writable, get } from "svelte/store";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { links as sites } from "$lib/sites.js";
import { derived } from "svelte/store";

// ✅ Extract unique filters dynamically
export let allTags = [...new Set(sites.flatMap(site => site.tags || []))];
export let allCategories = [...new Set(sites.flatMap(site => site.category || []))];
export let allPrices = [...new Set(sites.flatMap(site => site.price || []))];
export let allSoftware = [...new Set(sites.flatMap(site => site.software || []))];

// ✅ Ensure "Main" category always exists
if (!allCategories.includes("Main")) {
  allCategories.unshift("Main");
}

// ✅ Writable stores for filters
export let selectedTags = writable([]);
export let selectedCategories = writable([]);
export let selectedPrices = writable([]);
export let selectedSoftware = writable([]);
export let searchQuery = writable("");
export const sortOption = writable("none");
export const sortDirection = writable("desc");
export let scoreThreshold = writable(0);
export let lastQuery = writable("");

export const showFilterDropdown = writable(false);

// Sorting options
export const sortOptions = [
  { value: "none", label: "None" },
  { value: "popularity", label: "Most Popular" },
  { value: "alphabetical", label: "A–Z" },
  //{ value: "likes", label: "Most Liked" },
  //{ value: "date", label: "Newest" },
];


let mounted = false;

//======================== BASIC FUNCTIONS ===========================================================================================================================

// Disable Category filters logic
export function isCategoryDisabled(category, selectedCategories, filteredSites) {
  return selectedCategories.length > 0 && filteredSites.every(site => site.category !== category);
}
// Disable Tag filters logic
export function isTagDisabled(tag, selectedTags, filteredSites) {
  return selectedTags.length > 0 && filteredSites.every(site => !site.tags.includes(tag));
}
// Disable Software filters logic
export function isSoftwareDisabled(software, selectedSoftware, filteredSites) {
  return selectedSoftware.length > 0 && filteredSites.every(site => !site.software.includes(software));
}
// Disable Price filters logic
export function isPriceDisabled(price, selectedPrices, filteredSites) {
  return selectedPrices.length > 0 && filteredSites.every(site => site.price !== price);
}

// ✅ Clear all filters from the specified store
export function clearAllFilters() {
  selectedTags.set([]);
  selectedCategories.set([]);
  selectedPrices.set([]);
  selectedSoftware.set([]);
  searchQuery.set("");
  scoreThreshold.set(0);
  updateURL();
}

// used for making sure the clear filters button 
export const hasActiveFilters = derived(
	[selectedTags, selectedCategories, selectedPrices, selectedSoftware, searchQuery, scoreThreshold],
	([$tags, $categories, $prices, $software, $search, $score]) => {
		// Ignore early false-negatives before mounted
		if (!mounted) return false;
		return (
			$tags.length > 0 ||
			$categories.length > 0 ||
			$prices.length > 0 ||
			$software.length > 0 ||
			$search.length > 0 ||
			$score > 0
		);
	}
);


//======================== SORT AND FILTER (UNUSED) ===========================================================================================================================
export function getFilteredAndSortedSites(inputSites, selectedTags, searchTerm, priceFilter, sortOption, sortDirection) {
  try {
    console.log("Filtering and sorting sites...");
	console.log("allSites at module level:", allSites);

    if (!inputSites || !Array.isArray(inputSites)) {
      console.log("Sites not found or not an array");
      return [];
    }

    let sites = [...inputSites];
    console.log("input sites:", sites);

    const filteredSites = sites.filter(site => {
      const hasMatchingTags = selectedTags.length === 0 || selectedTags.every(tag => site.tags?.includes(tag));
      const matchesSearch = !searchTerm || site.title?.toLowerCase().includes(searchTerm.toLowerCase()) || site.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = priceFilter.length === 0 || priceFilter.includes(site.price);

      return hasMatchingTags && matchesSearch && matchesPrice;
    });

    console.log("Filtered sites:", filteredSites);

    const sortedSites = sortSites(filteredSites, sortOption, sortDirection);
    console.log("Sorted sites:", sortedSites);
    
    return sortedSites;

  } catch (err) {
    console.error("getFilteredAndSortedSites error:", err);
    return [];
  }
}
// Sort helper
export function sortSites(sites, sortKey, direction) {
	if (!sortKey || sortKey === "none") return sites; // Don't sort at all
	
	return [...sites].sort((a, b) => {
		let valA, valB;

		switch (sortKey) {
			case "likes":
				valA = a.likes ?? 0;
				valB = b.likes ?? 0;
				break;
			case "date":
				valA = new Date(a.dateAdded);
				valB = new Date(b.dateAdded);
				break;
			case "popularity":
				valA = a.clickCount ?? 0;
				valB = b.clickCount ?? 0;
				break;
			case "alphabetical":
				valA = (a.title ?? "").toLowerCase();
				valB = (b.title ?? "").toLowerCase();
				break;
			default:
				return 0;
		}

		const comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
		return direction === "asc" ? comparison : -comparison;
	});
}

//======================== URL HANDLING ===========================================================================================================================

/**
 * ✅ Parses URL parameters into an array safely.
 * @param {string|null} params - The URL parameter string.
 * @returns {string[]} - An array of values, or an empty array if none exist.
 */
export function parseUrlParams(params) {
  return params ? decodeURIComponent(params).split(",") : [];
  return items.filter(Boolean); // Remove empty strings
}

// 🏁 ✅ Load filters from the URL only once on page mount
export function loadFiltersFromURL() {
	return page.subscribe(($page) => {
		const params = $page.url.searchParams;

		setTimeout(() => {
			selectedTags.set(parseUrlParams(params.get("tags")));
			selectedCategories.set(parseUrlParams(params.get("categories")));
			selectedPrices.set(parseUrlParams(params.get("prices")));
			selectedSoftware.set(parseUrlParams(params.get("software")));
			searchQuery.set(params.get("search") || "");
			scoreThreshold.set(params.get("score") ? Number(params.get("score")) : 0);
			sortOption.set(params.get("sort") || "none"); // ✅ keep as string
			sortDirection.set(params.get("direction") || "desc"); // ✅ default to "desc"
			
			mounted = true;
		});	
	});
}

// ✅ 🔄 Automatically update the URL when any filter changes
export function updateURL() {
	if (!mounted) return;

	const query = new URLSearchParams();

	if (get(selectedTags).length) query.set("tags", get(selectedTags).join(","));
	if (get(selectedCategories).length) query.set("categories", get(selectedCategories).join(","));
	if (get(selectedPrices).length) query.set("prices", get(selectedPrices).join(","));
	if (get(selectedSoftware).length) query.set("software", get(selectedSoftware).join(","));
	if (get(searchQuery)) query.set("search", get(searchQuery));
	if (get(scoreThreshold) > 0) query.set("score", get(scoreThreshold));
	if (get(sortOption)) query.set("sort", get(sortOption));
	if (get(sortDirection)) query.set("direction", get(sortDirection));

	const queryString = query.toString();
	if (queryString !== get(lastQuery)) {
		goto(`${get(page).url.pathname}?${queryString}`, { replaceState: true });
		lastQuery.set(queryString);
	}
}

// ✅ Add a selected filter to the specified store
export function addFilter(store, value) {
  store.update(items => (items.includes(value) ? items : [...items, value]));
  updateURL();
}

// ✅ Remove a selected filter from the specified store
export function removeFilter(store, value) {
  store.update(items => items.filter(item => item !== value));
  updateURL();
}


// ✅ Automatically trigger updateURL when filters change (but only after mounted)
function safeSubscribe(store) {
  store.subscribe(() => {
    if (mounted) updateURL();
  });
}

safeSubscribe(selectedTags);
safeSubscribe(selectedCategories);
safeSubscribe(selectedPrices);
safeSubscribe(selectedSoftware);
safeSubscribe(searchQuery);
safeSubscribe(scoreThreshold);
safeSubscribe(sortOption);
safeSubscribe(sortDirection);