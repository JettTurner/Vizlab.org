<script>
  import CategoryBreakdwonPage from "$lib/CategoryBreakdownPage.svelte"; // Import the reusable category breakdownStylePage

</script>

<CategoryBreakdwonPage
  category="Assets"
  descriptor="Asset Categories:"
  excludedTags={["Top", "Question",]}
  tagNameOverrides={{
    "AI": "Artificial Intelligence",
    "3D": "3D Art",
    "UX": "User Experience",
  }}
  tagGroups={{
    "Rendering Engines": ["Octane", "Redshift", "Cycles",],
    "UX & UI": ["UX", "UI", "User Interface",],
    "Tools & Plugins": ["Tools", "Plugin",],
  }}
/>