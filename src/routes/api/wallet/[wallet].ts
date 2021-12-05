import {Wallet} from "$lib/domain";
import type {Transaction} from "$lib/domain";
import {loadPriceAt} from "../price/[coin]/[timestamp]";

// TODO move to an endpoint, using node library for reading blockchain
//!! run https://cors-anywhere.herokuapp.com/corsdemo first in browser

export async function get ({ params }) : Promise<Wallet> {
    const walletId = params.address;

    //console.log('wallet');
    //console.log(walletId);

    //const transactions = await loadBlockChainInfo(walletId); // throws too many transactions after some time
    const transactions = await loadBlockCypher(walletId);

    //console.log(transactions);

    const wall = new Wallet(
        transactions,
        transactions.length == 0 ? 0 : transactions.map(a => a.value).reduce((a, b) => a + b),
        transactions.length == 0 ? 0 : transactions.map(a => a.cost).reduce((a, b) => a + b),
    );

    console.log(wall);

    return wall;
}


// BLOCKCHAIN.INFO / .COM

type TxBlockChainInfo = Transaction & { time: number, result: number; value:number; };
type WalletBlockChainInfo = Wallet & { total: number; cost: number; };

async function loadBlockChainInfo(walletId: string) : Promise<Transaction[]> {
    const res = await fetch(`https://blockchain.info/rawaddr/${walletId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
            //'X-API-Token': '' // requested on 20211121 // but for v3 of their .com api, no wallet there
        }
    }); // https://cors-anywhere.herokuapp.com/

    const json:WalletBlockChainInfo = await res.json();

    const transactions:TxBlockChainInfo[] = json['txs'];

    await Promise.all((transactions ?? []).map(async (tx) => {
        tx.value = tx.result;
        tx.date = (new Date(tx.time * 1000));
        tx.cost = tx.value * (await loadPriceAt('BTC', Math.floor(tx.date.getTime() / 1000)));
    }));

    return transactions;
}


// BLOCKCYPHER https://www.blockcypher.com/dev/bitcoin/#address-api

type TxBlocCypher = Transaction & { tx_hash:string, confirmed:string }
type WalletBlocCypher = Wallet & { address:string, balance:number }

async function loadBlockCypher(walletId: string) : Promise<Transaction[]> {
    const res = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${walletId}?token=ae4df37b4d1a49d9a7d715fb98b8fe7e`, {
        method: 'GET',
        //mode: 'cors',
        headers: {
            'content-type': 'application/json',
            //'X-API-Token': '' // requested on 20211121 // but for v3 of their .com api, no wallet there
        }
    }); // https://cors-anywhere.herokuapp.com/

    const json:WalletBlocCypher = await res.json();

    const transactions:TxBlocCypher[] = json['txrefs'] ?? [];

    await Promise.all(transactions.map(async (tx) => {
        tx.date = new Date(Date.parse(tx.confirmed));
        tx.cost = tx.value * (await loadPriceAt('BTC', Math.floor(tx.date.getTime() / 1000)));
    }));

    return transactions;
}

