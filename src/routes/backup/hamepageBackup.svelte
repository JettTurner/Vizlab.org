<script>
	import Header from "$lib/Header.svelte";  // Import the reusable header
	import { links as sites } from "$lib/sites.js";
	import BoxHolder from "$lib/BoxHolder.svelte";
</script>

<svelte:head>
	<title>3D Resources - Vizlab.org</title>
</svelte:head>

<Header />  <!-- Load the Header component here -->

<!-- Pass 'filterTag' as a prop to BoxHolder, for example "Main" -->
<BoxHolder sites={sites} filterTag={["Main","Question",]} scoreThreshold={null} filterPrice=""/> <!-- Pass the sites list to the BoxHolder component -->

