<script lang='ts'>
    import TradingViewWidget from './TradingViewWidget.svelte'

    type Transaction = { result: number; time: number; date:Date, hash:String; cost: number; }
    class Wallet { constructor(public transactions:Transaction[], public total:number, public cost:number){} }

    let address:string = '';
    let transactionsAsync:Promise<Wallet> = Promise.resolve(new Wallet([], 0, 0));

    async function loadWalletTransactions (address:String) : Promise<Wallet> {
        //!! run https://cors-anywhere.herokuapp.com/corsdemo first in browser
        const res = await fetch(`https://blockchain.info/rawaddr/${address}`); // https://cors-anywhere.herokuapp.com/
        let lst: Transaction[] = (await res.json())['txs']

        await Promise.all(lst.map(async (tx) => {
            tx.date = (new Date(tx.time * 1000));
            tx.result = tx.result / 100000000;
            tx.cost = tx.result * (await loadBtcPriceAtDate(tx.date));
        }));

        return new Wallet(
            lst,
            lst.map(a => a.result).reduce((a, b) => a + b),
            lst.map(a => a.cost).reduce((a, b) => a + b),
        );
    }

    async function loadBtcPriceAtDate (date:Date) : Promise<number> {
        const to = Math.floor(date.getTime() / 1000)
        const from = to - 3600
        const url = `https://www.coinigy.com/getjson/chart_feed/KUCN/BTC/USDT/60/${from}/${to}`; // !CORS
        const res = await fetch(url);
        const json = await res.json();
        return (+json[0][1] + +json[0][4])/2; //average of Open and Close value (startdate, O, H, L, C, ?, enddate)
    }

    $: if (typeof address != 'undefined' && address) transactionsAsync = loadWalletTransactions(address);

    let options = {
        symbol: "BINANCE:BTCUSDT",
        theme: "dark",
        //autosize: true,
        width: 500,
        height: 500,
        interval: "D",
        timezone: "Etc/UTC",
        style: "8",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        save_image: false,
        details: true,
    };
</script>

<label>
    bitcoin wallet address :
    <input type="text" bind:value={address} class="px-4 py-3 rounded-full" />
</label>

<div class="flex">
    {#await transactionsAsync}
        <p>...</p>
    {:then wallet }
        <div id="total" class="flex-1 bg-gray-200">
            {#await loadBtcPriceAtDate(new Date())}
                <p>loading value...</p>
            {:then price}
                <p>₿{wallet.total} (value: ${(wallet.total * price).toFixed(2)}, cost: ${(wallet.cost).toFixed(2)})</p>
            {/await}
            <table class="table-auto">
                <tbody>
                {#each wallet.transactions as tx (tx.hash)}
                    <tr class="bg-blue-200">
                        <td>{tx.date.toLocaleString()}</td>
                        <td>₿{tx.result}</td>
                        <td>${(tx.cost).toFixed(2)}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    {:catch error}
        <p class="flex-1 bg-red">{error.message}</p>
    {/await}
    <TradingViewWidget {options} class="flex-1" />
</div>