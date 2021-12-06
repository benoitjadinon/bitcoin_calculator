<script lang="ts">
    //export const ssr = false;
    //export const router = false;

    import {goto} from "$app/navigation";
    import Chart from "$lib/Chart.svelte";
    import Footer from "$lib/Footer.svelte";
    import {validate} from 'bitcoin-address-validation';

    let address = 'bc1qze4r40cpk7pasg6mhc508falh76ua2lgd3mygh';

    let disabled: boolean;
    $: disabled = !validate(address);

</script>

<div class="flex-auto">
    <input type="text" bind:value={address}
           class={'px-4 py-3 h-12 rounded-full shadow border border-2 ' + (disabled === true
           ? 'border-red-300 focus:border-red-800'
           : 'border-green-300 focus:border-green-800')}
           placeholder="paste bitcoin wallet address here" style='width:26em'/>
    <button class={'px-4 h-12 rounded-full shadow ' +
        (disabled === true
            ? 'bg-red-300 cursor-not-allowed'
            : 'bg-green-300 cursor-pointer')}
            {disabled}
            on:click={()=>goto('wallet/'+address)}>Open</button>
</div>

<Footer/>