<script>
  // Import the click tracking function
  import { trackClick } from "$lib/clickTracker.js";
  
  // Import box size adjuster
  import { boxSize } from "$lib/stores/boxSize.js";
  
  // Retrieve the 'link' prop from the parent component
  let { link } = $props();
  
  // Set colors for these categories:
  const categoryColors = {
    Main: 'text-blue-500',
    Reference: 'text-green-500',
    Education: 'text-yellow-500',
    Assets: 'text-red-500',
    Documentation: 'text-purple-400',
    GettingStarted: 'text-orange-500',
  };

  // Ensure categories are always an array
  let categories = link.category ? (Array.isArray(link.category) ? link.category : [link.category]) : [];

  // Function to handle click events and track them using the trackClick function
  async function handleClick(event) {
	//event.preventDefault();
	//console.log(link);
	
	try{
		const url = new URL('/api/set.php', window.location.href);
		url.searchParams.set('link', link.href);
		const resp = await fetch(url);
		console.log(resp.ok);
	}finally{
		  // 0 = left click, 1 = middle click, 2 = right click
		  /*switch (event.button) {
			case 0:
			  console.log('Left click');
			  break;
			case 1:
			  console.log('Middle click (usually open in new tab)');
			  break;
			case 2:
			  console.log('Right click (context menu or open in new tab)');
			  break;
		  }*/
		  // Check if the click is a normal left-click, middle-click, or if the ctrl/meta key is pressed
			/*if (event.button === 0 || event.button === 1 || event.ctrlKey || event.metaKey) {
			  // trackClick(link.href); // Track the click on the link
			}*/
		  // Optional: Prevent default if you want to override normal behavior
		  // event.preventDefault();

	}
	
	
    
  }

  // Import the sprite (used for icon images like broken link or placeholder)
  import sprite from "$lib/assets/sprite.min.svg";
  
  // Load images dynamically based on file types (eager loading)
  const images = import.meta.glob(
    '$lib/assets/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
    { eager: true, query: { enhanced: true } }
  );
  
  // Assign the appropriate image to the link (if exists)
  link.img = images[link.image]?.default;

  // Default color settings (if not provided by the link object)
  let color = link.color || 'bg-stone-900';
  let primaryTextColor = $state(link.primaryTextColor || 'text-stone-400 group-hover:text-stone-100');
  let secondaryTextColor = link.secondaryTextColor || 'text-stone-300';
  let error = false; // To track if an image is missing
	//$inspect(primaryTextColor);
	
  // Reactive price formatting logic based on the 'link.price' value
  $derived: {
    if (link.price) {
      let selectedPrice = "";
      // Check if price is a subscription, one-time purchase, or free
      if (link.price.includes('Subscription')) {
        selectedPrice = 'Subscription';
      } else if (link.price.includes('OneTimePurchase')) {
        selectedPrice = 'OneTimePurchase';
      } else if (link.price.includes('Free')) {
        selectedPrice = 'Free';
      }

      // Set the color scheme based on the selected price type
      switch (selectedPrice) {
        case "Subscription":
          color = 'bg-[#171717]'; // Background for subscription
          primaryTextColor = 'text-red-400 group-hover:text-red-400'; // Text color for subscription
          secondaryTextColor = 'text-stone-300'; // Secondary text color
          break;
        case "OneTimePurchase":
          color = 'bg-[#171717]'; // Background for one-time purchase
          primaryTextColor = 'text-orange-400 group-hover:text-orange-400'; // Text color for one-time purchase
          secondaryTextColor = 'text-stone-300'; // Secondary text color
          break;
        case "Free":
          color = 'bg-stone-900'; // Background for free links
          primaryTextColor = 'text-stone-400 group-hover:text-stone-100'; // Text color for free
          secondaryTextColor = 'text-stone-300'; // Secondary text color
          break;
        default:
          color = 'bg-[#ff00ff]'; // Fallback color for unrecognized price
          primaryTextColor = 'text-[#ff00ff]'; // Fallback text color
          secondaryTextColor = 'text-[#a0a0a0]'; // Fallback secondary text color
          break;
      }
    }
  }

  // Reactive error state to determine if the link has a missing image
  $derived: {
    error = !link.img; // Set error to true if no image is found
  }
