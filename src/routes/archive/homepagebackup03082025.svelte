<script>
	import Header from "$lib/Header.svelte";
	import { links as sites } from "$lib/sites.js";
	import BoxHolder from "$lib/BoxHolder.svelte";
	

	import { writable, derived } from "svelte/store";

	// Extract unique tags dynamically
	let allTags = [...new Set(sites.flatMap(site => site.tags || []))];

	// Create a writable store for selected tags
	let selectedTags = writable(["Main", "Question"]);
</script>

<svelte:head>
	<title>3D Resources - Vizlab.org</title>
</svelte:head>

<Header />

<div class="flex">
	<!-- Sidebar for tag selection -->
	<div class="w-1/4 p-4 border-r border-gray-300">
		<h3 class="font-bold mb-2">Filter by Tags</h3>
		{#each allTags as tag}
			<label class="block">
				<input type="checkbox" bind:group={$selectedTags} value={tag} />
				{tag}
			</label>
		{/each}
	</div>

	<!-- Main content area -->
	<div class="w-3/4 p-4">
		<BoxHolder sites={sites} bind:filterTag={$selectedTags} scoreThreshold={null} filterPrice="" />
	</div>
</div>
