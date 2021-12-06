<script type="ts">
    // TODO show message to block if cost of api/hosting > donations
    import {Wallet} from "$lib/domain";

    export let wallet:Wallet;
    export let address;
</script>

wallet : {address}<br/>
cost : {(wallet.cost).toFixed(2)}$ (at time of buying)<br/>
value : {((wallet.total) * 49000).toFixed(2)}$ (today)<br/>
total : {(wallet.total).toFixed(5)}₿ (today)<br/>

<div class="flex">
    <div id="total" class="flex-1 bg-gray-200">
        <table class="table-auto">
            <tbody>
            {#each wallet.transactions as tx}
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