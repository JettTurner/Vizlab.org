<script>
  import { links as sites } from "$lib/sites.js";
  import Header from "$lib/Header.svelte";
  import BoxHolder from "$lib/BoxHolder.svelte";
  
  import { writable, get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  // ✅ Track if the component is fully mounted
  let mounted = false;

  // ✅ Store the last query to prevent redundant updates
  let lastQuery = writable("");

  // ✅ Extract unique filters dynamically
  let allTags = [...new Set(sites.flatMap(site => site.tags || []))];
  let allCategories = [...new Set(sites.flatMap(site => site.category || []))];
  let allPrices = [...new Set(sites.map(site => site.price || ""))].filter(Boolean);
  let allSoftware = [...new Set(sites.flatMap(site => site.software || []))];

  // ✅ Ensure "Main" category always exists
  if (!allCategories.includes("Main")) {
    allCategories.unshift("Main");
  }

  // ✅ Writable stores for filters
  let selectedTags = writable([]);
  let selectedCategories = writable(["Main"]); // Default category
  let selectedPrices = writable([]);
  let selectedSoftware = writable([]);
  let searchQuery = writable("");
  let scoreThreshold = writable(0);

  // ✅ Controls filter visibility in the UI
  let showFilters = false;

  /**
   * ✅ Parses URL parameters into an array safely.
   * @param {string|null} params - The URL parameter string.
   * @returns {string[]} - An array of values, or an empty array if none exist.
   */
  function parseUrlParams(params) {
    return params ? decodeURIComponent(params).split(",") : [];
  }

  // 🏁 ✅ Load filters from the URL only once on page mount
  onMount(() => {
    const unsubscribe = page.subscribe(($page) => {
      const params = $page.url.searchParams;

      // ✅ Batch updates using setTimeout to prevent duplicate rendering
      setTimeout(() => {
        selectedTags.set(parseUrlParams(params.get("tags")));
        selectedCategories.set(parseUrlParams(params.get("categories")) || ["Main"]);
        selectedPrices.set(parseUrlParams(params.get("prices")));
        selectedSoftware.set(parseUrlParams(params.get("software")));
        searchQuery.set(params.get("search") || "");
        scoreThreshold.set(params.get("score") ? Number(params.get("score")) : 0);
      });

      // ✅ Mark component as mounted
      mounted = true;
    });
	
	// ✅ Cleanup subscription when the component is destroyed
    return () => unsubscribe();
  });

  // ✅ 🔄 Automatically update the URL when any filter changes
  $: if (mounted) {
    let query = new URLSearchParams();

    // ✅ Add selected filters to the URL query if they have values
    if (get(selectedTags).length) query.set("tags", get(selectedTags).join(","));
    if (get(selectedCategories).length) query.set("categories", get(selectedCategories).join(","));
    if (get(selectedPrices).length) query.set("prices", get(selectedPrices).join(","));
    if (get(selectedSoftware).length) query.set("software", get(selectedSoftware).join(","));
    if (get(searchQuery)) query.set("search", get(searchQuery));
    if (get(scoreThreshold) > 0) query.set("score", get(scoreThreshold));

    // ✅ Convert query object to string
    const queryString = query.toString();

    // ✅ Update the URL only if the query string has changed
    if (queryString !== get(lastQuery)) {
      goto(`${get(page).url.pathname}?${queryString}`, { replaceState: true });
      lastQuery.set(queryString); // ✅ Store the last query to prevent unnecessary updates
    }
  }

  /**
   * ✅ Removes a selected filter from the specified store.
   * @param {Writable<Array>} store - The store to update.
   * @param {string} value - The value to remove from the store.
   */
  function removeFilter(store, value) {
    store.update(items => items.filter(item => item !== value));
  }

  /**
   * ✅ Adds a selected filter to the specified store if it isn't already selected.
   * @param {Writable<Array>} store - The store to update.
   * @param {string} value - The value to add to the store.
   */
  function addFilter(store, value) {
    store.update(items => items.includes(value) ? items : [...items, value]);
  }
</script>





<svelte:head>
  <title>Vizlab.org</title>
</svelte:head>

<Header />

<!-- 🏆 Sticky Header Bar -->
<div class="w-full bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
  <!-- 🔼 Top Controls: Filters Toggle & Search -->
  <div class="flex items-center gap-4">
    <!-- 🎛️ Toggle Filters Button -->
    <button class="bg-gray-700 px-4 py-2 rounded" on:click={() => showFilters = !showFilters}>
      {showFilters ? "Hide Filters" : "Show Filters"}
    </button>

    <!-- 🔎 Search Bar - Right Aligned -->
    <input 
      type="text" 
      placeholder="Search..." 
      class="border p-2 rounded w-1/3 text-white ml-auto" 
      bind:value={$searchQuery} />
  </div>

  <!-- 🔽 Selected Filters (Tags) - New Line -->
  <div class="flex flex-wrap gap-2 mt-2">
    {#each $selectedCategories as category}
      <span class="bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
            on:click={() => removeFilter(selectedCategories, category)}>
        {category} ✖
      </span>
    {/each}

    {#each $selectedTags as tag}
      <span class="bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
            on:click={() => removeFilter(selectedTags, tag)}>
        {tag} ✖
      </span>
    {/each}

    {#each $selectedSoftware as software}
      <span class="bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
            on:click={() => removeFilter(selectedSoftware, software)}>
        {software} ✖
      </span>
    {/each}

    {#each $selectedPrices as price}
      <span class="bg-yellow-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
            on:click={() => removeFilter(selectedPrices, price)}>
        {price} ✖
      </span>
    {/each}
  </div>

  <!-- 🔽 Collapsible Filter Dropdown -->
  {#if showFilters}
    <div class="mt-2 p-2 bg-gray-800 rounded shadow text-white">
      <h4 class="font-bold">Category</h4>
      {#each allCategories as category}
        {#if !$selectedCategories.includes(category)}
          <button class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm"
            on:click={() => selectedCategories.update(s => [...s, category])}>
            {category} +
          </button>
        {/if}
      {/each}

      <h4 class="font-bold mt-2">Tags</h4>
      {#each allTags as tag}
        {#if !$selectedTags.includes(tag)}
          <button class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm"
            on:click={() => selectedTags.update(s => [...s, tag])}>
            {tag} +
          </button>
        {/if}
      {/each}

      <h4 class="font-bold mt-2">Software</h4>
      {#each allSoftware as software}
        {#if !$selectedSoftware.includes(software)}
          <button class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm"
            on:click={() => selectedSoftware.update(s => [...s, software])}>
            {software} +
          </button>
        {/if}
      {/each}

      <h4 class="font-bold mt-2">Price</h4>
      {#each allPrices as price}
        {#if !$selectedPrices.includes(price)}
          <button class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm"
            on:click={() => selectedPrices.update(s => [...s, price])}>
            {price} +
          </button>
        {/if}
      {/each}

      <!-- 📊 Score Slider -->
      <div class="mt-4">
        <h3 class="font-bold">Filter by Score</h3>
        <input type="range" min="0" max="100" step="1" bind:value={$scoreThreshold} />
        <span class="ml-2 text-sm">{$scoreThreshold}</span>
      </div>
    </div>
  {/if}
</div>

<!-- 🔽 Main Content (Independent Scroll) -->
<div class="p-4">
  <BoxHolder 
    sites={sites} 
    bind:filterTag={$selectedTags} 
    bind:filterCategory={$selectedCategories}
    bind:filterPrice={$selectedPrices}
    bind:filterSoftware={$selectedSoftware}
    bind:searchQuery={$searchQuery}
    bind:scoreThreshold={$scoreThreshold} />
</div>
