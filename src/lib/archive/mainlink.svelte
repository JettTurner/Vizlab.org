<script>
	import { sites } from "$lib/sites.js"
	import Modal from '$lib/Modal.svelte';
	import '$lib/FileSaver.js'; // adds saveAs to global scope

	import sprite from "$lib/assets/sprite.min.svg";

	const images = import.meta.glob(
		'$lib/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true
			}
		}
	)

	let count = $state(0);
	let editing = $state(false);
	let target = $state();
	let upload_input;
	let upload_files = $state();
	let edit_modal;
	let options_is_open = $state(false);

	// Our main Link Class for the link blocks
	class Link {
		image = $state();
		title = $state();
		description = $state();
		href = $state();
		files = $state();
		constructor(image, title, description, href, baked=false){
			this.image = image;
			this.title = title;
			this.description = description;
			this.href = href;
			this.baked = baked;
		}
		toJSON(){
			return {
				image: this.image,
				title: this.title,
				description: this.description,
				href: this.href,
			}
		}
	}

	//A bunch of asynchronous stuff Kenan wrote to let us load the links.	
	// convert the json data into links
	let links = $state(sites.map(function(obj){
		const img = images[obj.image].default;
		return new Link(
			img,
			obj.title,
			obj.description,
			obj.href,
		)
	}));

	let linksEd = $state(sitesEd.map(function(obj){
		const img = images[obj.image].default;
		return new Link(
			img,
			obj.title,
			obj.description,
			obj.href,
		)
	}));


	async function fileToBase64(file){
		const reader = new FileReader();
		const p = new Promise(function(res, rej){
			reader.onload = function(e){
				res(e.target.result);
			}
			reader.onerror = rej
		});
		console.log("converting...", file)
		reader.readAsDataURL(file);
		return p;
	}

	function onClick(link, e){
		if(editing){
			target = link
			edit_modal.show();
		}else{
			if(link.href){
				window.location.href = link.href
			}else{
				window.alert("Link is empty!");
			}
		}
	}

	function add(e){
		const bink = new Link(undefined, "No Title Defined", "No Description Defined", undefined);
		links.push(bink);
	}
	function edit(e){
		editing = !editing;
	}
	async function onFilesChanged(e){
		if(!target || !target.files) return;
		if(target.files.length == 0){
			target.image = undefined;
		}else{
			try {
				const data = await fileToBase64(target.files[0])
				target.image = data;
			} catch (e) {
				console.error(e)
			}
		}
	}
	function upload(e){
		upload_input.click()
	}
	async function onUpload(e){
		if(upload_files && upload_files.length > 0){
			const file = upload_files[0];
			try{
				const text = await file.text();
				const obj = JSON.parse(text);
				
				links.length = 0;
				obj.forEach(function(o){
					const l = new Link(o.image, o.title, o.description, o.href);
					links.push(l);
				})
			} catch (e) {
				console.error(e);
			}
		}
	}
	function download(e){
		const str = JSON.stringify(links, null, '\t');
		const blob = new Blob([str], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "links.json");
	}
	function remove(e){
		if(!window.confirm("Remove link?")) return;
		const index = links.indexOf(target);
		if (index > -1) { // only splice array when item is found
			links.splice(index, 1); // 2nd parameter means remove one item only
			edit_modal.close()
		}
	}
	function trash(e){
		if(!window.confirm("Remove all links?")) return;
		links.length = 0;
	}
</script>

<!-- This is the Code for each link in the link page -->
{#snippet item(link)}
	<a class="flex flex-col size-36 h-64 md:size-64 hover:bg-blue-600 hover:border-blue-600 border-2 border-stone-400 bg-stone-900 cursor-pointer" title={link.href} href={link.href} onclick={onClick.bind(null,link)}>
		{#if link.image}
			{#if typeof link.image === 'object'}
				<enhanced:img class="h-16 md:h-32 size-full object-cover " src={link.image} alt="link.title" />
			{:else}
				<img class="h-16 md:h-32 size-full object-cover " src={link.image} />
			{/if}
		{:else}
			<div class="h-16 md:h-32 size-full">
				<svg class="p-4 size-full fill-zinc-200" >
					<use href={sprite + "#image"}></use>
				</svg>
			</div>
		{/if}
		<!-- This is the Title -->
		<div class="ml-2 md:ml-4 mr-2 md:mr-4 mt-1 md:mt-2 h-full flex flex-col">
			<div class="h-14 md:h-8 text-xl md:text-md font-bold md:text-nowrap text-ellipsis overflow-hidden">
				{link.title}
			</div>
			<!-- This is the Descriptor -->
			<div class="h-28 md:h-20 text-base text-[#a0a0a0] text-wrap overflow-y-auto">
				{link.description}
			</div>
		</div>
	</a>
{/snippet}


<div class="container mx-auto max-w-full pl-4 md:pl-16 pr-4 md:pr-16 pt-4 pb-4">
	<div class="grid grid-cols-[repeat(auto-fit,_8rem)] md:grid-cols-[repeat(auto-fit,_16rem)] justify-items-center justify-Left gap-8">
		{#each links as link}
			{@render item(link)}
		{/each}
		<!-- {@render item("https://upload.wikimedia.org/wikipedia/commons/8/80/Scott_The_Woz.jpg", "Title goes here, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nibh velit, fringilla ut auctor ac,", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nibh velit, fringilla ut auctor ac, commodo vel turpis. Praesent finibus molestie nunc, molestie convallis lectus commodo non. Vivamus pharetra lorem ut suscipit scelerisque. Praesent lacinia, nulla non tincidunt venenatis, ligula augue tincidunt dui, ut luctus nisl lorem eu ligula. In hac habitasse platea dictumst. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent nec fermentum neque. Nullam eget malesuada erat. Aenean vitae lorem facilisis, volutpat magna vitae, aliquam purus. Phasellus consectetur consequat lacus in suscipit. In vestibulum risus eu orci tincidunt sodales. Praesent non tellus tristique, scelerisque erat at, mattis lectus. Donec eget auctor magna, vel bibendum nunc. Vestibulum est purus, finibus sit amet augue sit amet, tempor venenatis risus.", "https://en.wikipedia.org/wiki/Scott_the_Woz")} -->
	</div>
</div>