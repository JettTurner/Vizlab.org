import { writable } from "svelte/store";

// Load from localStorage if it exists, default to true
const stored = localStorage.getItem("sidebarOpen");
const defaultOpen = stored !== null ? stored === "true" : window.innerWidth >= 768;

export const sidebarOpen = writable(defaultOpen);

// Save to localStorage whenever it changes
sidebarOpen.subscribe(value => {
  localStorage.setItem("sidebarOpen", value);
});
