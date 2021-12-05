<script type="ts">
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faPaste } from '@fortawesome/free-solid-svg-icons'

    const address = "34My2uYXSyX8PfjZJXYLpWdBxSjdm1Ksjk";

    function copyToClipboard() {
        return navigator.clipboard.writeText(address);
    }
</script>

<div>if you find this tool useful, please consider donating some BTC to
    <div on:click|once={copyToClipboard} class="cursor-pointer inline-block">{address}
        <Fa icon={faPaste} class="inline-block"/>
    </div>
</div>