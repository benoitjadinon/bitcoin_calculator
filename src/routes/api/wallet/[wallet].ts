import {Wallet} from "$lib/domain";
import type {Transaction} from "$lib/domain";
import {loadPriceAt} from "../price/[coin]/[timestamp]";

// TODO move to an endpoint, using node library for reading blockchain
//!! run https://cors-anywhere.herokuapp.com/corsdemo first in browser

export async function get ({ params }) : Promise<Wallet> {
    const walletId = params.address;

    //const transactions = await loadBlockChainInfo(walletId); // throws too many transactions after some time
    const transactions = await loadBlockCypher(walletId);

    if (transactions.length > 0) {
        transactions
            .sort((a,b) => a.date.getTime() - b.date.getTime())
            .forEach((e, i, arr) => {
                if (i == 0) e.totalCostUSD = e.costUSD;
                else e.totalCostUSD = arr[i-1].totalCostUSD + e.costUSD;
            });
    }

    //load methods should return a Wallet, some calls already have the total balance in their json, no need to calculate
    const wall = new Wallet(
        transactions,
        transactions.length == 0 ? 0 : transactions.map(a => a.value).reduce((a, b) => a + b),
        transactions.length == 0 ? 0 : transactions.map(a => a.costUSD).reduce((a, b) => a + b),
    );

    return wall;
}


// BLOCKCHAIN.INFO / .COM

/*
{
[0]       hash: 'ab309c7a0f05b598cdaf1cd9cc6f09cf454158431435d0dd53846f4b2f4de074',
[0]       ver: 1,
[0]       vin_sz: 1,
[0]       vout_sz: 67,
[0]       size: 2319,
[0]       weight: 8949,
[0]       fee: 13415,
[0]       relayed_by: '0.0.0.0',
[0]       lock_time: 0,
[0]       tx_index: 4112214926126576,
[0]       double_spend: false,
[0]       time: 1637505247,
[0]       block_index: 710706,
[0]       block_height: 710706,
[0]       inputs: [Array],
[0]       out: [Array],
[0]       result: 274000,
[0]       balance: 0.14658455,
[0]       date: 2021-11-21T14:34:07.000Z,
[0]       price: 58862.35,
[0]       value: 274000,
[0]       costUSD: 16128283900,
[0]       balanceUSD: 8628.3110866925,
[0]       totalCostUSD: 211768770761.19998
[0]     }
[0]   ],
[0]   total: 14658455,
[0]   cost: 211768770761.19998
*/

type TxBlockChainInfo = Transaction & { time: number, result: number; };
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
        tx.date = (new Date(tx.time * 1000));
        tx.price = await loadPriceAt('BTC', Math.floor(tx.date.getTime() / 1000));
        tx.result = tx.result / 100000000;
        tx.value = tx.result;
        tx.costUSD = tx.value * tx.price;
        tx.balance = tx.balance / 100000000;
        tx.balanceUSD = (tx.balance) * tx.price;
    }));

    return transactions;
}


// BLOCKCYPHER https://www.blockcypher.com/dev/bitcoin/#address-api

/*
address: "bc1qze4r40cpk7pasg6mhc508falh76ua2lgd3mygh"
balance: 14658455
final_balance: 14658455
final_n_tx: 25
n_tx: 25
total_received: 14658455
total_sent: 0
tx_url: "https://api.blockcypher.com/v1/btc/main/txs/"
txrefs: (25) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…},
    {
    balance: 0.14658455
    balanceUSD: 8628.3110866925
    block_height: 710706
    confirmations: 2103
    confirmed: "2021-11-21T14:35:28Z"
    costUSD: 161.282839
    date: Sun Nov 21 2021 15:35:28 GMT+0100 (Central European Standard Time) {}
    double_spend: false
    price: 58862.35
    ref_balance: 0.14658455
    spent: false
    totalCostUSD: 2117.687707612
    tx_hash: "ab309c7a0f05b598cdaf1cd9cc6f09cf454158431435d0dd53846f4b2f4de074"
    tx_input_n: -1
    tx_output_n: 65
    value: 0.00274
    }
]
unconfirmed_balance: 0
unconfirmed_n_tx: 0
*/
type TxBlocCypher = Transaction & { tx_hash:string, confirmed:string, ref_balance:number }
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
        tx.hash = tx.tx_hash;
        tx.date = new Date(Date.parse(tx.confirmed));
        tx.price = await loadPriceAt('BTC', Math.floor(tx.date.getTime() / 1000));
        tx.value = tx.value / 100000000;
        tx.costUSD = tx.value * tx.price;
        tx.ref_balance = tx.ref_balance / 100000000;
        tx.balance = tx.ref_balance;
        tx.balanceUSD = (tx.balance) * tx.price;
    }));

    return transactions;
}

