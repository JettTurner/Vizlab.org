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
export let scoreThreshold = writable(0);
export let lastQuery = writable("");

let mounted = false;


// Create a function to handle the filtering logic
export function applyFilters() {
  let filtered = [...allSites]; // Assuming allSites contains all available links

  // Apply category filter (AND logic, so we check if the site matches any selected categories)
  if ($selectedCategories.length > 0) {
    filtered = filtered.filter(site => $selectedCategories.includes(site.category));
  }

  // Apply tag filter (OR logic: site should match at least one selected tag)
  if ($selectedTags.length > 0) {
    filtered = filtered.filter(site => 
      $selectedTags.some(tag => site.tags.includes(tag))
    );
  }

  // Apply software filter (OR logic: site should match at least one selected software)
  if ($selectedSoftware.length > 0) {
    filtered = filtered.filter(site => 
      $selectedSoftware.some(software => site.software.includes(software))
    );
  }

  // Apply price filter (AND logic: site should match any selected price)
  if ($selectedPrices.length > 0) {
    filtered = filtered.filter(site => $selectedPrices.includes(site.price));
  }

  // Set filtered results
  return filteredSites = filtered;
}

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


/**
 * ✅ Parses URL parameters into an array safely.
 * @param {string|null} params - The URL parameter string.
 * @returns {string[]} - An array of values, or an empty array if none exist.
 */
export function parseUrlParams(params) {
  return params ? decodeURIComponent(params).split(",") : [];
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
    });

    mounted = true;
  });
}

// ✅ 🔄 Automatically update the URL when any filter changes
export function updateURL() {
  if (!mounted) return;

  let query = new URLSearchParams();

  if (get(selectedTags).length) query.set("tags", get(selectedTags).join(","));
  if (get(selectedCategories).length) query.set("categories", get(selectedCategories).join(","));
  if (get(selectedPrices).length) query.set("prices", get(selectedPrices).join(","));
  if (get(selectedSoftware).length) query.set("software", get(selectedSoftware).join(","));
  if (get(searchQuery)) query.set("search", get(searchQuery));
  if (get(scoreThreshold) > 0) query.set("score", get(scoreThreshold));

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
  ([$tags, $categories, $prices, $software, $search, $score]) =>
    $tags.length > 0 ||
    $categories.length > 0 ||
    $prices.length > 0 ||
    $software.length > 0 ||
    $search.length > 0 ||
    $score > 0
);


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