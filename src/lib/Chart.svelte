<script lang='ts'>
    import TradingViewWidget from './TradingViewWidget.svelte'
    import type {Transaction} from "$lib/domain";
    import {curveNatural, extent, line, scaleLinear, scaleTime} from "d3";
    import Axis from "./Axis.svelte";
    import {curveLinear} from "d3-shape";

    export let transactions:Transaction[];

    let tradingViewOptions = {
        symbol: "BTCUSD", // have a dropdown with supported coins
        theme: "dark",
        //autosize: true,
        width: 600,
        height: 600,
        interval: "M",
        timezone: "Etc/UTC",
        style: "8",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        save_image: false,
        details: true,
    }

    const margin = { top: 15, bottom: 50, left: 100, right: 20 };
    const width = 600, height = 600;
    const innerHeight = height - margin.top - margin.bottom,
        innerWidth = width - margin.left - margin.right;

    $: dataset = transactions ?? [];

    $: xScale = scaleTime()
        .domain(extent(dataset, (d:Transaction) => d.date.getTime()))
        .range([0, innerWidth]);

    $: yScaleBalance = scaleLinear()
        .domain(extent(dataset, (d:Transaction) => d.balanceUSD))
        .range([innerHeight, 0]);

    $: line_balance = line()
        .curve(curveLinear)
        .x(function (d) {
            return xScale((d as Transaction).date.getTime());
        })
        .y(function (d) {
            return yScaleBalance((d as Transaction).balanceUSD);
        })(dataset);

    $: last = dataset[dataset.length-1]
    $: yScaleTotalCost = scaleLinear()
        .domain(extent(dataset, (d:Transaction) => d.totalCostUSD))
        .range([(innerHeight * (last.totalCostUSD / last.balanceUSD)), 0]);

    $: line_totalCost = line()
        .curve(curveNatural)
        .x(function (d) {
            return xScale((d as Transaction).date.getTime());
        })
        .y(function (d) {
            return yScaleTotalCost((d as Transaction).totalCostUSD) + (innerHeight - (innerHeight * (last.totalCostUSD / last.balanceUSD)));
        })(dataset);

</script>

<style>
    path#balance {
        fill: transparent;
        stroke: rgb(18, 153, 90);
        stroke-width: 2.5;
        stroke-linejoin: round;
    }
    path#total {
        fill: transparent;
        stroke: rgb(0, 0, 153);
        stroke-width: 2.5;
        stroke-linejoin: round;
    }
</style>

<main class="flex-1">
    <svg {width} {height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
            <Axis {innerHeight} {margin} scale={xScale} position="bottom" />
            <Axis {innerHeight} {margin} scale={yScaleBalance} position="left" />
            <text transform={`translate(${-30},${innerHeight / 2}) rotate(-90)`}>BTC in wallet</text>
            <path d={line_balance} id="balance" />
            <path d={line_totalCost} id="total" />
            <text x={innerWidth / 2} y={innerHeight + 35}>Time</text>
        </g>
    </svg>
</main>

<!--<TradingViewWidget {tradingViewOptions} class="flex-1" />-->
