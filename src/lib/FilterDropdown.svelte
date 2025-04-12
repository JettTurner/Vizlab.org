<script>
  import {
    selectedTags, selectedCategories, selectedPrices, selectedSoftware,
    allTags, allCategories, allPrices, allSoftware,
    searchQuery, addFilter, removeFilter, clearAllFilters, hasActiveFilters,
    isCategoryDisabled, isTagDisabled, isSoftwareDisabled, isPriceDisabled,
	showFilterDropdown,
  } from "$lib/urlFilters.js";

  //export let showFilterDropdown = false;
  export let filteredSites = [];
  //export let updateFilterDropdownState;

  let searchText;
  let debounceTimeout;

  $: searchText = $searchQuery;

  $: if (searchText !== undefined) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchQuery.set(searchText);
    }, 900);
  }
  
  let showFiltersUI = false;

  function toggleManualFilterUI() {
    showFiltersUI = !showFiltersUI;
  }

  // Function to open the FilterDropdown
  function openFilterDropdown() {
    showFilterDropdown.set(true);
  }

  // Function to close the FilterDropdown
  function closeFilterDropdown() {
    showFilterDropdown.set(false);
  }

  // Toggle FilterDropdown on button click
  function toggleFilterDropdown() {
    showFilterDropdown.update(value => !value); // Toggle FilterDropdown visibility
  }
  
  
</script>

{#if $showFilterDropdown}
  <div
    class="w-full px-4 py-2 flex flex-col  bg-gray-900 text-white border-b border-gray-700 gap-2 shadow-sm z-20"
  >

	<div class="flex items-center justify-between gap-2">
	  <input
		type="text"
		placeholder="Search..."
		class="flex-grow border border-gray-700 px-2 rounded bg-gray-800 text-white text-default placeholder-gray-400"
		bind:value={searchText}
	  />
	  <span class="text-sm text-gray-400 whitespace-nowrap">
		{filteredSites.length} links
	  </span>
	  <button
		class="bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded text-sm"
		on:click={toggleManualFilterUI}
		title="Show/hide manual filters"
	  >
		{showFiltersUI ? 'Hide Filters' : 'Show Filters'}
	  </button>
	</div>


	{#if showFiltersUI}
	  <button
		class="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm w-full disabled:opacity-50"
		on:click={() => { if (confirm("Clear all filters?")) clearAllFilters(); }}
		disabled={!$hasActiveFilters}>
		✖ Clear All Filters
	  </button>

	  <div class="flex flex-wrap gap-2">
		{#each $selectedCategories as category}
		  <span class="bg-red-600 px-2 py-1 rounded text-sm cursor-pointer" on:click={() => removeFilter(selectedCategories, category)}>
			{category} ✖
		  </span>
		{/each}
		{#each $selectedTags as tag}
		  <span class="bg-blue-600 px-2 py-1 rounded text-sm cursor-pointer" on:click={() => removeFilter(selectedTags, tag)}>
			{tag} ✖
		  </span>
		{/each}
		{#each $selectedSoftware as software}
		  <span class="bg-green-600 px-2 py-1 rounded text-sm cursor-pointer" on:click={() => removeFilter(selectedSoftware, software)}>
			{software} ✖
		  </span>
		{/each}
		{#each $selectedPrices as price}
		  <span class="bg-yellow-600 px-2 py-1 rounded text-sm cursor-pointer" on:click={() => removeFilter(selectedPrices, price)}>
			{price === 'OneTimePurchase' ? 'One-Time' : price} ✖
		  </span>
		{/each}
	  </div>

	  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
		<!-- Categories -->
		<div>
		  <h4 class="font-bold mb-1">Category</h4>
		  <div class="flex flex-wrap gap-2">
			{#each allCategories as category}
			  {#if !$selectedCategories.includes(category)}
				<button
				  class="bg-gray-700 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
				  on:click={() => addFilter(selectedCategories, category)}
				  disabled={isCategoryDisabled(category, $selectedCategories, filteredSites)}>
				  {category} +
				</button>
			  {/if}
			{/each}
		  </div>
		</div>

		<!-- Tags -->
		<div>
		  <h4 class="font-bold mb-1">Tags</h4>
		  <div class="flex flex-wrap gap-2">
			{#each allTags as tag}
			  {#if !$selectedTags.includes(tag)}
				<button
				  class="bg-gray-700 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
				  on:click={() => addFilter(selectedTags, tag)}
				  disabled={isTagDisabled(tag, $selectedTags, filteredSites)}>
				  {tag} +
				</button>
			  {/if}
			{/each}
		  </div>
		</div>

		<!-- Software -->
		<div>
		  <h4 class="font-bold mb-1">Software</h4>
		  <div class="flex flex-wrap gap-2">
			{#each allSoftware as software}
			  {#if !$selectedSoftware.includes(software)}
				<button
				  class="bg-gray-700 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
				  on:click={() => addFilter(selectedSoftware, software)}
				  disabled={isSoftwareDisabled(software, $selectedSoftware, filteredSites)}>
				  {software} +
				</button>
			  {/if}
			{/each}
		  </div>
		</div>

		<!-- Price -->
		<div>
		  <h4 class="font-bold mb-1">Price</h4>
		  <div class="flex flex-wrap gap-2">
			{#each allPrices.filter(price => ['Free', 'Subscription', 'OneTimePurchase'].includes(price)) as price}
			  {#if !$selectedPrices.includes(price)}
				<button
				  class="bg-gray-700 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
				  on:click={() => addFilter(selectedPrices, price)}
				  disabled={isPriceDisabled(price, $selectedPrices, filteredSites)}>
				  {price === 'OneTimePurchase' ? 'One-Time' : price} +
				</button>
			  {/if}
			{/each}
		  </div>
		</div>
	  </div>
	{/if}
</div>
{/if}
