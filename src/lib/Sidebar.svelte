<script>
  import { 
    selectedTags, selectedCategories, selectedPrices, selectedSoftware,
    allTags, allCategories, allPrices, allSoftware,   
    searchQuery, addFilter, removeFilter, clearAllFilters, hasActiveFilters, applyFilters,
    isCategoryDisabled, isTagDisabled, isSoftwareDisabled, isPriceDisabled 
  } from "$lib/urlFilters.js";

  export let showSidebar = false;
  export let filteredSites = [];
  export let updateSidebarState;
  export let headerHeight = '3.3rem'; // Pass the header height to adjust the sidebar
  export let footerHeight = '3.2rem'; // Pass the header height to adjust the sidebar

  // Update the sidebar state
  //function toggleSidebar() {
  //  updateSidebarState(!showSidebar);
  //}
 
  let searchText = $searchQuery; // Local text input value
  let debounceTimeout;
  $: if (searchText !== undefined) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchQuery.set(searchText);
    }, 900); // 900ms delay after user stops typing
  }



//-------------------------code for sidebar timeout:-------------------------
import { onMount, onDestroy } from 'svelte';
  
  let timeoutId;
  const INACTIVITY_TIME = 3000; // 3 seconds of inactivity before closing the sidebar
  const SCROLL_DELAY = 100; // Delay (in milliseconds) before closing the sidebar after scroll
  
  let scrollTimeoutId;

  // Function to open the sidebar
  function openSidebar() {
    showSidebar = true;
  }

  // Function to close the sidebar
  function closeSidebar() {
    showSidebar = false;
  }

  // Toggle sidebar on button click
  function toggleSidebar() {
    showSidebar = !showSidebar; // Toggle sidebar visibility
    if (showSidebar) {
      // Reset the inactivity timeout if the sidebar is opened
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  // Reset the timeout when hovering over the sidebar
  function resetTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear any previous timeouts
    }
    timeoutId = setTimeout(closeSidebar, INACTIVITY_TIME); // Set a new timeout to close after 3 seconds
  }

  // Close sidebar when mouse leaves
  let sidebarHovered = false;
  function onMouseLeave() {
    sidebarHovered = false;
    resetTimeout();
  }

  // Open sidebar on mouse enter
  let sidebarEntered = false;
  function onMouseEnter() {
    sidebarHovered = true;
    openSidebar();
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear timeout when the user interacts with the sidebar
    }
  }

  // Close sidebar on scroll event (with delay)
  function onScroll() {
    // Clear previous timeout to reset delay if the user scrolls again quickly
    if (scrollTimeoutId) {
      clearTimeout(scrollTimeoutId);
    }

    // Set a delayed timeout to close the sidebar after the user stops scrolling
    scrollTimeoutId = setTimeout(() => {
      closeSidebar();
    }, SCROLL_DELAY); // Set a delay before closing the sidebar (e.g., 500ms)
  }

  onMount(() => {
    // Attach scroll event listener
    window.addEventListener('scroll', onScroll);

    // Reset timeout to close sidebar after inactivity
    resetTimeout(); 
    
    // Cleanup event listener when the component is destroyed
    onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
    });
  });
</script>

<!-- Sidebar Toggle Button -->
<button 
  class="bg-gray-900 px-4 py-2 rounded text-white fixed transition-all duration-300 z-50 opacity-80 hover:bg-blue-600"
  style="left: {showSidebar ? 'calc(16rem)' : '0'}; top: calc(4rem + 1rem);"
  on:click={toggleSidebar}>
  <span class="transform transition-transform duration-300 inline-block" class:rotate-180={showSidebar}>
    ➤
  </span>
</button>

<!-- Sidebar Content (filters) -->
<div
  class={`sidebar p-4 bg-gray-900 text-white w-64 fixed left-0 overflow-y-auto duration-300 
    ${showSidebar ? 'transform-none' : '-translate-x-full'} opacity-95 hover:opacity-100 transition-all`}
  style="top: {headerHeight}; height: calc(100vh - {headerHeight} - {footerHeight});"
  on:mouseenter={onMouseEnter} 
  on:mouseleave={onMouseLeave}>
  <!-- Sidebar content here -->
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
      on:click={() => { if (confirm("Clear all filters?")) clearAllFilters(); }} 
      disabled={!$hasActiveFilters}>
      ✖ Clear All Filters
    </button>

    <!-- Selected Filters (display selected tags for removal) -->
    <div class="mt-0">
      {#each $selectedCategories as category}
        <span 
          class="bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
          on:click={() => removeFilter(selectedCategories, category)}>
          {category} ✖
        </span>
      {/each}

      {#each $selectedTags as tag}
        <span 
          class="bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
          on:click={() => removeFilter(selectedTags, tag)}>
          {tag} ✖
        </span>
      {/each}

      {#each $selectedSoftware as software}
        <span 
          class="bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
          on:click={() => removeFilter(selectedSoftware, software)}>
          {software} ✖
        </span>
      {/each}

      {#each $selectedPrices as price}
        <span 
          class="bg-yellow-600 text-white px-3 py-1 rounded text-sm cursor-pointer" 
          on:click={() => removeFilter(selectedPrices, price)}>
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
          <button 
            class="bg-gray-700 text-white px-2 py-1 m-1 rounded text-sm 
              {isCategoryDisabled(category, $selectedCategories, filteredSites) ? 'opacity-50 cursor-not-allowed' : ''}" 
            on:click={() => addFilter(selectedCategories, category)} 
            disabled={isCategoryDisabled(category, $selectedCategories, filteredSites)}>
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
              {isTagDisabled(tag, $selectedTags, filteredSites) ? 'opacity-50 cursor-not-allowed' : ''}" 
            on:click={() => addFilter(selectedTags, tag)} 
            disabled={isTagDisabled(tag, $selectedTags, filteredSites)}>
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
              {isSoftwareDisabled(software, $selectedSoftware, filteredSites) ? 'opacity-50 cursor-not-allowed' : ''}" 
            on:click={() => addFilter(selectedSoftware, software)} 
            disabled={isSoftwareDisabled(software, $selectedSoftware, filteredSites)}>
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
              {isPriceDisabled(price, $selectedPrices, filteredSites) ? 'opacity-50 cursor-not-allowed' : ''}" 
            on:click={() => addFilter(selectedPrices, price)} 
            disabled={isPriceDisabled(price, $selectedPrices, filteredSites)}>
            {price === 'OneTimePurchase' ? 'One-Time' : price} +
          </button>
        {/if}
      {/each}

    </div>
  </div>
</div>

