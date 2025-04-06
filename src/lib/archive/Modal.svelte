<script>
	let { children } = $props();
	
	export function show(){
		isOpen = true;
		dialog.showModal();
	}
	
	export function close(){
		dialog.close();
		isOpen = false;
	}
	
	let dialog;
	let isOpen = $state(false);
</script>

<dialog bind:this={dialog} class="modal">
	{#if isOpen}
		<div class="modal-box border-2 border-stone-400 border-solid bg-stone-800 max-w-xl">
			{@render children()}
		</div>
		<button class="modal-backdrop" onclick={close}>close</button>
	{/if}
</dialog>