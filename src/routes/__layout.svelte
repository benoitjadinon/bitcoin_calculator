<script>
    import "../styles/tailwind-output.css";
    import BtcPriceDisplay from "$lib/BtcPriceDisplay.svelte";
</script>

<h1 class="uppercase text-indigo-500">
    BTC Wallet value calculator<br/>
    BTC : <BtcPriceDisplay />
</h1>

<slot></slot>
