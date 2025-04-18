<script>
  import { onMount } from 'svelte';
  import { trackClick } from "$lib/clickTracker.js";
  import { boxSize } from "$lib/stores/boxSize.js";
  import sprite from "$lib/assets/sprite.min.svg";

  // Load enhanced image assets
  const images = import.meta.glob(
    '$lib/assets/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
    { eager: true, query: { enhanced: true } }
  );

  // Props
  let { link } = $props();

  // Category-to-color mapping
  const categoryColors = {
    Main: 'text-blue-500',
    Reference: 'text-green-500',
    Education: 'text-yellow-500',
    Assets: 'text-red-500',
    Documentation: 'text-purple-400',
    GettingStarted: 'text-orange-500',
  };

  // Categories array from link data
  let categories = link.category
    ? (Array.isArray(link.category) ? link.category : [link.category])
    : [];

  // Voting state
  let upvoted = false;
  let downvoted = false;
  let voteCount = { upvotes: 0, downvotes: 0 };

  // Colors
  let color = link.color || 'bg-stone-900';
  let primaryTextColor = $state(link.primaryTextColor || 'text-stone-400 group-hover:text-stone-100');
  let secondaryTextColor = link.secondaryTextColor || 'text-stone-300';
  let upvoteColor = $state(link.upvoteColor || 'transition-colors hover:text-green-300 text-white ')
  let downvoteColor = $state(link.downvoteColor || 'transition-colors hover:text-red-300 text-white')

  // Image error state
  let error = false;

  // Get enhanced image if available
  link.img = images[link.image]?.default;

  // Setup initial vote state from localStorage
  onMount(() => {
    if (!link?.href) return;

    const votes = getVoteData();
    const linkVotes = votes[link.href] || {
      upvoted: false,
      downvoted: false,
      upvotes: 0,
      downvotes: 0
    };
	
	// Set reactive state
    upvoted = linkVotes.upvoted;
    downvoted = linkVotes.downvoted;
    voteCount = { ...linkVotes }; // Ensures reactivity
	
	updateVoteColors();
  });

  // LocalStorage helper: get
  function getVoteData() {
    try {
      const data = localStorage.getItem('linkVotes');
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn("Couldn't parse local vote data:", e);
      return {};
    }
  }

  // LocalStorage helper: set
  function setVoteData(data) {
    try {
      localStorage.setItem('linkVotes', JSON.stringify(data));
    } catch (e) {
      console.warn("Couldn't save vote data:", e);
    }
  }

  // Handle click-through tracking (ignore vote button clicks)
  async function handleClick(event) {
    const target = event.target;
    if (target.closest('votebutton')) return; // Skip votes

    try {
      const url = new URL('/api/set.php', window.location.href);
      url.searchParams.set('link', link.href);
      const resp = await fetch(url);
      console.log(resp.ok);
    } finally {
      // Placeholder for optional additional logic
    }
  }

  // Upvote toggle logic
  function upvote(event) {
    event.preventDefault();
    event.stopPropagation();

    const votes = getVoteData();
    const linkVotes = votes[link.href] || {
      upvoted: false, downvoted: false, upvotes: 0, downvotes: 0
    };

    if (upvoted) {
      // Undo upvote
      linkVotes.upvoted = false;
      linkVotes.upvotes = Math.max(linkVotes.upvotes - 1, 0);
      upvoted = false;
    } else {
      // Set upvote, remove downvote if needed
      if (downvoted) {
        linkVotes.downvoted = false;
        linkVotes.downvotes = Math.max(linkVotes.downvotes - 1, 0);
      }
      linkVotes.upvoted = true;
      linkVotes.upvotes += 1;
      upvoted = true;
      downvoted = false;
    }

    voteCount = {
      upvotes: linkVotes.upvotes,
      downvotes: linkVotes.downvotes
    };
    votes[link.href] = linkVotes;
    setVoteData(votes);
	
	updateVoteColors();
  }

  // Downvote toggle logic
  function downvote(event) {
    event.preventDefault();
    event.stopPropagation();

    const votes = getVoteData();
    const linkVotes = votes[link.href] || {
      upvoted: false, downvoted: false, upvotes: 0, downvotes: 0
    };

    if (downvoted) {
      // Undo downvote
      linkVotes.downvoted = false;
      linkVotes.downvotes = Math.max(linkVotes.downvotes - 1, 0);
      downvoted = false;
    } else {
      // Set downvote, remove upvote if needed
      if (upvoted) {
        linkVotes.upvoted = false;
        linkVotes.upvotes = Math.max(linkVotes.upvotes - 1, 0);
      }
      linkVotes.downvoted = true;
      linkVotes.downvotes += 1;
      downvoted = true;
      upvoted = false;
    }

    voteCount = {
      upvotes: linkVotes.upvotes,
      downvotes: linkVotes.downvotes
    };
    votes[link.href] = linkVotes;
    setVoteData(votes);
	
	updateVoteColors();
  }
  //function to update the vote colors based on the vote state
  function updateVoteColors() {
	upvoteColor = `transition-colors hover:text-green-300 ${upvoted ? 'text-green-400' : 'text-white'}`;
	downvoteColor = `transition-colors hover:text-red-300 ${downvoted ? 'text-red-400' : 'text-white'}`;
  }
  // Format price-based styling
  $derived: {
    if (link.price) {
      let selectedPrice = "";

      if (link.price.includes('Subscription')) {
        selectedPrice = 'Subscription';
      } else if (link.price.includes('OneTimePurchase')) {
        selectedPrice = 'OneTimePurchase';
      } else if (link.price.includes('Free')) {
        selectedPrice = 'Free';
      }

      switch (selectedPrice) {
        case "Subscription":
          color = 'bg-[#171717]';
          primaryTextColor = 'text-red-400 group-hover:text-red-400';
          secondaryTextColor = 'text-stone-300';
          break;
        case "OneTimePurchase":
          color = 'bg-[#171717]';
          primaryTextColor = 'text-orange-400 group-hover:text-orange-400';
          secondaryTextColor = 'text-stone-300';
          break;
        case "Free":
          color = 'bg-stone-900';
          primaryTextColor = 'text-stone-400 group-hover:text-stone-100';
          secondaryTextColor = 'text-stone-300';
          break;
        default:
          color = 'bg-[#ff00ff]';
          primaryTextColor = 'text-[#ff00ff]';
          secondaryTextColor = 'text-[#a0a0a0]';
          break;
      }
    }
  }

  // Set error if image failed to load
  $derived: {
    error = !link.img;
  }
