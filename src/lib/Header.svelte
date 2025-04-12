<script>
  import { page } from "$app/stores"; 
  import { derived } from "svelte/store";  
  import { goto } from "$app/navigation";
  import { showFilterDropdown } from "$lib/urlFilters.js";

  let currentPath = derived(page, ($page) => $page.url.pathname);
  let isMobileMenuOpen = false;
  let isDropdownOpen = false;

  // Handle toggling the dropdown filter
  function toggleFilter() {
    showFilterDropdown.update(value => !value);
  }

  // Handle category navigation
  function handleCategoryClick(category) {
    const searchParams = new URLSearchParams($page.url.searchParams);
    searchParams.set('categories', category);  // Set the selected category as a search param
    goto(`?${searchParams.toString()}`, { replaceState: true });  // Update the URL without reloading
	goto(`/?${searchParams.toString()}`, { replaceState: true }); // Always go to home page
  }
  
  // Update the Header buttons to show category.
  function activeNavColor(link, selectedCategory) {
    return selectedCategory === link.category
      ? link.navcolor.replace('hover:', '')
      : link.navcolor;
  }
  let selectedCategory = derived(page, ($page) => $page.url.searchParams.get("categories"));


  // List of primary navigation links
  const primaryNavLinks = [
    { category: "Education", label: "Education", navcolor: 'hover:text-yellow-500' },
    { category: "Reference", label: "Reference", navcolor: 'hover:text-green-500' },
    { category: "Assets", label: "Assets", navcolor: 'hover:text-red-500' },
    { category: "GettingStarted", label: "Getting Started", navcolor: 'hover:text-orange-500' },
    { category: "Documentation", label: "Documentation", navcolor: 'hover:text-purple-400' },
  ];

  const dropdownLinks = [ 
    { href: "/about", label: "About" },
    { href: "/missingsomething", label: "Missing Something?" },
  ];
</script>

<!-- HEADER BAR -->
<header class="z-30 sticky top-0 border-b-2 bg-gradient-to-r from-[#ff0000] to-[#0000ff] shadow-md">
  <div class="p-1 flex justify-between items-center text-lg md:text-xl font-semibold text-white">

    <!-- Left Side: Logo + Filter Button -->
    <div class="flex items-center gap-3 ml-4">
      <a href="/" class="tracking-wide hover:text-blue-900 transition">
        Vizlab.org
      </a>

      <!-- Filter Button -->
      <button
        class="bg-gray-800 hover:bg-blue-800 text-white px-2 py-1 rounded text-sm"
        on:click={toggleFilter}>
        ?
      </button>
    </div>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center flex-wrap space-x-2 pr-4">
      {#each primaryNavLinks as link}
        <button 
		  class="nav-link {activeNavColor(link, $selectedCategory)}"
		  on:click={() => handleCategoryClick(link.category)}>
		  {link.label}
		</button>
      {/each}

      <!-- Dropdown Menu -->
      {#if dropdownLinks.length > 0}
        <div class="relative">
          <button class="mr-4 text-xl" on:click={() => isDropdownOpen = !isDropdownOpen}>
            ☰
          </button>

          {#if isDropdownOpen}
            <div class="dropdown">
              {#each dropdownLinks as link}
                <a href={link.href} class="dropdown-item {link.navcolor}" on:click={() => isDropdownOpen = false}>
                  {link.label}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </nav>

    <!-- Mobile Nav Button -->
    <button class="md:hidden mr-4 text-xl" on:click={() => isMobileMenuOpen = !isMobileMenuOpen}>
      ☰
    </button>
  </div>
</header>

<!-- MOBILE DROPDOWN -->
{#if isMobileMenuOpen}
  <div class="flex left-0 w-full bg-gray-900 border-b border-gray-700 z-20">
    <div class="flex flex-col p-2 gap-2 text-white text-base font-medium">
      {#each primaryNavLinks as link}
		<button
		  class="nav-link {activeNavColor(link, $selectedCategory)}"
		  on:click={() => { handleCategoryClick(link.category); isMobileMenuOpen = false; }}>
		  {link.label}
		</button>
      {/each}
      {#each dropdownLinks as link}
        <a href={link.href} class="mobile-link text-left px-4 py-2 hover:bg-gray-800 {link.navcolor}" on:click={() => isMobileMenuOpen = false}>
          {link.label}
        </a>
      {/each}
    </div>
  </div>
{/if}

