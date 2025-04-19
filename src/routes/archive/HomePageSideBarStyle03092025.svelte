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

  // Writable stores for filters (pre-check "Main" category)
  let selectedTags = writable([]);
  let selectedCategories = writable(["Main"]); // Default to "Main" checked
  let selectedPrices = writable([]);
  let selectedSoftware = writable([]);
  let searchQuery = writable("");
  let scoreThreshold = writable(0);

  // Dropdown states
  let showCategories = false;
  let showPrices = false;
  let showSoftware = false;
  let showTags = false;
</script>

<svelte:head>
  <title>3D Resources - Vizlab.org</title>
</svelte:head>

<Header />

<div class="flex h-screen overflow-hidden ">
  <!-- Sidebar (scrolls independently) -->
  <div class="w-1/4 p-4 border-r border-gray-300 space-y-4 overflow-y-auto h-screen overflow-x-hidden">
    <!-- Search -->
    <div>
      <h3 class="font-bold">Search</h3>
      <input type="text" placeholder="Search..." class="border p-2 w-full" bind:value={$searchQuery} />
    </div>

    <!-- Filter Buttons with Dropdowns -->
    <div>
      <button 
        class="w-full text-left bg-stone-900 p-2 rounded transition-all duration-200 ease-in-out hover:text-red-600"
        on:click={() => showCategories = !showCategories}
      >
        Filter by Category
      </button>
      {#if showCategories}
        <div class="mt-2 p-2 border rounded bg-stone-900 shadow">
          {#each allCategories as category}
            <label class="block">
              <input type="checkbox" bind:group={$selectedCategories} value={category} />
              {category}
            </label>
          {/each}
        </div>
      {/if}
    </div>

    <div>
      <button 
        class="w-full text-left bg-stone-900 p-2 rounded transition-all duration-200 ease-in-out hover:text-red-600"
        on:click={() => showPrices = !showPrices}
      >
        Filter by Price
      </button>
      {#if showPrices}
        <div class="mt-2 p-2 border rounded bg-stone-900 shadow">
          {#each allPrices as price}
            <label class="block">
              <input type="checkbox" bind:group={$selectedPrices} value={price} />
              {price}
            </label>
          {/each}
        </div>
      {/if}
    </div>

    <div>
      <button 
        class="w-full text-left bg-stone-900 p-2 rounded transition-all duration-200 ease-in-out hover:text-red-600"
        on:click={() => showSoftware = !showSoftware}
      >
        Filter by Software
      </button>
      {#if showSoftware}
        <div class="mt-2 p-2 border rounded bg-stone-900 shadow">
          {#each allSoftware as software}
            <label class="block">
              <input type="checkbox" bind:group={$selectedSoftware} value={software} />
              {software}
            </label>
          {/each}
        </div>
      {/if}
    </div>

    <div>
      <button 
        class="w-full text-left bg-stone-900 p-2 rounded transition-all duration-200 ease-in-out hover:text-red-600"
        on:click={() => showTags = !showTags}
      >
        Filter by Tags
      </button>
      {#if showTags}
        <div class="mt-2 p-2 border rounded bg-stone-900 shadow">
          {#each allTags as tag}
            <label class="block">
              <input type="checkbox" bind:group={$selectedTags} value={tag} />
              {tag}
            </label>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Score Slider -->
    <div>
      <h3 class="font-bold">Filter by Score</h3>
      <input type="range" min="0" max="100" step="1" bind:value={$scoreThreshold} />
      <span>{$scoreThreshold}</span>
    </div>
  </div>

  <!-- Main content (scrolls independently) -->
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