</script>



<!-- Link container with dynamic styles based on the 'link' object -->
<a
  class="group relative flex flex-col justify-between size-auto h-32 min-[840px]:size-64 border-2 border-stone-700 cursor-pointer {color} hover:border-blue-600 hover:bg-blue-800 rounded-lg overflow-hidden"
  title={link.href}
  href={link.href}
  on:mouseup={handleClick}
>

  <!-- Tag container -->
  {#if categories.length}
    <div class="absolute top-2 left-2 z-20 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {#each categories as cat}
        <span class="category-tag text-xs font-semibold px-2 py-1 bg-black/80 rounded {categoryColors[cat] || 'text-gray-500'}">
          {cat}
        </span>
      {/each}
    </div>
  {/if}

  <!-- Price Tags top-right -->
  {#if link.price}
    <div class="absolute top-2 right-2 z-20 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
  {/if}

  <!-- Image or fallback -->
  {#if error}
    <div class="h-20 min-[840px]:h-52 size-full">
      <svg class="p-4 size-full fill-zinc-200">
        <use href={sprite + "#link-broken"}></use>
      </svg>
    </div>
  {:else}
    {#if link.image}
      <enhanced:img class="h-20 min-[840px]:h-64 group-hover:min-[840px]:h-72 size-full object-cover object-left object-[2%_100%] transition-all delay-150 duration-300 ease-in-out group-hover:brightness-75" src={link.img} />
    {:else}
      <div class="h-20 min-[840px]:h-52 size-full">
        <svg class="p-4 size-full fill-zinc-200">
          <use href={sprite + "#image"}></use>
        </svg>
      </div>
    {/if}
  {/if}

  <!-- Description overlay -->
  <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-black/80 text-white px-2 py-1 text-xs min-[840px]:text-sm opacity-0 translate-y-full group-hover:opacity-90 group-hover:bg-blue-900 group-hover:translate-y-0 transition-all duration-300 ease-in-out z-10 overflow-y-auto">
    {link.description}
  </div>

  <!-- Title + vote buttons bar -->
  <div class="absolute bottom-0 left-0 right-0 z-20 flex justify-between items-center px-2 py-1 group-hover:bg-blue-800  bg-stone-900 backdrop-blur-md">
    <div class="text-sm font-bold text-ellipsis overflow-hidden {primaryTextColor}">
      {link.title}
    </div>
		<div class="flex gap-2 text-xs items-center">
		  <!-- Upvote Button -->
			<button
			  class="{upvoteColor}"
			  type="button"
			  on:click={upvote}
			  aria-label="Upvote"
			>
			  ▲
			</button>
		  <span class="text-white">{voteCount.upvotes}</span>
		  <!-- Downvote Button -->
			<button
			  class="{downvoteColor}"
			  type="button"
			  on:click={downvote}
			  aria-label="Downvote"
			>
			  ▼
			</button>
		  <span class="text-white">{voteCount.downvotes}</span>
		</div>
  </div>
</a>
