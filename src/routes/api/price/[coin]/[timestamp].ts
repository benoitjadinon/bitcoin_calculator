export async function get({ params }) : Promise<number> {
    const { coin, timestamp } = params;

    return await loadPriceAt(coin, timestamp); // timestamp = date.getTime() / 1000
}

export async function loadPriceAt (coin:string, to:number) : Promise<number> {
    //TODO USE https://ably.com/hub/ably-coindesk/crypto-pricing instead ?
    // https://medium.com/flutter-community/building-a-realtime-cryptocurrency-app-with-flutter-8c05522e8dcd
    const from = to - 3600
    const url = `https://www.coinigy.com/getjson/chart_feed/KUCN/${coin.toUpperCase()}/USDT/60/${from}/${to}`; // !CORS or use a real official api
    const res = await fetch(url);
    const json = await res.json();
    return (+json[0][1] + +json[0][4])/2; //average of Open and Close value (startdate, O, H, L, C, ?, enddate)
}

//TODO use nomics ? API KEY : a8275f10dc2a27958c4ea8bbf464973ce85274a4