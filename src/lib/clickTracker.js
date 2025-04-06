import { browser } from "$app/environment";
/*
export async function getClickCounts() {
  try {
    const response = await fetch('/api/click-counts'); // Ensure this is the correct endpoint

    // ✅ Check if response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // ✅ Ensure the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Received non-JSON response");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching click counts:", error);
    return {}; // ✅ Return an empty object instead of breaking the app
  }
}*/
export async function getClickCounts() {
    try {
        const response = await fetch('/api/click-counts'); // No need for full URL
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching click counts:', error);
        return [];
    }
}




export async function trackClick(linkHref) {
    if (!browser) return;

    // Update localStorage
    let clickData = getClickCounts();
    clickData[linkHref] = (clickData[linkHref] || 0) + 1;
    localStorage.setItem("clickCounts", JSON.stringify(clickData));

    // Send update to the server
    try {
        await fetch("/api/click-counts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ linkHref })
        });
    } catch (error) {
        console.error("Failed to send click data to the server:", error);
    }
}

