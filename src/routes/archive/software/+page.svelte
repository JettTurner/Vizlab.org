<script>
  import Sidebar from "$lib/Sidebar.svelte";
  import BoxHolder from "$lib/BoxHolder.svelte";
  import { onMount } from "svelte";
  import { links as sites } from "$lib/software.js";
  import { selectedTags, selectedCategories, selectedPrices, selectedSoftware, searchQuery, loadFiltersFromURL } from "$lib/urlFilters.js";

  onMount(() => {
    loadFiltersFromURL();
  });
  
  let showSidebar = false; // State for controlling sidebar visibility

  // Function to update sidebar state
  function updateSidebarState(state) {
    showSidebar = state;
  }

  // Reactive filtered sites
  $: filteredSites = sites.filter(site => {
    const categories = $selectedCategories;
    const tags = $selectedTags;
    const software = $selectedSoftware;
    const prices = $selectedPrices;
    const query = $searchQuery;

    const categoryMatch = categories.length === 0 || (Array.isArray(site.category) ? site.category.some(cat => categories.includes(cat)) : categories.includes(site.category));
    const tagMatch = tags.length === 0 || (site.tags && site.tags.some(tag => tags.includes(tag)));
    const softwareMatch = software.length === 0 || (site.software && site.software.some(soft => software.includes(soft)));
    const priceMatch = prices.length === 0 || prices.includes(site.price);
    const searchMatch = !query || site.title.toLowerCase().includes(query.toLowerCase());

    return categoryMatch && tagMatch && softwareMatch && priceMatch && searchMatch;
  });
  
  // src/routes/your-page/+page.js
export async function load({ url }) {
  const searchParams = url.searchParams;

  const selectedCategories = searchParams.getAll('category') || [];
  const selectedTags = searchParams.getAll('tag') || [];
  const selectedPrices = searchParams.getAll('price') || [];
  const selectedSoftware = searchParams.getAll('software') || [];
  const searchQuery = searchParams.get('search') || '';

  return {
    props: {
      selectedCategories,
      selectedTags,
      selectedPrices,
      selectedSoftware,
      searchQuery,
    },
  };
}

</script>


<!-- Main Content Section -->
<div class="flex">
  <!-- Sidebar Component -->
  <Sidebar 
    {showSidebar} 
    {filteredSites} 
    updateSidebarState={updateSidebarState} 
  />

  <!-- Main Content Section -->
  <div class="flex-1">
    <BoxHolder 
      sites={sites} 
      bind:filterTag={$selectedTags} 
      bind:filterCategory={$selectedCategories}
      bind:filterPrice={$selectedPrices}
      bind:filterSoftware={$selectedSoftware}
      bind:searchQuery={$searchQuery}
    />
  </div>
</div>
