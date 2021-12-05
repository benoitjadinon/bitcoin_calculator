<script lang="ts">
    //export const ssr = false;
    //export const router = false;
    import {goto} from "$app/navigation";
    import Chart from "$lib/Chart.svelte";
    import Footer from "$lib/Footer.svelte";

    export let address = 'bc1qze4r40cpk7pasg6mhc508falh76ua2lgd3mygh';
</script>

<Chart />

<input type="text" bind:value={address} class="px-4 py-3 rounded-full shadow" />
<button on:click={goto('wallet/'+address)} class="shadow">Open</button>

<Footer />