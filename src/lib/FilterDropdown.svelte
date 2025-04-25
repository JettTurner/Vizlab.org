<script>
  import {
    selectedTags, selectedCategories, selectedPrices, selectedSoftware,
    allTags, allCategories, allPrices, allSoftware,
    addFilter, removeFilter, clearAllFilters, hasActiveFilters,
    isCategoryDisabled, isTagDisabled, isSoftwareDisabled, isPriceDisabled,
    searchQuery, sortOptions, sortOption, sortDirection,
	showFilterDropdown,
  } from "$lib/urlFilters.js";

  export let filteredSites = [];  

  // Local text field for search input, linked to debounced reactive store update
  let searchText;
  let debounceTimeout;

  // Debounce search input
	$: if (searchText !== undefined) {
	  clearTimeout(debounceTimeout);
	  debounceTimeout = setTimeout(() => {
		searchQuery.set(searchText);
	  }, 900);
	}


  // Manual filters toggle
  let showFiltersUI = false;
  const toggleManualFilterUI = () => showFiltersUI = !showFiltersUI;

  // Filter dropdown controls
  const openFilterDropdown = () => showFilterDropdown.set(true);
  const closeFilterDropdown = () => showFilterDropdown.set(false);
  const toggleFilterDropdown = () => showFilterDropdown.update(v => !v);
</script>


<!--{#if $showFilterDropdown}--><!--Hidden so that the FilterDropdown is always visible-->
  <div
    class="w-full px-4 py-2 flex flex-col  bg-gray-900 text-white border-b border-gray-700 gap-2 shadow-sm z-20"
  >
	<!-- THE BASIC SEARCH BAR -->
	<div class="flex items-center justify-between gap-2 sm:flex-row flex-wrap sm:items-center sm:justify-between">
	  <!-- search box -->
	  <input
		type="text"
		placeholder="Search..."
		class="flex-grow w-full sm:w-auto border border-gray-700 px-2 rounded bg-gray-800 text-white text-default placeholder-gray-400"
		bind:value={searchText}
	  />
	  <!-- Sort By drop down and order flip -->
		<div class="flex items-center gap-2 text-sm text-white">
		  <label for="sort">Sort By:</label>
			<select
			  id="sort"
			  bind:value={$sortOption}
			  class="bg-gray-800 border border-red-600 rounded px-2 py-1 text-sm text-white"
			>
			  {#each sortOptions as option}
				<option value={option.value}>{option.label}</option>
			  {/each}
			</select>
		<!-- Sort By button Logic -->
		<button
		  class={`px-2 py-1 rounded text-white text-sm
			${$sortOption === 'none'
			  ? 'bg-gray-600 cursor-not-allowed opacity-50'
			  : 'bg-gray-700 hover:bg-gray-600'}`}
		  on:click={() => {
			if ($sortOption !== 'none') {
			  sortDirection.set($sortDirection === 'asc' ? 'desc' : 'asc');
			}
		  }}
		  title="Toggle ascending/descending"
		  disabled={$sortOption === 'none'}
		>
		  {$sortDirection === 'asc' ? '⬆ Ascending' : '⬇ Descending'}
		    <!-- {$sortDirection === 'asc' ? '⬆' : '⬇'} {$sortOption}-->
		</button>

		</div>
	  <!-- number of links meeting search and filters intentionally not the sorted list-->
	  <span class="text-sm text-gray-400 whitespace-nowrap">
		{filteredSites.length} links
	  </span>
	  <!-- Show filters toggle button -->
	  <button
		class="bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded text-sm"
		on:click={toggleManualFilterUI}
		title="Show/hide manual filters"
	  >
		{showFiltersUI ? 'Hide Filters' : 'Show Filters'}
	  </button>
	</div>

	<!-- Filters! -->
	{#if showFiltersUI}
	  <!-- Clear All filters button, triggers a warning pop up -->
	  <button
		class="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm w-full disabled:opacity-50"
		on:click={() => { if (confirm("Clear all filters?")) clearAllFilters(); }}
		disabled={!$hasActiveFilters}>
		✖ Clear All Filters
	  </button>
	  
	  <!-- flex space for selected tags, where the user can click to remove them individualy -->
	  <div class="flex flex-wrap gap-2">
			{#each [
			  { list: $selectedCategories, color: 'bg-red-600', store: selectedCategories },
			  { list: $selectedTags, color: 'bg-blue-600', store: selectedTags },
			  { list: $selectedSoftware, color: 'bg-green-600', store: selectedSoftware },
			  { list: $selectedPrices, color: 'bg-yellow-600', store: selectedPrices, transform: p => p === 'OneTimePurchase' ? 'One-Time' : p }
			] as group}
			  {#each group.list as item}
				<span
				  class={`${group.color} px-2 py-1 rounded text-sm cursor-pointer`}
				  on:click={() => removeFilter(group.store, item)}>
				  {group.transform ? group.transform(item) : item} ✖
				</span>
			  {/each}
			{/each}
	  </div>
		
		<!-- grid of all the filter options: Category, Software, Tags, Price -->
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
<!--{/if}-->
