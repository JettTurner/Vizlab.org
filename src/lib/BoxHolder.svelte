<script>
  import Box from "$lib/Box.svelte";
  import { getClickCounts } from "$lib/clickTracker.js";
  import { onMount } from "svelte";
  import { browser } from "$app/environment"; // Import browser check

  export let sites = []; 
  export let filterTag = []; 
  export let filterCategory = [];
  export let filterPrice = [];
  export let filterSoftware = [];
  export let searchQuery = "";
  export let scoreThreshold = 0;

  let clickCounts = {};

  async function loadClicks() {
    if (browser) {
      try {
        const data = await getClickCounts();
        if (typeof data === "object" && data !== null) {
          clickCounts = data; // ✅ Only update if it's valid JSON
        } else {
          console.error("Unexpected data format for click counts:", data);
          clickCounts = {}; // ✅ Default to an empty object
        }
      } catch (error) {
        console.error("Failed to load click counts:", error);
        clickCounts = {}; // ✅ Prevents app from breaking
      }
    }
  }
  
  onMount(loadClicks);

  $: filteredAndSortedSites = sites.filter((obj) => {
    const matchesTag = filterTag.length
	  ? (filterTag.includes("Untagged") && (!obj.tags || obj.tags.length === 0)) || 
		obj.tags?.some(tag => filterTag.includes(tag))
	  : true;
    const matchesCategory = filterCategory.length ? obj.category?.some(cat => filterCategory.includes(cat)) : true;
    const matchesPrice = filterPrice.length
	  ? Array.isArray(obj.price) 
		? obj.price.some(price => filterPrice.includes(price)) 
		: filterPrice.includes(obj.price)
	  : true;
    const matchesSoftware = filterSoftware.length ? obj.software?.some(soft => filterSoftware.includes(soft)) : true;
    const meetsScore = obj.score !== undefined ? obj.score >= scoreThreshold : true;
    const matchesSearch = searchQuery.length
      ? obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesTag && matchesCategory && matchesPrice && matchesSoftware && meetsScore && matchesSearch;
  });
</script>

{#if browser && Object.keys(clickCounts).length >= 0}
  <div class="container mx-auto max-w-full md:pl-4 md:pr-4 pl-4 pr-4 pt-2 pb-2">
    <!-- Use responsive grid classes for different screen sizes -->
    <div class="grid grid-cols-2 min-[840px]:grid-cols-[repeat(auto-fit,_16rem)] justify-center gap-3">
      {#each filteredAndSortedSites as link (link)}
        <div class="w-full h-32 md:h-auto md:w-auto">
          <Box link={link} clickCounts={clickCounts[link.href] || 0} />
        </div>
      {/each}
    </div>
  </div>
{:else}
  <p class="text-center text-gray-500 mt-4">Loading links...</p>
{/if}
