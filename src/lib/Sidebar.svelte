<script>
  import { selectedTags, selectedCategories, selectedPrices, selectedSoftware,
	allTags, allCategories, allPrices, allSoftware,   
    searchQuery, addFilter, removeFilter, clearAllFilters, hasActiveFilters, applyFilters } from "$lib/urlFilters.js";

  export let showSidebar = false;
  export let filteredSites = [];
  export let updateSidebarState;
  export let headerHeight = '3.3rem'; // Pass the header height to adjust the sidebar
  export let footerHeight = '3.2rem'; // Pass the header height to adjust the sidebar

  // Update the sidebar state
  function toggleSidebar() {
    updateSidebarState(!showSidebar);
  }
 
  let searchText = $searchQuery; // Local text input value
  // Debounce searching so that as the user types we dont interupt with a urlupdating page refresh
  let debounceTimeout;
	$: if (searchText !== undefined) {
	  clearTimeout(debounceTimeout);
	  debounceTimeout = setTimeout(() => {
		searchQuery.set(searchText);
	  }, 900); // 300ms delay after user stops typing
	}

</script>


<div 
  class={`sidebar p-4 bg-gray-900 text-white w-64 fixed left-0 overflow-y-auto transition-transform duration-300 ${showSidebar ? 'transform-none' : '-translate-x-full'}`}
  style="top: {headerHeight}; height: calc(100vh - {headerHeight} - {footerHeight});" 
><!-- Adjust this to the remaining height of the viewport -->
  <div class="flex flex-col items-start h-full">
    <a class="text-gray-500"> Showing {filteredSites.length} results</a>
    <!-- Search Bar in Sidebar -->
    <div class="mb-2">
      <input 
        type="text" 
        placeholder="Search..." 
        class="border p-1 rounded w-full bg-gray-950 text-white" 
        bind:value={searchText} />
    </div>
	
	<!-- Clear All Button -->
	<button
	  class="mb-0 bg-stone-700 hover:bg-red-800 text-white px-3 py-2 rounded text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
	  on:click={() => {if (confirm("Clear all filters?")) clearAllFilters();}} disabled={!$hasActiveFilters}>
	  ✖ Clear All Filters
	</button>
   
    <!-- Selected Filters (display selected tags for removal) -->
    <div class="mt-0">
      {#each $selectedCategories as category}
        <span 
          class="bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
          on:click={() => removeFilter(selectedCategories, category)} >
          {category} ✖
        </span>
      {/each}

      {#each $selectedTags as tag}
        <span 
          class="bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
          on:click={() => removeFilter(selectedTags, tag)} >
          {tag} ✖
        </span>
      {/each}

      {#each $selectedSoftware as software}
        <span 
          class="bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
          on:click={() => removeFilter(selectedSoftware, software)} >
          {software} ✖
        </span>
      {/each}

      {#each $selectedPrices as price}
        <span 
          class="bg-yellow-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
          on:click={() => removeFilter(selectedPrices, price)} >
          {price} ✖
        </span>
      {/each}
    </div>

    <!-- Filter Content Section -->
    <div class="mt-2 p-2 bg-gray-800 rounded shadow text-white">
	
<!-- Category Filters -->
<h4 class="font-bold">Category</h4>
{#each allCategories as category}
  {#if !$selectedCategories.includes(category)}
    <!-- Button should only be greyed out when filter is applied and no matching sites are found -->
    <button 
      class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm 
        {($selectedCategories.length > 0 && filteredSites.every(site => site.category !== category)) ? 'opacity-50 cursor-not-allowed' : ''}" 
      on:click={() => addFilter(selectedCategories, category)}
      disabled={($selectedCategories.length > 0 && filteredSites.every(site => site.category !== category))} >
      {category} +
    </button>
  {/if}
{/each}



<!-- Tag Filters -->
<h4 class="font-bold mt-2">Tags</h4>
{#each allTags as tag}
  {#if !$selectedTags.includes(tag)}
    <button 
      class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm 
        {($selectedTags.length > 0 && filteredSites.every(site => !site.tags.includes(tag))) ? 'opacity-50 cursor-not-allowed' : ''}" 
      on:click={() => addFilter(selectedTags, tag)}
      disabled={($selectedTags.length > 0 && filteredSites.every(site => !site.tags.includes(tag)))} >
      {tag} +
    </button>
  {/if}
{/each}


<!-- Software Filters -->
<h4 class="font-bold mt-2">Software</h4>
{#each allSoftware as software}
  {#if !$selectedSoftware.includes(software)}
    <button 
      class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm 
        {($selectedSoftware.length > 0 && filteredSites.every(site => !site.software.includes(software))) ? 'opacity-50 cursor-not-allowed' : ''}" 
      on:click={() => addFilter(selectedSoftware, software)}
      disabled={($selectedSoftware.length > 0 && filteredSites.every(site => !site.software.includes(software)))} >
      {software} +
    </button>
  {/if}
{/each}


<!-- Price Filters -->
<h4 class="font-bold mt-2">Price</h4>
{#each allPrices.filter(price => ['Free', 'Subscription', 'OneTimePurchase'].includes(price)) as price}
  {#if !$selectedPrices.includes(price)}
    <button 
      class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm 
        {($selectedPrices.length > 0 && filteredSites.every(site => site.price !== price)) ? 'opacity-50 cursor-not-allowed' : ''}" 
      on:click={() => addFilter(selectedPrices, price)}
      disabled={($selectedPrices.length > 0 && filteredSites.every(site => site.price !== price))} >
      {price === 'OneTimePurchase' ? 'One-Time' : price} +
    </button>
  {/if}
{/each}


	  
    </div>
  </div>
</div>

<!-- Sidebar Toggle Button -->
<button 
  class="bg-gray-900 px-4 py-2 rounded text-white fixed transition-all duration-300 z-50 opacity-80 hover:bg-blue-600"
  style="left: {showSidebar ? 'calc(16rem)' : '0'}; top: calc(4rem + 1rem);"  
  on:click={toggleSidebar}
>
<!-- Icon for Sidebar Toggle -->
<span class="transform transition-transform duration-300 inline-block"
      class:rotate-180={showSidebar}>
  ➤
</span>

</button>

