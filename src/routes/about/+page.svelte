<script>
  import Desktop from '$lib/assets/Desktop.png';
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<svelte:head>
  <title>About - Vizlab.org</title>
</svelte:head>

<style>
  /* General Styling */
  h1, h2, h3, p, li {
    color: #FFFFFF;
  }

/* General Styles for the Hamburger Menu */
.hamburger {
  display: none;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  z-index: 20;
}

.hamburger .line {
  width: 100%;
  height: 4px;
  background-color: #9ca3af;
  border-radius: 2px;
}

/* Sticky Navigation */
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0px;
  background: #111;
  padding: 10px 20px;
  z-index: 20;
}

.nav-links {
  display: flex;
  gap: 50px;
  justify-content: center;
}

.nav-links a {
  color: #9ca3af;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #FFFFFF;
}

/* Dropdown Menu Styles (Hidden by Default) */
.nav-links.open {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  background-color: #111;
  padding: 20px 0;
}

.nav-links a {
  margin: 10px 0;
}


  /* Section Backgrounds */
  .section {
    padding: 10px;
  }

.bg-dark-1 { background-color: #000000; } /* Pure Black */
.bg-dark-2 { background-color: #030318; } /* Very Dark Blue */
.bg-dark-3 { background-color: #05062e; } /* Deep Navy Blue */
.bg-dark-4 { background-color: #080c59; } /* Rich Dark Blue */





  .category-list {
    margin-left: 20px;
  }

  /* Color Coding for Pricing */
  .color-code {
    font-weight: bold;
    margin: 10px 0;
  }

  .free { color: #9ca3af; }
  .onetime { color: #FFA500; }
  .subscription { color: #FF4500; }

 /* Dual Screen Section */
.flex-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
  gap: 20px; /* Space between boxes */
}

.flex-container .box {
  width: 50%;
  text-align: center;
  padding: 40px;
  min-height: 250px; /* Ensures even height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
}

/* Styling for "Main Screen" and "Secondary Screen" */
.box-main {
  background-color: #121212;
}

.box-secondary {
  background-color: #000000;
}

/* Media Query for Small Screens */
@media (max-width: 768px) {
  /* Hide normal navigation on small screens */
  .nav-links {
    display: none;
  }

  /* Show the hamburger menu on small screens */
  .hamburger {
    display: flex;
  }
}


/* Centering the Categories Section */
#categories {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.category-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  margin: 15px 0;
  font-size: 1.2rem;
}

.category-list strong {
  font-weight: bold;
}

/* Adjusting for Small Screens */
@media (max-width: 768px) {
  #categories {
    padding: 20px;
  }
}

</style>

<!-- Sticky Navigation for Quick Access -->
<div class="nav-container">
  <!-- Hamburger Menu for Small Screens -->
  <div class="hamburger" on:click={toggleMenu}>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>

  <!-- Navigation Links -->
  <div class="nav-links {isMenuOpen ? 'open' : ''}">
    <a href="#about">About Us</a>
    <a href="#categories">Our Categories</a>
    <a href="#difference">What Makes Us Different?</a>
    <a href="#workflow">Dual Screen Workflows</a>
    <a href="#gateway">The Gateway to Resources</a>
  </div>
</div>

<!-- About Us Section -->
<div id="about" class="section bg-dark-1">
  <h1>About Us</h1>
  <p>Welcome to <strong>Vizlab.org</strong>, the ultimate curated library for 3D artists, animators, VFX artists, and CGI creators. Our mission is simple: to bring together the best and most valuable resources the web has to offer, all in one place. Whether you're looking for high-quality references, educational materials, or assets to fuel your creative projects, we've got you covered.</p>
</div>

<!-- Our Categories Section -->
<div id="categories" class="section bg-dark-2">
  <h2>Our Categories</h2>
  <p>We’ve organized our collection into three key areas:</p>
  <ul class="category-list">
    <li><strong>Education</strong>: Dive into expertly curated tutorials, courses, and learning platforms to improve your skills and expand your knowledge.</li>
    <li><strong>Reference</strong>: Find a vast selection of reference materials to inspire your work and help you achieve realistic and creative results.</li>
    <li><strong>Assets</strong>: Explore libraries of 3D models, textures, brushes, rigs, and more to enhance your projects and speed up your workflow.</li>
  </ul>
</div>


<!-- What Makes Us Different Section -->
<div id="difference" class="section bg-dark-3">
  <h2>What Makes Us Different?</h2>
  <p>What sets us apart is our commitment to quality and accessibility. We've handpicked every resource to ensure that it offers exceptional value to professionals and beginners alike. And to make it easier to navigate, we’ve color-coded each resource based on its cost:</p>
  <p class="color-code"><span class="free">Free:</span> Resources that are completely free for everyone to use.</p>
  <p class="color-code"><span class="onetime">One-Time Payment:</span> Resources that require a single, upfront payment.</p>
  <p class="color-code"><span class="subscription">Subscription:</span> Resources that work on a subscription model for continuous access.</p>
</div>

<!-- Dual Screen Workflow Section -->
<div id="workflow" class="section bg-dark-4">
  <h2>Designed for Dual Screen Workflows</h2>

  <div class="gallery">
    <a target="_blank" href={Desktop}>
      <img src={Desktop} alt="Desktop Screenshot" width="100%" height="400" />
    </a>
    <div class="desc"></div>
  </div>

  <br>

  <div class="flex-container md:text-lg text-xs">
    <div class="box box-main">
      <h2>"Main" Screen</h2>
      <h2 style="color:#cf0228">Maya, Blender, Unreal, Notepad++, Adobe, Clip Studio, DaVinci Resolve, etc.</h2>
    </div>
    <div class="box box-secondary">
      <h3>"Secondary" Screen</h3>
      <h3 style="color:#1a51d1">Vizlab.org, PureRef, Teams, File Explorer, Documentation, Design Briefs, and much more!</h3>
    </div>
  </div>

  <br>

  <p>In a standard dual-screen workflow, the left monitor serves as the primary workspace, where artists actively create using software like Maya, Blender, or Unreal Engine. Meanwhile, the right monitor acts as a support hub, displaying essential references, tools, and resources—including Vizlab.org—to streamline creativity and efficiency.

  Vizlab.org is intentionally designed with dual-screen setups in mind, ensuring quick access to curated resources without disrupting the artist’s primary workflow.</p>
</div>

<!-- The Gateway to Resources Section -->
<div id="gateway" class="section bg-dark-1">
  <h2>The Gateway to Resources</h2>
  <p><strong>Vizlab.org</strong> is more than just a resource hub—it’s a <strong>collection of collections</strong>, a <strong>library of libraries</strong> meticulously curated for 3D artists, animators, and VFX creators. Instead of endlessly searching the web, Vizlab.org serves as a central gateway, organizing and linking you to the best references, educational materials, and assets available online.</p>
  <br>
  <p>Think of it as a <strong>shortcut to the right tools</strong>, allowing you to <strong>spend less time searching and more time creating</strong>. Whether you're looking for inspiration, tutorials, or high-quality assets, Vizlab.org helps you navigate the vast digital landscape with ease.</p>
  <br>
  <p>Thank you for visiting, and we hope you find exactly what you need to take your craft to the next level!</p>
</div>

