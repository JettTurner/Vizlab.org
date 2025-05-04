<script>
  import Box from "$lib/Box.svelte";
  import { getClickCounts } from "$lib/clickTracker.js";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  export let sites = [];
  let clickCounts = {};

  async function loadClicks() {
    if (browser) {
      try {
        const data = await getClickCounts();
        if (typeof data === "object" && data !== null) {
          clickCounts = data;
        } else {
          console.error("Unexpected data format for click counts:", data);
          clickCounts = {};
        }
      } catch (error) {
        console.error("Failed to load click counts:", error);
        clickCounts = {};
      }
    }
  }

  onMount(loadClicks);
</script>

{#if browser && Object.keys(clickCounts).length >= 0}
  <div class="container mx-auto max-w-full md:pl-4 md:pr-4 pl-4 pr-4 pt-2 pb-2">
    <div class="grid grid-cols-2 min-[840px]:grid-cols-[repeat(auto-fit,_16rem)] justify-center gap-3">
      {#each sites as link (link)}
        <div class="w-full h-32 md:h-auto md:w-auto">
          <Box link={link} clickCounts={clickCounts[link.href] || 0} />
        </div>
      {/each}
    </div>
  </div>
{:else}
  <p class="text-center text-gray-500 mt-4">Loading links...</p>
{/if}
