<script>
	import { links as sites } from "$lib/sites.js";
	import BoxHolder from "$lib/BoxHolder.svelte";
</script>

<svelte:head>
	<title>3D Resources - Vizlab.org</title>
</svelte:head>

<header class="sticky top-0 border-b-2 border-stone-200 border-solid bg-gradient-to-r from-[#ff0000] to-[#0000ff]">
	<div class="p-2 pl-4 pr-4 md:p-4 text-2xl md:text-4xl flex flex-wrap gap-2 md:gap-8 items-center">
		<span class="grow tracking-widest font-bold font-mono md:ml-8"  >
			<a href={"/"} class="hover:text-[#0066ff]">
			Vizlab.org
			</a>
		</span>
		
		{#snippet tab(text, href)}
			<span class="tracking-normal font-bold font-mono border-b-2 border-stone-100 border-solid" >
				<a href={href} class="hover:text-[#ff0000]">
				{text}
				</a>
			</span>
		{/snippet}
		
		{@render tab("Education", "education")}
		{@render tab("Reference","reference")}
		{@render tab("Assets","assets")}<!---->
		{@render tab("Documentation","documentation")}
		{@render tab("GettingStarted", "gettingstarted")}
		{@render tab("About", "about")}
		
	</div>
</header>

<!-- Pass 'filterTag' as a prop to BoxHolder, for example "Main" -->
<BoxHolder sites={sites} filterTag={["Main","Question",]} scoreThreshold={null} filterPrice=""/> <!-- Pass the sites list to the BoxHolder component -->

