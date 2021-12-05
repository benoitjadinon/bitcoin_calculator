<script type="ts" context="module">
    import {Wallet} from "$lib/domain";
    import * as WalletApi from "$routes/api/wallet/[wallet]";
    import type {LoadOutput, LoadInput} from '@sveltejs/kit';

    //export async function load({ page, fetch, session, stuff }) {
    export async function load(params:LoadInput) : Promise<LoadOutput> {
        const address = params.page.params.wallet;
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

    export let wallet:Wallet;
    export let address;
</script>

<Transactions {wallet} {address} />

<Footer />