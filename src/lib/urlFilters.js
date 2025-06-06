import { writable, get } from "svelte/store";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { links as sites } from "$lib/sites.js";
import { derived } from "svelte/store";

// ✅ Extract unique filters dynamically
export let allTags = [...new Set(sites.flatMap(site => site.tag || []))];
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
  return selectedTags.length > 0 && filteredSites.every(site => !site.tag.includes(tag));
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

//======================== URL HANDLING ===========================================================================================================================

/**
 * ✅ Parses URL parameters into an array safely.
 * @param {string|null} params - The URL parameter string.
 * @returns {string[]} - An array of values, or an empty array if none exist.
 */
export function parseUrlParams(params) {
  return params ? decodeURIComponent(params).split(",").filter(Boolean) : [];
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