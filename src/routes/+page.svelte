<script>
  import Sidebar from "$lib/Sidebar.svelte";
  import FilterDropdown from "$lib/FilterDropdown.svelte";
  import BoxHolder from "$lib/BoxHolder.svelte";
  import { onMount } from "svelte";
  import { links as sites } from "$lib/sites.js";
  import { selectedTags, selectedCategories, selectedPrices, selectedSoftware, searchQuery, sortOption, sortDirection, loadFiltersFromURL } from "$lib/urlFilters.js";
  import { getVoteData } from "$lib/clickTracker.js";
  import { getClickCounts } from "$lib/clickTracker.js";
  import { browser } from '$app/environment'; // Add this import
  
  
  let clickCounts = {}; // { [linkHref]: number }
  let voteData = {};
  
	onMount(async () => {
	  loadFiltersFromURL();

	  if (browser) {
		voteData = getVoteData();
	  }

	  clickCounts = await getClickCounts();
	});

  
  let showSidebar = false; // State for controlling sidebar visibility
  let showFilterDropdown = false; // State for controlling sidebar visibility

  // Function to update sidebar state
  function updateSidebarState(state) {
    showSidebar = state;
  }
  // Function to update sidebar state
  function updateFilterDropdownState(state) {
    showFilterDropdown = state;
  }

  // Reactive filtered sites
  $: filteredSites = sites
  .filter(site => {
    const categories = $selectedCategories;
    const tags = $selectedTags;
    const software = $selectedSoftware;
    const prices = $selectedPrices;
    const query = $searchQuery;

    const categoryMatch = categories.length === 0 || (Array.isArray(site.category) ? site.category.some(cat => categories.includes(cat)) : categories.includes(site.category));
    const tagMatch = tags.length === 0 || (site.tag && site.tag.some(tag => tags.includes(tag)));
    const softwareMatch = software.length === 0 || (site.software && site.software.some(soft => software.includes(soft)));
    const priceMatch = prices.length === 0 || (site.price && site.price.some(price => prices.includes(price)));
    const searchMatch = !query || site.title.toLowerCase().includes(query.toLowerCase());

    return categoryMatch && tagMatch && softwareMatch && priceMatch && searchMatch;
  })
  .sort((a, b) => {
    const direction = $sortDirection === 'desc' ? -1 : 1;

    switch ($sortOption) {
      case 'alphabetical':
        return direction * (a.title?.localeCompare(b.title) || 0);

      case 'popularity':
        const aClicks = clickCounts[a.href] ?? 0;
        const bClicks = clickCounts[b.href] ?? 0;
        return direction * (aClicks - bClicks);

		case 'likes': {
		  const getSortValue = (href) => {
			const vote = voteData[href] || {};
			if (vote.upvoted) return 0;
			if (vote.downvoted) return 2;
			return 1;
		  };

		  const aVal = getSortValue(a.href);
		  const bVal = getSortValue(b.href);
		  return ($sortDirection === 'desc' ? bVal - aVal : aVal - bVal);
		}


      case 'date':
        const aDate = new Date(a.date ?? 0).getTime();
        const bDate = new Date(b.date ?? 0).getTime();
        return direction * (aDate - bDate);

      default:
        return 0; // no sorting
    }
  });


  
  
  // src/routes/your-page/+page.js
export async function load({ url }) {
  const searchParams = url.searchParams;

  const selectedCategories = searchParams.getAll('categories') || [];
  const selectedTags = searchParams.getAll('tags') || [];
  const selectedPrices = searchParams.getAll('prices') || [];
  const selectedSoftware = searchParams.getAll('software') || [];
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.set(params.get("sort") || "");			
  const sortDirection = searchParams.set(params.get("direction") || "");

  return {
    props: {
      selectedCategories,
      selectedTags,
      selectedPrices,
      selectedSoftware,
      searchQuery,
      sortOption,
	  sortDirection,
    },
  };
}

</script>

  <!-- FilterDropdown Component-->
  <FilterDropdown 
    {showFilterDropdown} 
    {filteredSites} 
    updateFilterDropdownState={updateFilterDropdownState} 
  /> 


<!-- Main Content Section -->
<div class="flex">
  <!-- Sidebar Component
  <Sidebar 
    {showSidebar} 
    {filteredSites} 
    updateSidebarState={updateSidebarState} 
  /> -->


  <!-- Main Content Section -->
  <div class="flex-1">
    <BoxHolder 
      sites={filteredSites} 
      bind:filterTag={$selectedTags} 
      bind:filterCategory={$selectedCategories}
      bind:filterPrice={$selectedPrices}
      bind:filterSoftware={$selectedSoftware}
      bind:searchQuery={$searchQuery}
      bind:sortOption={$sortOption}
      bind:sortDirection={$sortDirection}
    />
  </div>
</div>
