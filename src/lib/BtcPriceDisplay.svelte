<script lang="ts">
    import {liveBTCPrice} from "$lib/BtcPriceStore";
</script>

{#if !$liveBTCPrice}
    Loading btc price
{:else}
    ${$liveBTCPrice}
{/if}