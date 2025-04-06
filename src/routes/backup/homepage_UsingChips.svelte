<script>
  import Header from "$lib/Header.svelte";
  import { links as sites } from "$lib/sites.js";
  import BoxHolder from "$lib/BoxHolder.svelte";
  import { writable } from "svelte/store";

  // Extract unique tags and categories dynamically
  let allTags = [...new Set(sites.flatMap(site => site.tags || []))];
  let allCategories = [...new Set(sites.flatMap(site => site.category || []))];
  let allPrices = [...new Set(sites.map(site => site.price || ""))].filter(Boolean);
  let allSoftware = [...new Set(sites.flatMap(site => site.software || []))];

  // Ensure "Main" category exists
  if (!allCategories.includes("Main")) {
    allCategories.unshift("Main");
  }

  // Writable stores for filters
  let selectedTags = writable([]);
  let selectedCategories = writable(["Main"]);
  let selectedPrices = writable([]);
  let selectedSoftware = writable([]);
  let searchQuery = writable("");
  let scoreThreshold = writable(0);

  // Dropdown state
  let showFilters = false;

  // Remove a selected filter
  function removeFilter(store, value) {
    store.update(items => items.filter(item => item !== value));
  }
</script>

<svelte:head>
  <title>3D Resources - Vizlab.org</title>
</svelte:head>

<Header />

<div class="flex h-screen overflow-hidden">
  <!-- Search & Filter Bar (Fixed Height) -->
  <div class="w-1/4 p-4 border-r border-gray-300 space-y-4 h-screen overflow-y-auto overflow-x-hidden"
    
    <!-- Search Bar -->
    <div>
      <input 
        type="text" 
        placeholder="Search..." 
        class="border p-2 w-full rounded" 
        bind:value={$searchQuery} />
    </div>

    <!-- Selected Filters as Tags -->
    <div class="flex flex-wrap gap-2">
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

    <!-- Filter Dropdown -->
    <div>
      <button class="w-full bg-gray-800 text-white p-2 rounded mt-2"
        on:click={() => showFilters = !showFilters}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {#if showFilters}
        <div class="mt-2 p-2 border rounded bg-gray-900 shadow text-white">
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
        </div>
      {/if}
    </div>

    <!-- Score Slider 
    <div>
      <h3 class="font-bold">Filter by Score</h3>
      <input type="range" min="0" max="100" step="1" bind:value={$scoreThreshold} />
      <span>{$scoreThreshold}</span>
    </div>
	-->
	
  </div>
	
  <!-- Main Content (Independent Scroll) -->
  <div class="w-3/4 p-4 overflow-y-auto h-screen">
    <BoxHolder 
      sites={sites} 
      bind:filterTag={$selectedTags} 
      bind:filterCategory={$selectedCategories}
      bind:filterPrice={$selectedPrices}
      bind:filterSoftware={$selectedSoftware}
      bind:searchQuery={$searchQuery}
      bind:scoreThreshold={$scoreThreshold} />
  </div>
</div>
