<script>
  import CategoryBreakdwonPage from "$lib/CategoryBreakdownPage.svelte"; // Import the reusable category breakdownStylePage

</script>

<CategoryBreakdwonPage
  category="Reference"
  descriptor="Reference Categories:"
  excludedTags={["Top", "Question",]}
  tagNameOverrides={{
    "AI": "Artificial Intelligence",
    "3D": "3D Art",
    "UX": "User Experience",
  }}
/>