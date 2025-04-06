<script>
  import { page } from "$app/stores"; 
  import { derived } from "svelte/store";

  let currentPath = derived(page, ($page) => $page.url.pathname);
  let isMobileMenuOpen = false;
  let isDropdownOpen = false;

  // Primary navigation links
  const primaryNavLinks = [
    { href: "/education", label: "Education", navcolor: 'hover:text-yellow-500' },
    { href: "/reference", label: "Reference", navcolor: 'hover:text-green-500' },
    { href: "/assets", label: "Assets", navcolor: 'hover:text-red-500' },
    { href: "/documentation", label: "Documentation", navcolor: 'hover:text-purple-400' },
    { href: "/gettingstarted", label: "Getting Started", navcolor: 'hover:text-orange-500' },
    { href: "/about", label: "About" },
    { href: "/missingsomething", label: "Missing Something?" },
  ];

  const dropdownLinks = [
    //{ href: "/search", label: "Search" },
  ];
</script>

<header class="z-30 sticky top-0 border-b-2 bg-gradient-to-r from-[#ff0000] to-[#0000ff] shadow-md">
  <div class="p-1 flex justify-between items-center text-lg md:text-xl font-semibold text-white">
    
    <!-- Logo -->
    <a href="/" class="ml-4 tracking-wide hover:text-blue-900 transition">
      Vizlab.org
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center flex-wrap space-x-2 pr-4">
      {#each primaryNavLinks as link}
        <a href={link.href} 
           class="nav-link {link.navcolor} {currentPath === link.href ? 'font-bold' : ''}">
          {link.label}
        </a>
      {/each}

      <!-- Dropdown for More Links -->
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

    <!-- Mobile Menu Button -->
    <button class="md:hidden mr-4 text-xl" on:click={() => isMobileMenuOpen = !isMobileMenuOpen}>
      ☰
    </button>
  </div>

  <!-- Mobile Dropdown -->
  {#if isMobileMenuOpen}
    <div class="mobile-menu">
      {#each [...primaryNavLinks, ...dropdownLinks] as link}
        <a href={link.href} class="mobile-link {link.navcolor}" on:click={() => isMobileMenuOpen = false}>
          {link.label}
        </a>
      {/each}
    </div>
  {/if}
</header>
