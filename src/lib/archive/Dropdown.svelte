<script>
  import {
    selectedTags, selectedCategories, selectedPrices, selectedSoftware,
    allTags, allCategories, allPrices, allSoftware,
    searchQuery, addFilter, removeFilter, clearAllFilters, hasActiveFilters,
    isCategoryDisabled, isTagDisabled, isSoftwareDisabled, isPriceDisabled
  } from "$lib/urlFilters.js";
  import { onMount } from "svelte";

  export let filteredSites = [];

  let searchText = $searchQuery;
  let debounceTimeout;
  let showDropdown = false;
  let dropdownRef;

  $: if (searchText !== undefined) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchQuery.set(searchText);
    }, 900);
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function handleClickOutside(event) {
    if (showDropdown && dropdownRef && !dropdownRef.contains(event.target)) {
      showDropdown = false;
    }
  }

  onMount(() => {
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  });
</script>

<style>
  .dropdown-enter {
    opacity: 0;
    transform: scale(0.98);
  }
  .dropdown-enter-active {
    transition: all 200ms ease;
    opacity: 1;
    transform: scale(1);
  }
  .dropdown-leave {
    opacity: 1;
    transform: scale(1);
  }
  .dropdown-leave-active {
    transition: all 150ms ease;
    opacity: 0;
    transform: scale(0.97);
  }
</style>

<div class="relative z-50">
  <!-- Toggle Button -->
  <button 
    class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
    on:click|stopPropagation={toggleDropdown}>
    Filters <span class="ml-2">{showDropdown ? '▲' : '▼'}</span>
  </button>

  {#if showDropdown}
    <div
      bind:this={dropdownRef}
      class="absolute mt-2 w-[95vw] sm:w-[26rem] right-0 sm:right-auto bg-gray-900 text-white rounded shadow-xl p-4 max-h-[75vh] overflow-y-auto transition-all duration-200 animate-fadeIn"
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 100 }}>

      <!-- Search Bar -->
      <input 
        type="text" 
        placeholder="Search..." 
        class="border p-2 rounded w-full mb-3 bg-gray-950 text-white"
        bind:value={searchText} />

      <!-- Clear Filters Button -->
      <button
        class="mb-2 bg-stone-700 hover:bg-red-800 text-white px-3 py-2 rounded text-sm w-full disabled:opacity-50"
        on:click={() => { if (confirm("Clear all filters?")) clearAllFilters(); }}
        disabled={!$hasActiveFilters}>
        ✖ Clear All Filters
      </button>

      <!-- Active Filter Chips -->
      <div class="flex flex-wrap gap-1 mb-3">
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

      <!-- FILTER SECTIONS -->
      <div class="space-y-4">

        <div>
          <h4 class="font-bold mb-1">Category</h4>
          <div class="flex flex-wrap gap-1">
            {#each allCategories as category}
              {#if !$selectedCategories.includes(category)}
                <button 
                  class="bg-gray-700 px-2 py-1 rounded text-sm disabled:opacity-50"
                  on:click={() => addFilter(selectedCategories, category)}
                  disabled={isCategoryDisabled(category, $selectedCategories, filteredSites)}>
                  {category} +
                </button>
              {/if}
            {/each}
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-1">Tags</h4>
          <div class="flex flex-wrap gap-1">
            {#each allTags as tag}
              {#if !$selectedTags.includes(tag)}
                <button 
                  class="bg-gray-700 px-2 py-1 rounded text-sm disabled:opacity-50"
                  on:click={() => addFilter(selectedTags, tag)}
                  disabled={isTagDisabled(tag, $selectedTags, filteredSites)}>
                  {tag} +
                </button>
              {/if}
            {/each}
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-1">Software</h4>
          <div class="flex flex-wrap gap-1">
            {#each allSoftware as software}
              {#if !$selectedSoftware.includes(software)}
                <button 
                  class="bg-gray-700 px-2 py-1 rounded text-sm disabled:opacity-50"
                  on:click={() => addFilter(selectedSoftware, software)}
                  disabled={isSoftwareDisabled(software, $selectedSoftware, filteredSites)}>
                  {software} +
                </button>
              {/if}
            {/each}
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-1">Price</h4>
          <div class="flex flex-wrap gap-1">
            {#each allPrices.filter(price => ['Free', 'Subscription', 'OneTimePurchase'].includes(price)) as price}
              {#if !$selectedPrices.includes(price)}
                <button 
                  class="bg-gray-700 px-2 py-1 rounded text-sm disabled:opacity-50"
                  on:click={() => addFilter(selectedPrices, price)}
                  disabled={isPriceDisabled(price, $selectedPrices, filteredSites)}>
                  {price === 'OneTimePurchase' ? 'One-Time' : price} +
                </button>
              {/if}
            {/each}
          </div>
        </div>

      </div>
    </div>
  {/if}
</div>
