<script>
  import { page } from "$app/stores"; 
  import { derived } from "svelte/store";  
  import { goto } from "$app/navigation";
  import { showFilterDropdown } from "$lib/urlFilters.js";

  // Get the current URL path
  let currentPath = derived(page, ($page) => $page.url.pathname);

  // State: mobile nav toggle & dropdown toggle
  let isMobileMenuOpen = false;
  let isDropdownOpen = false;

  // Toggle the filter dropdown (sidebar filter or similar)
  function toggleFilter() {
    showFilterDropdown.update(value => !value);
  }

  // Handle click on category nav button
  function handleCategoryClick(category) {
    const searchParams = new URLSearchParams($page.url.searchParams);
    searchParams.set('categories', category);  // Set the selected category as a search param
    goto(`/?${searchParams.toString()}`, { replaceState: true }); // Always navigate to homepage with new category
  }

  // Highlight the active nav button
  function activeNavColor(link, selectedCategory) {
    return selectedCategory === link.category
      ? link.navcolor.replace('hover:', '')  // Remove hover if it's selected
      : link.navcolor;
  }

  // Derived store: currently selected category from URL
  let selectedCategory = derived(page, ($page) => $page.url.searchParams.get("categories"));

  // Primary navigation links (categories)
  const primaryNavLinks = [
    { category: "Education", label: "Education", navcolor: 'hover:text-yellow-500' },
    { category: "Reference", label: "Reference", navcolor: 'hover:text-green-500' },
    { category: "Assets", label: "Assets", navcolor: 'hover:text-red-500' },
    { category: "GettingStarted", label: "Getting Started", navcolor: 'hover:text-orange-500' },
    { category: "Documentation", label: "Documentation", navcolor: 'hover:text-purple-400' },
  ];

  // Secondary navigation (static pages)
  const dropdownLinks = [ 
    { href: "/about", label: "About" },
    { href: "/missingsomething", label: "Missing Something?" },
  ];
</script>

<!-- HEADER BAR -->
<header class="z-30 sticky top-0 border-b-2 bg-gradient-to-r from-[#ff0000] to-[#0000ff] shadow-md">
  <div class="p-1 flex justify-between items-center text-lg md:text-xl font-semibold text-white">

    <!-- Left Side: Logo + Optional Filter Button -->
    <div class="flex items-center gap-3 ml-4">
      <a href="/" class="tracking-wide hover:text-blue-900 transition">
        Vizlab.org
      </a>

      <!-- Optional: Filter Toggle Button -->
      <!--
	  <button
        class="bg-gray-800 hover:bg-blue-800 text-white px-2 py-1 rounded text-sm"
        on:click={toggleFilter}>
        ?
      </button>
	  -->
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center flex-wrap space-x-2 pr-4">
      {#each primaryNavLinks as link}
        <button 
          class="nav-link {activeNavColor(link, $selectedCategory)}"
          on:click={() => handleCategoryClick(link.category)}>
          {link.label}
        </button>
      {/each}

      <!-- Desktop Dropdown Menu -->
      {#if dropdownLinks.length > 0}
        <div class="relative">
          <button class="mr-4 text-xl" on:click={() => isDropdownOpen = !isDropdownOpen}>
            ☰
          </button>

          {#if isDropdownOpen}
            <div class="dropdown">
              {#each dropdownLinks as link}
                <a 
                  href={link.href} 
                  class="dropdown-item {link.navcolor}" 
                  on:click={() => isDropdownOpen = false}>
                  {link.label}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </nav>

    <!-- Mobile Nav Button (always visible on small screens) -->
    <button class="md:hidden mr-4 text-xl" on:click={() => isMobileMenuOpen = !isMobileMenuOpen}>
      ☰
    </button>
  </div>

  <!-- Mobile Dropdown Menu (shown below toggle button) -->
  {#if isMobileMenuOpen}
    <div class="relative">
      <div class="dropdown">
        {#each primaryNavLinks as link}
          <button
            class="nav-link {activeNavColor(link, $selectedCategory)}"
            on:click={() => {
              handleCategoryClick(link.category);
              isMobileMenuOpen = false;
            }}>
            {link.label}
          </button>
        {/each}

        {#each dropdownLinks as link}
          <a 
            href={link.href} 
            class="mobile-link text-left px-4 py-2 hover:bg-gray-800 {link.navcolor}" 
            on:click={() => isMobileMenuOpen = false}>
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</header>
