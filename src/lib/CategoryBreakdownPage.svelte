<script>
  import BoxHolder from "$lib/BoxHolder.svelte";
  import { links as sites } from "$lib/sites.js";

  export let category = "";
  export let descriptor = "";
  export let subHeader = "";
  export let explainer = "";
  export let closer = "";
  export let ignoreTags = false;

  export let excludedTags = []; // Tags to ignore completely
  export let tagNameOverrides = {}; // { "AI": "Artificial Intelligence" }
  export let tagGroups = {}; // { "Rendering Tools": ["Cycles", "Octane", "Redshift"] }

  // 1. Filter by category
  const categorySites = sites.filter(site =>
    site.category && site.category.includes(category)
  );

  // 2. Tag grouping helper
  const getGroupNameForTag = (tag) => {
    for (const [groupName, tags] of Object.entries(tagGroups)) {
      if (tags.includes(tag)) return groupName;
    }
    return tag;
  };

  // 3. Extract grouped sites
	const groupSites = () => {
	  if (ignoreTags) {
		const groupName = `${category} Links:`;
		return { [groupName]: categorySites };
	  }

	  const grouped = {};
	  let untaggedSites = [];

	  for (const site of categorySites) {
		const siteTags = site.tag || [];

		if (siteTags.length === 0) {
		  untaggedSites.push(site);
		  continue;
		}

		const groupsThisSiteBelongsTo = new Set();

		for (const tag of siteTags) {
		  if (excludedTags.includes(tag)) continue;

		  // Check if tag belongs to a tagGroup
		  let foundGroup = false;
		  for (const [groupName, tags] of Object.entries(tagGroups)) {
			if (tags.includes(tag)) {
			  groupsThisSiteBelongsTo.add(groupName);
			  foundGroup = true;
			  break;
			}
		  }

		  if (!foundGroup) {
			groupsThisSiteBelongsTo.add(tag);
		  }
		}

		for (const groupName of groupsThisSiteBelongsTo) {
		  if (!grouped[groupName]) {
			grouped[groupName] = [];
		  }
		  grouped[groupName].push(site);
		}
	  }

	  if (untaggedSites.length > 0) {
		grouped["Untagged"] = untaggedSites;
	  }

	  // Remove any empty groups (probably not needed, but safe)
	  for (const key in grouped) {
		if (grouped[key].length === 0) {
		  delete grouped[key];
		}
	  }

	  return grouped;
	};

  const groupedSites = groupSites();

  // Utilities
  const formatTagName = (tag) => tagNameOverrides[tag] || tag;
  const tagToId = (tag) => formatTagName(tag).toLowerCase().replace(/\s+/g, '');
  
  const getRealTagsForGroup = (groupName) => {
  if (tagGroups[groupName]) {
    return tagGroups[groupName];
  }
  return [groupName]; // Assume it's just a single raw tag
};

</script>



<!-- Navigation -->
<div class="sticky-header bg-gray-900 shadow-md">
  <h1>{descriptor}</h1>
  <h2>{subHeader}</h2>
  <p>{explainer}</p>
  <h3>{closer}</h3>

  {#if !ignoreTags}
	  <nav class="flex flex-wrap space-x-4 overflow-x-auto p-1">
		{#each Object.keys(groupedSites) as tag}
		  <a href={`#${tagToId(tag)}`} class="text-white font-semibold py-2 px-4 rounded-md transition duration-300 hover:bg-blue-600 hover:text-white">
			{formatTagName(tag)} ({groupedSites[tag]?.length || 0})
		  </a>
		{/each}
	  </nav>
	{/if}
</div>

<!-- Loop through the grouped sites and display them in sections -->
{#each Object.entries(groupedSites) as [tag, sitesForTag], index}
  <div id={tagToId(tag)} class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
    {#if index % 2 === 0}
      <h2><a href={`#${tagToId(tag)}`} class="text-left text-xl font-semibold">{formatTagName(tag)}</a></h2>
    {:else}
      <h3><a href={`#${tagToId(tag)}`} class="text-left text-xl font-semibold">{formatTagName(tag)}</a></h3>
    {/if}
  </div>

  {#if sitesForTag.length > 0}
    <BoxHolder 
	  sites={sitesForTag}
	  filterTag={ignoreTags ? [] : getRealTagsForGroup(tag)}
	  scoreThreshold={null}
	  filterPrice=""
	/>

  {:else}
    <p>No sites available for this category.</p>
  {/if}
{/each}

