<script>
  import "../app.css";
  import "../lib/assets/fonts/fonts.css";
  import Header from "$lib/Header.svelte";
  import Footer from "$lib/Footer.svelte";
  
  // Scroll handling on large pages
  import { onMount } from "svelte";

  onMount(() => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);

      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight || 0;
        
        // Smooth scroll function with requestAnimationFrame
        function smoothScroll() {
          const start = window.scrollY;
          const end = target.offsetTop - headerHeight;
          const distance = end - start;
          let startTime = null;

          function scrollStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / 600, 1); // 600ms for smooth scroll

            window.scrollTo(0, start + distance * percentage);

            if (percentage < 1) {
              requestAnimationFrame(scrollStep);
            }
          }

          requestAnimationFrame(scrollStep);
        }

        smoothScroll();
      }
    }
  });
</script>

<style>
	  /* =================== GLOBAL STYLES =================== */
	  :global(body) {
		font-family: "Open Sans Variable", sans-serif;
		font-size: 20px;
		line-height: 175%;
		background: linear-gradient(to top, #000000, #080c59);
		color: #e0e0e0;
	  }

	  /* =================== TYPOGRAPHY =================== */
	  :global(header) {
		font-family: "Roboto-Old-Bold", serif;
		font-size: 100%;
		line-height: 175%;
		text-align: left;
	  }

	  :global(h1), :global(h2), :global(h3) {
		font-family: "BowlbyOne-Regular";
		text-align: center;
		line-height: 175%;
		margin-left: 15%;
		margin-right: 15%;
	  }
	  
	  :global(h2), :global(h3) {
		font-family: "Roboto-Old-Bold", serif;
		text-align: center;
		line-height: 175%;
		margin-left: 15%;
		margin-right: 15%;
	  }

	  :global(h1) { font-size: 200%; }
	  :global(h2) { font-size: 150%; color: rgb(255,0,70); }
	  :global(h3) { font-size: 150%; color: rgb(0,150,255); }

	  :global(p) {
		font-family: "FjallaOne-Regular", serif;
		font-size: 120%;
		color: rgb(200,200,200);
		line-height: 160%;
		margin-left: 20%;
		margin-right: 20%;
		text-align: center;
		letter-spacing: 1px;
	  }

	  :global(blockquote), :global(cite) {
		font-family: "Roboto-Old-Bold", serif;
		font-size: 100%;
		color: rgb(150,150,150);
		line-height: 160%;
		margin-left: 30%;
		margin-right: 30%;
		text-align: justify;
	  }

	  /* =================== BUTTONS =================== */
	  :global(button) {
		font-family: 'Inter', sans-serif;
		font-size: 100%;
		color: rgb(0,150,255);
		text-align: center;
	  }

	  /* =================== NAVIGATION =================== */
	  :global(.nav-link) {
		font-family: 'Inter', sans-serif;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		text-decoration: none;
		//color: white;
		transition: all 0.3s ease-in-out;
	  }

	  :global(.nav-link:hover) { background: rgba(0, 0, 0, 0.5); }
	  :global(.active) { background: rgba(0, 150, 255, 0.7); font-weight: bold; }

	  /* Main navigation bar */
	  :global(.selected) {
		border-bottom: 4px solid white;
		//color: white;
	  }

	  /* =================== SUB-NAVIGATION =================== */
	  :global(.sub-nav-container) {
		display: flex;
		justify-content: center;
		gap: 1rem;
		padding: 1rem 0;
	  }

	  :global(.sub-nav-link) {
		padding: 0.75rem 1.5rem;
		text-decoration: none;
		color: white;
		border-radius: 8px;
		transition: background 0.3s;
	  }

	  :global(.sub-nav-link:hover) { background: rgba(255, 255, 255, 0.2); }

	  /* Hide sub-nav on mobile */
	  @media (max-width: 768px) {
		:global(.sub-nav-container) { display: none; }
	  }

	  /* =================== DROPDOWN MENU =================== */
	  :global( .dropdown) {
		position: absolute;
		top: 100%;
		right: 0; /* Aligns dropdown to the right */
		background: rgba(0, 0, 0, 0.9);
		padding: 5px;
		list-style: none;
		margin: 0;
		min-width: 200px; /* Ensures it has a proper width */
		box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 50;
		animation: slideDown 0.3s ease-in-out;
	  }

	  :global(.dropdown-item) {
		display: block;
		padding: 8px 12px;
		white-space: nowrap; /* Ensures the text stays on one line */
		text-decoration: none;
		color: white;
		transition: background 0.2s;
	  }

	  :global(.dropdown-item:hover){
		background: rgba(255, 255, 255, 0.2);
	  }


	  /* =================== MOBILE MENU =================== */
	  :global(.mobile-menu) {
		background: rgba(0, 0, 0, 0.9);
		position: absolute;
		width: 100%;
		left: 0;
		top: 100%;
		text-align: left;
		padding: 10px 0;
		animation: slideDown 0.3s ease-in-out;
	  }

	  :global(.mobile-link) {
		display: block;
		padding: 12px;
		color: white;
		text-decoration: none;
		transition: background 0.2s;
	  }

	  :global(.mobile-link:hover) { background: rgba(255, 255, 255, 0.2); }

	  /* =================== ANIMATIONS =================== */
	  @keyframes fadeIn {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	  }

	  @keyframes slideDown {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	  }
  
	  /* =================== FOOTER =================== */
	  :global(footer) {
		  position: fixed;
		  bottom: 0;
		  left: 0;
		  right: 0;
		  background-color: #2d2d2d;  /* Adjust footer background if needed */
		  color: #b0b0b0;  /* Adjust footer text color */
		  text-align: center;
		  padding: 16px;  /* Adjust padding as needed */
		  z-index: 1000;  /* Ensure the footer stays above other content */
	  }

	  footer aside {
		margin: 0;  /* Remove any unwanted margin */
	  }

	:global(main) {
	  padding-bottom: 60px;  /* Adjust based on the height of the footer */
	}

</style>
<!-- Header Component -->
<Header />

<main class="grow bg-gradient-to-t from-[#000000] to-[#080c59] text-stone-100">
  <slot />
</main>

<!-- Footer Component -->
<Footer />