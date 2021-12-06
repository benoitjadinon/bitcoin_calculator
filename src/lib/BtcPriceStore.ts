import {interval} from "rxjs"
import {concatMap, shareReplay, map, startWith} from "rxjs/operators"

export const liveBTCPrice = interval(60000).pipe(
    startWith(0),
    concatMap((_) => fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')), // {"data":{"base":"BTC","currency":"USD","amount":"48797.84"}}
    concatMap((resp) => resp.json()),
    map((r) => r.data.amount as string),
    map((number) => +number),
    //catchError(handleError)
    shareReplay(1)
);