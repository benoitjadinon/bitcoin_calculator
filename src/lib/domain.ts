export type Tx = { hash: string; }

export type Transaction =
    Tx
    & { value: number; date: Date; costUSD: number; totalCostUSD: number; balance: number; balanceUSD: number; price: number; }

export class Wallet {
    constructor(public transactions: Transaction[], public total: number, public cost: number) {}
}