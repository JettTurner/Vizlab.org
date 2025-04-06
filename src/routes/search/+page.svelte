<script>
  import { links as sites } from "$lib/sites.js";
  import Header from "$lib/Header.svelte";
  import BoxHolder from "$lib/BoxHolder.svelte";
  import { onMount } from "svelte";
  
	import { 
	  selectedTags, selectedCategories, selectedPrices, selectedSoftware, 
	  searchQuery, scoreThreshold, loadFiltersFromURL, addFilter, removeFilter,
	  updateURL, // ✅ FIX: Import updateURL
	  allTags, allCategories, allPrices, allSoftware
	} from "$lib/urlFilters.js";

  let showFilters = false;
  let isScrolling = false;

  function handleScroll() {
    isScrolling = window.scrollY > 0;
  }

  onMount(() => {
    const unsubscribe = loadFiltersFromURL();
    window.addEventListener("scroll", handleScroll);

    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  });
  
  // Ensure filtering logic is reactive
  $: filteredSites = sites.filter(site => {
    // Category filter
    const categoryMatch = $selectedCategories.length === 0 || $selectedCategories.includes(site.category);
    // Tags filter
    const tagMatch = $selectedTags.length === 0 || (site.tags && site.tags.some(tag => $selectedTags.includes(tag)));
    // Software filter
    const softwareMatch = $selectedSoftware.length === 0 || (site.software && site.software.some(soft => $selectedSoftware.includes(soft)));
    // Price filter
    const priceMatch = $selectedPrices.length === 0 || $selectedPrices.includes(site.price);
    // Search query filter (ensure case-insensitivity)
    const searchMatch = !$searchQuery || site.title.toLowerCase().includes($searchQuery.toLowerCase());

    return categoryMatch && tagMatch && softwareMatch && priceMatch && searchMatch;
  });
  
  
  //console.log("Sites Data:", sites);
</script>


<svelte:head>
  <title>Vizlab.org</title>
</svelte:head>

<Header />

<!-- 🏆 Sticky Header Bar now no longer sticky. simply add the word sticky to stick-->
<div class="w-full bg-gray-900 text-white p-1 shadow-md  top-0 z-50">
  <!-- 🔼 Top Controls: Filters Toggle & Search -->
  <div class="flex items-center gap-4">	
    <!-- 🎛️ Toggle Filters Button -->
    <button class="bg-gray-700 md:px-4 md:py-1 rounded " on:click={() => showFilters = !showFilters}>
      {showFilters ? "Hide Filters" : "Show Filters"}
    </button>
	<!-- Total Site Count -->
    <a class="text-gray-500"> Showing {filteredSites.length} results</a>

    <!-- 🔎 Search Bar - Right Aligned --> 
    <input 
      type="text" 
      placeholder="Search..." 
      class="border p-1 md:p-1 rounded md:w-1/4 bg-gray-950 text-white ml-auto" 
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
          on:click={() => addFilter(selectedCategories, category)}>
          {category} +
        </button>
      {/if}
    {/each}

    <h4 class="font-bold mt-2">Tags</h4>
    {#each allTags as tag}
      {#if !$selectedTags.includes(tag)}
        <button class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm"
          on:click={() => addFilter(selectedTags, tag)}>
          {tag} +
        </button>
      {/if}
    {/each}

    <h4 class="font-bold mt-2">Software</h4>
    {#each allSoftware as software}
      {#if !$selectedSoftware.includes(software)}
        <button class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm"
          on:click={() => addFilter(selectedSoftware, software)}>
          {software} +
        </button>
      {/if}
    {/each}

    <h4 class="font-bold mt-2">Price</h4>
    {#each allPrices as price}
      {#if !$selectedPrices.includes(price)}
        <button class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm"
          on:click={() => addFilter(selectedPrices, price)}>
          {price} +
        </button>
      {/if}
    {/each}

    <!-- 📊 Score Slider 
    <div class="mt-4">
      <h3 class="font-bold">Filter by Score</h3>
      <input type="range" min="0" max="100" step="1" bind:value={$scoreThreshold} on:change={updateURL} />
      <span class="ml-2 text-sm">{$scoreThreshold}</span>
    </div> -->
  </div>
{/if}

</div>

<!-- 🔽 Main Content (Independent Scroll) -->
<BoxHolder 
    sites={sites} 
    bind:filterTag={$selectedTags} 
    bind:filterCategory={$selectedCategories}
    bind:filterPrice={$selectedPrices}
    bind:filterSoftware={$selectedSoftware}
    bind:searchQuery={$searchQuery}
    bind:scoreThreshold={$scoreThreshold} />

<!-- <div class="p-4">
  <BoxHolder 
    sites={sites} 
    bind:filterTag={$selectedTags} 
    bind:filterCategory={$selectedCategories}
    bind:filterPrice={$selectedPrices}
    bind:filterSoftware={$selectedSoftware}
    bind:searchQuery={$searchQuery}
    bind:scoreThreshold={$scoreThreshold} />
</div> -->
