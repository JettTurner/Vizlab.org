import { writable } from 'svelte/store';

// Default size (in Tailwind units or pixels if custom)
export const boxSize = writable('h-32 min-[840px]:h-64');
