<script>
  import Box from "$lib/Box.svelte"; // Import the Box component
  import { getClickCounts } from "$lib/clickTracker.js";
  import { onMount } from "svelte";

  export let sites = []; // This will accept the passed-in list of sites
  export let filterTag = ["Main"]; // Default filterTag is "Main", but this can be customized
  export let scoreThreshold = 0; // Default score threshold (0-100)
  export let filterPrice = "Free"; // Default price of free


	// Filter the sites based on tags, score threshold, and price
	const filteredSites = sites.filter((obj) => {
		const matchesTag = obj.tags 
			? filterTag.some(tag => obj.tags.includes(tag)) // Check if ANY filterTag exists in obj.tags
			: false;
		
		const meetsScore = obj.score !== undefined ? obj.score >= scoreThreshold : false;
		const matchesPrice = obj.price !== undefined ? obj.price.includes(filterPrice) : false;

		return matchesTag && meetsScore && matchesPrice;
	});
	
    
</script>

<!-- This is the layout for rendering the boxes in a grid -->
<div class="container mx-auto max-w-full md:pl-4 md:pr-4 pl-4 pr-4 pt-2 pb-2">
  <div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center md:justify-center gap-3">
    {#each filteredSites as link}
      <Box link={link} /> <!-- Render Box for each filtered link -->
    {/each}
  </div>
</div>
