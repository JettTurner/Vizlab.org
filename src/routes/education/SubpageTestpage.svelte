<script>
  import Header from "$lib/Header.svelte";  // Import the reusable header
  import { links as sites } from "$lib/sites.js";  // Import the sites data
  import BoxHolder from "$lib/BoxHolder.svelte";  // Import the BoxHolder component


  // Function to extract tags from sites that match a given category
  const extractCategoryTags = (category) => {
    const tagsSet = new Set();

    // Filter sites that belong to the given category
    const categorySites = sites.filter(site => 
      site.category && Array.isArray(site.category) && site.category.includes(category)
    );

    categorySites.forEach(site => {
      if (site.tags && Array.isArray(site.tags)) {
        site.tags.forEach(tag => {
          tagsSet.add(tag);
        });
      }
    });

    // Convert the Set back to an array and return it
    return Array.from(tagsSet);
  };

  // Function to group sites by a specific tag
  const groupSitesByTags = (tags, category) => {
    const grouped = {};

    tags.forEach(tag => {
      const filteredSites = sites.filter(site => 
        Array.isArray(site.tags) && 
        site.tags.some(siteTag => siteTag.toLowerCase() === tag.toLowerCase()) &&
        site.category && site.category.includes(category)  // Ensure the site belongs to the given category
      );
      grouped[tag] = filteredSites;
    });

    return grouped;
  };

  // Example usage for the "Education" category
  const category = "Education";  // This can be dynamically passed as needed
  const categoryTags = extractCategoryTags(category);
  const groupedSites = groupSitesByTags(categoryTags, category);

</script>

<svelte:head>
  <title>{category} - Vizlab.org</title>
  <style>
    /* Sticky header styles */
    .sticky-header {
      position: -webkit-sticky; /* For Safari */
      position: sticky;
      top: 0;
      background-color: white;
      z-index: 1000; /* To make sure it's above the content */
      padding: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    /* Optional: Styling for smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
  </style>
</svelte:head>

<Header /> <!-- Load the Header component here -->

<!-- Sticky Navigation -->
<div class="sticky-header">
  <nav class="flex space-x-4 overflow-x-auto">
    {#each Object.keys(groupedSites) as tag}
      <a href={`#${tag.toLowerCase().replace(/\s+/g, '')}`} class="text-blue-500 hover:text-blue-700">
        {tag}
      </a>
    {/each}
  </nav>
</div>

<!-- Loop through the grouped sites and display them in sections -->
{#each Object.entries(groupedSites) as [tag, sitesForTag], index}
  <!-- Each section has an id based on the tag -->
  <div id={tag.toLowerCase().replace(/\s+/g, '')} class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4 ">
    <!-- Alternate between h2 and h3 based on index -->
    {#if index % 2 === 0}
      <h2><a href={`#${tag.toLowerCase().replace(/\s+/g, '')}`} class="text-left text-xl font-semibold">{tag}</a></h2>
    {:else}
      <h3><a href={`#${tag.toLowerCase().replace(/\s+/g, '')}`} class="text-left text-xl font-semibold">{tag}</a></h3>
    {/if}
  </div>

  <!-- Pass filtered sites for each tag to BoxHolder -->
  {#if sitesForTag.length > 0}
    <BoxHolder sites={sitesForTag} filterTag={[tag]} scoreThreshold={null} filterPrice=""/>
  {/if}
{/each}
