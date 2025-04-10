<script>
  import CategoryBreakdwonPage from "$lib/CategoryBreakdownPage.svelte"; // Import the reusable category breakdownStylePage

</script>

<CategoryBreakdwonPage
  category="Education"
  descriptor="Education Categories:"
  excludedTags={["Top", "Question",]}
  tagNameOverrides={{
    "AI": "Artificial Intelligence",
    "3D": "3D Art",
    "UX": "User Experience",
    "Textures": "Material Info",
    "LevelDesign": "Level Design",
  }}
  tagGroups={{
    "Rendering Engines": ["Octane", "Redshift", "Cycles",],
    "UX & UI": ["UX", "UI", "User Interface",],
    "Rendering & Lighting": ["Math", "Rendering", "Lighting",],
    "Materials & Shading": ["Shaders", "Materials",],
    "Animation": ["Animation", "CharacterDesign",],
    "Making Environments": ["ModelingHardSurface", "Environment",],
    "Making Characters": ["ModelingCharacters", "Anatomy","Rigging,"],
    "Tutorials Courses and Breakdowns": ["Tutorials", "Courses","Breakdowns"],
  }}
/>

