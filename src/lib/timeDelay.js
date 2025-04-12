  //-------------------------code for FilterDropdown timeout:-------------------------
import { onMount, onDestroy } from 'svelte';
  
  let timeoutId;
  const INACTIVITY_TIME = 3000; // 3 seconds of inactivity before closing the FilterDropdown
  const SCROLL_DELAY = 100; // Delay (in milliseconds) before closing the FilterDropdown after scroll
  
  let scrollTimeoutId;


  // Reset the timeout when hovering over the FilterDropdown
  function resetTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear any previous timeouts
    }
    timeoutId = setTimeout(closeFilterDropdown, INACTIVITY_TIME); // Set a new timeout to close after 3 seconds
  }

  // Close FilterDropdown when mouse leaves
  let FilterDropdownHovered = false;
  function onMouseLeave() {
    FilterDropdownHovered = false;
    resetTimeout();
  }

  // Open FilterDropdown on mouse enter
  let FilterDropdownEntered = false;
  function onMouseEnter() {
    FilterDropdownHovered = true;
    openFilterDropdown();
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear timeout when the user interacts with the FilterDropdown
    }
  }

  // Close FilterDropdown on scroll event (with delay)
  function onScroll() {
    // Clear previous timeout to reset delay if the user scrolls again quickly
    if (scrollTimeoutId) {
      clearTimeout(scrollTimeoutId);
    }

    // Set a delayed timeout to close the FilterDropdown after the user stops scrolling
    scrollTimeoutId = setTimeout(() => {
      closeFilterDropdown();
    }, SCROLL_DELAY); // Set a delay before closing the FilterDropdown (e.g., 500ms)
  }

  onMount(() => {
    // Attach scroll event listener
    window.addEventListener('scroll', onScroll);

    // Reset timeout to close FilterDropdown after inactivity
    resetTimeout(); 
    
    // Cleanup event listener when the component is destroyed
    onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
    });
  });