<script type="ts">
    // TODO show message to block if cost of api/hosting > donations
    import {Wallet} from "$lib/domain";

    export let wallet:Wallet;
    export let address;
</script>

wallet : {address}<br/>
cost : {(wallet.cost / 100000000).toFixed(2)}$ (at time of buying)<br/>
value : {((wallet.total / 100000000) * 49000).toFixed(2)}$ (today)<br/>
total : {(wallet.total / 100000000).toFixed(5)}₿ (today)<br/>

<div class="flex">
    <div id="total" class="flex-1 bg-gray-200">
        <table class="table-auto">
            <tbody>
            {#each wallet.transactions as tx}
                <tr class="bg-blue-200">
                    <td>{tx.date.toLocaleString()}</td>
                    <td>₿{(tx.result ?? tx.cost) / 100000000}</td>
                    <td>${((tx.cost / 100000000)).toFixed(2)}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>