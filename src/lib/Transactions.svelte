<script type="ts">
    // TODO show message to block if cost of api/hosting > donations
    import {Wallet} from "$lib/domain";
    import {liveBTCPrice} from "$lib/BtcPriceStore";
    import BtcPriceDisplay from "$lib/BtcPriceDisplay.svelte";

    export let wallet:Wallet;
    export let address;

    $: value = (wallet?.total ?? 0) * $liveBTCPrice;
</script>

wallet : {address}<br/>
₿1 = <BtcPriceDisplay /><br/>
wallet total : ₿{(wallet.total).toFixed(5)} (now)<br/>
wallet cost  : ~${wallet.cost.toFixed(2)} (at time of transactions)<br/>
wallet value : {#if !value}Loading...{:else}${value.toFixed(2)} (now){/if}<br/>

<div class="flex">
    <div id="total" class="flex-1 bg-gray-200">
        <table class="table-auto">
            <tbody>
            {#each wallet.transactions as tx (tx.hash)}
                <tr class="bg-blue-200">
                    <td>{tx.date.toLocaleString()}</td>
                    <td>₿{tx.value}</td>
                    <td>${tx.costUSD.toFixed(2)}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>