</script>

<!-- Link container with dynamic styles based on the 'link' object -->
<a
  class="group flex flex-col size-auto h-32 min-[840px]:size-64 border-2 border-stone-700 cursor-pointer {color} hover:border-blue-900 hover:bg-blue-800 rounded-lg overflow-hidden"
  title={link.href}
  href={link.href}
  on:mouseup={handleClick}
>
  <!-- Category Tags (show only if categories exist) -->
  {#if categories.length}
    <div class="relative flex flex-col gap-1 items-start opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      <div class="absolute top-2 left-2 flex flex-col gap-1 opacity-100 z-20">
        {#each categories as cat}
          <!-- Render each category tag with styles -->
          <span class="category-tag text-xs font-semibold px-2 py-1 bg-black/80 rounded {categoryColors[cat] || 'text-gray-500'}">
            {cat}
          </span>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Price Tags (show only if link.price is defined, aligned right) -->
  {#if link.price}
    <div class="relative flex flex-col gap-1 items-end opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      <div class="absolute top-2 right-2 flex flex-col gap-1 opacity-100 z-20">
        {#if link.price.includes('Free')}
          <span class="text-green-400 text-xs font-semibold px-2 py-1 bg-black/80 rounded">
            Free
          </span>
        {/if}
        {#if link.price.includes('OneTimePurchase')}
          <span class="text-orange-400 text-xs font-semibold px-2 py-1 bg-black/80 rounded">
            One Time Purchase
          </span>
        {/if}
        {#if link.price.includes('Subscription')}
          <span class="text-red-400 text-xs font-semibold px-2 py-1 bg-black/80 rounded">
            Subscription
          </span>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Display image or broken link icon based on availability -->
  {#if error}
    <div class="h-16 min-[840px]:h-16 size-full">
      <svg class="p-4 size-full fill-zinc-200">
        <!-- Broken link icon -->
        <use href={sprite + "#link-broken"}></use>
      </svg>
    </div>
  {:else}
    {#if link.image}
      <!-- Display the actual image -->
      <enhanced:img class="h-20 min-[840px]:h-52 size-full object-cover object-left object-[2%_100%] transition-all delay-150 duration-300 ease-in-out group-hover:h-6 group-hover:object-cover group-hover:min-[840px]:h-32 rounded-lg" src={link.img} />
    {:else}
      <!-- Placeholder image if no link image is provided -->
      <div class="h-20 min-[840px]:h-52 size-full">
        <svg class="p-4 size-full fill-zinc-200">
          <!-- Placeholder icon -->
          <use href={sprite + "#image"}></use>
        </svg>
      </div>
    {/if}
  {/if}

  <!-- Title and Description of the link -->
  <div class="ml-2 min-[840px]:ml-4 mr-2 min-[840px]:mr-4 mt-1 min-[840px]:mt-2 h-full flex flex-col">
    <!-- Display the link title -->
    <div class="h-auto min-[840px]:h-auto text-base min-[840px]:text-base font-bold overflow-hidden text-ellipsis {primaryTextColor} transition-all delay-150 duration-300 ease-in-out">
      {link.title}
    </div>
    <!-- Display the link description -->
    <div class="h-0 min-[840px]:h-0 text-xs min-[840px]:text-balance min-[840px]:text-base {secondaryTextColor ?? 'text-[#a0a0a0]'} text-wrap text-ellipsis overflow-y-auto transition-all delay-150 duration-300 ease-in-out group-hover:h-32 group-hover:min-[840px]:h-32">
      {link.description}
    </div>
  </div>
</a>
