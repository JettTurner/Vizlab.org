<script>
  import Box from "$lib/Box.svelte"; // Import the Box component
  import { getClickCounts } from "$lib/clickTracker.js";
  import { onMount } from "svelte";

  export let sites = []; 
  export let filterTag = ["Main"]; 
  export let scoreThreshold = 0; 
  export let filterPrice = "Free"; 

  let clickCounts = {};
  let filteredSites = [];

  // Reactive: Automatically filter sites when props change
  $: filteredSites = sites.filter((obj) => {
    const matchesTag = obj.tags 
      ? filterTag.some(tag => obj.tags.includes(tag)) 
      : false;
    
    const meetsScore = obj.score !== undefined ? obj.score >= scoreThreshold : false;
    const matchesPrice = obj.price !== undefined ? obj.price.includes(filterPrice) : false;

    return matchesTag && meetsScore && matchesPrice;
  });

  let sortedSites = [];

  async function loadClicks() {
    clickCounts = await getClickCounts();

    console.log("Click Counts Loaded:", clickCounts);

    // ✅ Apply sorting *after* filtering
    sortedSites = [...filteredSites].sort((a, b) => (clickCounts[b.href] || 0) - (clickCounts[a.href] || 0));

    console.log("Sorted Sites:", sortedSites);
  }

  onMount(loadClicks);

  // ✅ Reactively update sorting when `filteredSites` changes
  $: {
    if (filteredSites.length > 0) {
      sortedSites = [...filteredSites].sort((a, b) => (clickCounts[b.href] || 0) - (clickCounts[a.href] || 0));
    }
  }
</script>

<!-- Render FILTERED Sites -->
<div class="container mx-auto max-w-full md:pl-4 md:pr-4 pl-4 pr-4 pt-2 pb-2">
  <div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center md:justify-center gap-3">
    {#each filteredSites as link}
      <Box link={link} />
    {/each}
  </div>
</div>

<!-- Render SORTED Sites -->
<div class="container mx-auto max-w-full">
  <div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)]">
    {#each sortedSites as link}
      <Box link={link} />
    {/each}
  </div>
</div>
