<script lang='ts'>
    import TradingViewWidget from './TradingViewWidget.svelte'

    let options = {
        symbol: "BTCUSD", // have a dropdown with supported coins
        theme: "dark",
        //autosize: true,
        width: 500,
        height: 500,
        interval: "M",
        timezone: "Etc/UTC",
        style: "8",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        save_image: false,
        details: true,
    }
</script>

<TradingViewWidget {options} class="flex-1" />
