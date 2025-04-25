<script>
	import { links as sites } from "$lib/sites.js";
	import BoxHolder from "$lib/BoxHolder.svelte";
	import { writable } from "svelte/store";

	// Extract unique tags and categories dynamically
	let allTags = [...new Set(sites.flatMap(site => site.tags || []))];
	let allCategories = [...new Set(sites.flatMap(site => site.category || []))];
	let allPrices = [...new Set(sites.map(site => site.price || ""))].filter(Boolean);
	let allSoftware = [...new Set(sites.flatMap(site => site.software || []))];

	// Writable stores for filters
	let selectedCategories = writable([]);
	let selectedTags = writable(["Question"]);
	let selectedPrices = writable([]);
	let selectedSoftware = writable([]);
	let searchQuery = writable("");
	let scoreThreshold = writable(0);

	// Dropdown states
	let showCategories = false;
	let showPrices = false;
	let showSoftware = false;
	let showTags = false;
</script>

<style>
  /* General Styling */
  h1, p, li {
    color: #FFFFFF;
  }

/* Media Query for Mobile Screens (max-width: 768px) */
@media (max-width: 768px) {
  h1 {
    font-size: 1.8rem; /* Smaller heading on mobile */
  }

  h2 {
    font-size: 1.5rem; /* Slightly smaller heading */
  }

  h3 {
    font-size: 1.2rem; /* Smaller sub-heading */
  }

  p {
    font-size: 0.9rem; /* Smaller paragraph text */
    line-height: 1.5; /* Improve readability */
  }

  li {
    font-size: 1rem; /* Smaller list item text */
  }

  .category-list li {
    margin: 10px 0; /* Adjust spacing for smaller screens */
  }

  .category-list {
    padding-left: 0;
  }

  /* Adjust for mobile screens in the gallery section */
  .flex-container {
    flex-direction: column;
    text-align: center;
    gap: 15px; /* Space out the boxes more on mobile */
  }

  .box {
    width: 100%; /* Make the boxes full-width */
    padding: 0px;
  }

  /* Sticky Navigation Adjustments */
  .nav-container {
    flex-direction: column;
    padding: 15px;
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .nav-links a {
    font-size: 1rem; /* Adjust nav link text size */
  }
}

  /* Sticky Navigation for Quick Links */
  .nav-links {
    position: sticky;
    top: 54px;
    background: #111;
    padding: 10px 20px;
    z-index: 100;
    display: flex;
    gap: 50px;
    justify-content: center;
  }

  .nav-links a {
    color: #9ca3af;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
  }

  .nav-links a:hover {
    color: #FFFFFF;
  }

  /* Section Backgrounds */
  .section {
    padding: 50px 20px;
  }

.bg-dark-1 { background-color: #000000; } /* Pure Black */
.bg-dark-2 { background-color: #030318; } /* Very Dark Blue */
.bg-dark-3 { background-color: #05062e; } /* Deep Navy Blue */
.bg-dark-4 { background-color: #080c59; } /* Rich Dark Blue */





  .category-list {
    margin-left: 20px;
  }

  /* Color Coding for Pricing */
  .color-code {
    font-weight: bold;
    margin: 10px 0;
  }

  .free { color: #9ca3af; }
  .onetime { color: #FFA500; }
  .subscription { color: #FF4500; }

 /* Dual Screen Section */
.flex-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
  gap: 20px; /* Space between boxes */
}

.flex-container .box {
  width: 50%;
  text-align: center;
  padding: 40px;
  min-height: 250px; /* Ensures even height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
}

/* Styling for "Main Screen" and "Secondary Screen" */
.box-main {
  background-color: #121212;
}

.box-secondary {
  background-color: #000000;
}


</style>

<svelte:head>
	<title>Vizlab.org - Missing Something</title>
</svelte:head>

<!-- Submit Your Resources -->
<div class="section bg-dark-2">
  <h2>Submit Your Resources</h2>
  <p>At <strong>Vizlab.org</strong>, we believe in the power of collaboration and community. That’s why we offer an easy way for you to <strong>submit your favorite resources and links</strong> through our simple submission form!</p>
  <br>
  <p>Once submitted, our team will carefully review each resource to ensure it meets our high-quality standards. We’re committed to curating the best, so if your submission is <strong>valuable</strong>, <strong>useful</strong>, and <strong>relevant</strong>, it will be added to our ever-growing collection!</p>
  <br>
  <h3>This is your chance to contribute to a resource that benefits the entire 3D art community—helping fellow artists find the tools, references, and inspiration they need with ease!</h3>
  <br>
  <p>Submit your links today and help us make <strong>Vizlab.org</strong> even better for everyone!</p>
</div>

<BoxHolder 
      sites={sites} 
      bind:filterTag={$selectedTags} 
      bind:filterCategory={$selectedCategories}
      bind:filterPrice={$selectedPrices}
      bind:filterSoftware={$selectedSoftware}
      bind:searchQuery={$searchQuery}
      bind:scoreThreshold={$scoreThreshold} />

