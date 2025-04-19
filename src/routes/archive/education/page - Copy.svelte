<script>
	//import { links as education } from "$lib/Education.js";
	import { links as main } from "$lib/sites.js";
	import Box from "$lib/Box.svelte";
	
	const topLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				// we have a tag list
				return obj.tags.includes("Top");
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
	const texturingLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				// we have a tag list
				return obj.tags.includes("Texturing");
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
	const animationLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				// we have a tag list
				return obj.tags.includes("Animation");
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
	const levelDesignandEnvironmentLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				// we have a tag list
				return obj.tags.includes("LevelDesign");
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
	const shadersRenderingLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				// we have a tag list
				return obj.tags.includes("ShadersRendering");
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
	const mathLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				// we have a tag list
				return obj.tags.includes("Math");
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
	const compositingLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				if(obj.tags.includes("Compositing")){
					return obj;
				}
				// we have a tag list
				return false;
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
	const lightingLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				if(obj.tags.includes("Lighting")){
					return obj;
				}
				// we have a tag list
				return false;
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
	const colorSpacesandManagementLinks = main.filter(function(obj){
		if(obj.tags){
			if(obj.tags.includes("Education")){
				if(obj.tags.includes("ColorSpacesandManagement")){
					return obj;
				}
				// we have a tag list
				return false;
			}else{
				// don't include
				return false;
			}
			return false;
		}
	});
</script>

<svelte:head>
	<title>Education - Vizlab.org</title>
	<!--<link rel="stylesheet" media="screen" href="https://fontlibrary.org//face/avara" type="text/css"/>-->
</svelte:head>

<header class="sticky top-0 border-b-2 border-stone-200 border-solid bg-gradient-to-r from-[#ff0000] to-[#0000ff]">
	<div class="p-2 pl-4 pr-4 md:p-4 text-2xl md:text-4xl flex flex-wrap gap-2 md:gap-8 items-center">
		<span class="grow tracking-widest font-bold font-mono md:ml-8"  >
			<a href={"/"} class="hover:text-[#0066ff]">
			Vizlab.org
			</a>/education
		</span>
		
		<span class="tracking-normal font-bold font-mono border-b-2 border-stone-100 border-solid" >
			<button on:click={history.back()} class="hover:text-[#ff0000]">
			back
			</button>
		</span>
		
		<!--{#snippet btn(text, onclick)}
			<button class="border-2 md:border-4 p-1 md:p-2 border-stone-200 rounded-md md:rounded-xl font-mono" onclick={onclick}>
				{text}
			</button>
		{/snippet}
		{#snippet icon(href, title, onclick, highlighted=false)}
			<svg class="p-1 md:p-2 size-10 md:size-16 cursor-pointer" onclick={onclick} class:fill-stone-200={!highlighted} class:fill-sky-300={highlighted} >
				<use href={href}></use>
				<title>{title}</title>
			</svg>
		{/snippet}-->
	</div>
</header>


<div id="top" class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h1> <a href="/education/#top">Top Resources:</a> </h1>
	
	
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each topLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
</div>



<div id="animation" style="margin-top: 40;" class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h3> <a href="/education/#animation"> Animation </a> </h3>
	
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each animationLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
</div>



<div id="leveldesignenvironment" class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h2> <a href="/education/#leveldesignenvironment"> Level Design / Environment </a> </h2>
	
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each levelDesignandEnvironmentLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
</div>



<div id="shadersrenderingmath" class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h3> <a href="/education/#shadersrenderingmath"> Shaders / Rendering / Math </a> </h3>
	<p>Shaders and Rendering</p>
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each shadersRenderingLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
	<p>Math</p>
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each mathLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
</div>



<div id="compositinglightingcolorspacesandmanagement" class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h2> <a href="/education/#compositinglightingcolorspacesandmanagement"> Compositing / Lighting / Color Spaces and Management </a> </h2>
	<p>Compositing</p>
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each compositingLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
	<p>Lighting</p>
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each lightingLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
	<p>ColorSpaces and Management</p>
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each colorSpacesandManagementLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
</div>



<div id="texturingtrimsprocedurals" class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h3>  <a href="/education/#texturingtrimsprocedurals"> Texturing / Trims / Procedurals </a> </h3>
	
	<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
		<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
			{#each texturingLinks as link}
				<Box link={link} />
			{/each}
		</div>
	</div>
</div>



<div id="modelingcharacters" class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h2> <a href="/education/#modelingcharacters"> Modeling (Characters) </a> </h2>
</div>



<div id="modelinghardsurface" class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h3> <a href="/education/#modelinghardsurface"> Modeling (Hard Surface) </a> </h3>
</div>



<!--
<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<h2> CC0 Sorted by Quality: </h2>	
	<h3> Blender Assets and Tools: </h3>
	<h2> Unreal Assets and Tools: </h2>
	<h3> AI and Generative Tools: </h3>
	<h2> Misc_Resources: </h2>
</div>
-->