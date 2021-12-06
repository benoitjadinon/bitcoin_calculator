<script type="ts" context="module">
    import {Wallet} from "$lib/domain";
    import * as WalletApi from "$routes/api/wallet/[wallet]";
    import type {LoadOutput, LoadInput} from '@sveltejs/kit';
    import {validate} from 'bitcoin-address-validation';

    export async function load(params:LoadInput) : Promise<LoadOutput> {
        const address = params.page.params.wallet;
        if (!validate(address)) return {
            status: 400,
            error:'bitcoin address is not valid',
        }
        const wallet = await WalletApi.get({params:{address}})
        return {
            props: {
                wallet,
                address
            }
        }
    }
</script>

<script lang="ts">
    import Transactions from "$lib/Transactions.svelte";
    import Footer from "$lib/Footer.svelte";
    import Chart from "$lib/Chart.svelte";

    export let wallet:Wallet;
    export let address;
</script>

<Transactions {wallet} {address} />

<Chart transactions={wallet.transactions} />

<Footer />