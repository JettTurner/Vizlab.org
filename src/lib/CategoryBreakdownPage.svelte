<script>
  import BoxHolder from "$lib/BoxHolder.svelte";
  export let category = "";  // The category to filter by
  export let descriptor = "";  
  export let subHeader = "";  
  export let explainer = "";  
  export let closer = "";  
  export let ignoreTags = false; // Option to ignore tags and show all links in one group

  import { links as sites } from "$lib/sites.js";  

  // Find sites belonging to the category
  const categorySites = sites.filter(site => 
    site.category && site.category.includes(category)
  );

  // Extract unique tags from categorized sites
  const extractCategoryTags = () => {
    const tagsSet = new Set();

    categorySites.forEach(site => {
      if (Array.isArray(site.tags) && site.tags.length > 0) {
        site.tags.forEach(tag => tagsSet.add(tag));
      }
    });

    return Array.from(tagsSet);
  };

  // Function to group sites by their tags, or put all in one category if ignoreTags is true
  const groupSites = () => {
    if (ignoreTags) {
      // Dynamically change "All Links" to [CategoryName]Links
      const groupName = `${category} Links:`;
      return { [groupName]: categorySites }; // Group sites under dynamic name
    }

    const grouped = {};
    let untaggedSites = [];

    const tags = extractCategoryTags();

    tags.forEach(tag => {
      grouped[tag] = categorySites.filter(site => 
        Array.isArray(site.tags) && site.tags.includes(tag)
      );
    });

    // Find untagged sites
    untaggedSites = categorySites.filter(site => 
      !site.tags || site.tags.length === 0 // Ensures empty array [] is counted
    );

    if (untaggedSites.length > 0) {
      grouped["Untagged"] = untaggedSites;
    }

    return grouped;
  };

  // Extract tags and group sites for the given category
  const groupedSites = groupSites();
</script>

<!-- Navigation -->
<div class="sticky-header bg-gray-900 shadow-md">
  <h1>{descriptor}</h1>
  <h2>{subHeader}</h2>
  <p>{explainer}</p>
  <h3>{closer}</h3>

  {#if !ignoreTags} <!-- Conditionally hide tag bar if ignoreTags is true -->
    <nav class="flex flex-wrap space-x-4 overflow-x-auto p-1">
      {#each Object.keys(groupedSites) as tag}
        <a href={`#${tag.toLowerCase().replace(/\s+/g, '')}`} class="text-white font-semibold py-2 px-4 rounded-md transition duration-300 hover:bg-blue-600 hover:text-white">
          {tag} ({groupedSites[tag]?.length || 0}) <!-- Display count -->
        </a>
      {/each}
    </nav>
  {/if}
</div>

<!-- Loop through the grouped sites and display them in sections -->
{#each Object.entries(groupedSites) as [tag, sitesForTag], index}
  <div id={tag.toLowerCase().replace(/\s+/g, '')} class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
    {#if index % 2 === 0}
      <h2><a href={`#${tag.toLowerCase().replace(/\s+/g, '')}`} class="text-left text-xl font-semibold">{tag}</a></h2>
    {:else}
      <h3><a href={`#${tag.toLowerCase().replace(/\s+/g, '')}`} class="text-left text-xl font-semibold">{tag}</a></h3>
    {/if}
  </div>

  {#if sitesForTag.length > 0}
    <BoxHolder sites={sitesForTag} filterTag={ignoreTags ? [] : [tag]} scoreThreshold={null} filterPrice=""/>
  {:else}
    <p>No sites available for this category.</p> <!-- Debugging output -->
  {/if}
{/each}
