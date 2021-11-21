<script lang='ts'>
    // TODO show message to block if cost of api/hosting > donations

    import { Wallet } from "$lib/domain"
    import {loadPriceAt} from "../routes/api/price/[coin]/[timestamp]";

    let address = 'bc1qze4r40cpk7pasg6mhc508falh76ua2lgd3mygh'
    let transactionsAsync:Promise<Wallet> = Promise.resolve(new Wallet([], 0, 0))

    async function loadWalletTransactions (address:string) : Promise<Wallet> {
        const url = `api/wallet/${address}`
        const res = await fetch(url)
        console.log(res)
        console.log("res")
        const json = await res.json()
        console.log(res)
        return json
    }

    //TODO add debounce to avoid too many calls
    $: if (address !== undefined) transactionsAsync = loadWalletTransactions(address)

</script>

<label>
    bitcoin wallet address :
    <input type="text" bind:value={address} class="px-4 py-3 rounded-full" />
</label>

<div class="flex">
    {#await transactionsAsync}
        <p>loading...</p>
    {:then wallet}
        <div id="total" class="flex-1 bg-gray-200">
            <!--{#await loadPriceAt(new Date())}
                <p>loading value...</p>
            {:then price}
                <p>₿{wallet.total} (value: ${(wallet.total * price).toFixed(2)}, cost: ${(wallet.cost).toFixed(2)})</p>
            {/await}-->
            <table class="table-auto">
                <tbody>
                {JSON.stringify(wallet)}
                    <!--{#each wallet.transactions as tx (tx.hash)}
                        <tr class="bg-blue-200">
                            <td>{tx.date.toLocaleString()}</td>
                            <td>₿{tx.result / 100000}</td>
                            <td>${(tx.cost).toFixed(2)}</td>
                        </tr>
                    {/each}-->
                </tbody>
            </table>
        </div>
    {:catch error}
        <p class="flex-1 bg-red">{error.message}</p>
    {/await}
</div>