import { Router } from "express";
import { WalletFetcher } from ".";
import { GraphManager } from "../allocation";
import { Formatter } from "../formatter";

type IndexerOperatorPair = {
    address: string
    operator: string
}

export class WalletRouterFactory {
    private formatter: Formatter
    private walletFetcher: WalletFetcher;
    private graphManager: GraphManager;

    constructor(graphManager: GraphManager, formatter: Formatter) {
        this.graphManager = graphManager;
        this.formatter = formatter

        this.walletFetcher = new WalletFetcher();
    }

    private async getBalance(network: Network, pair: IndexerOperatorPair): Promise<string | null> {
        const balance = await this.walletFetcher.getBalance(network, pair.operator);

        if (balance === null) {
            return null;
        }

        const response = this.formatter.formatBalance(network, pair.address, pair.operator, balance);

        return response;
    }

    private async getPair(network: Network, indexer: string): Promise<IndexerOperatorPair[]> {
        const operator = await this.graphManager.fetchOperators(network, indexer);

        return operator.map((operator) => {
            return {
                address: indexer,
                operator: operator.id,
            }
        })
    }

    private async getPairs(network: Network, indexers: string[]): Promise<IndexerOperatorPair[]> {
        const promises = indexers.map( (indexer) => { return this.getPair(network, indexer) })
        const pairs: IndexerOperatorPair[] = []

        for (const promise of promises) {
            try {
                pairs.push(...await promise);
            } catch (e) {
                console.log(e);
            }
        }

        return pairs;   
    }

    private async getBalances(network: Network, addresses: string[]): Promise<string> {
        const pairs = await this.getPairs(network, addresses);
        const promises = pairs.map( (pair) => { return this.getBalance(network, pair) })
        
        const balances: string[] = []

        for (const promise of promises) {
            try {
                const balance = await promise;
                
                if (balance !== null) {
                    balances.push(balance);
                }
            } catch (e) {
                console.log(e);
            }
        }

        return balances.join("\n\n");
    }

    public make(): Router {
        const router = Router();

        router.get("/:network/:addresses", async (req, res) => {
            const network = req.params.network as Network;
            
            const addressesString = req.params.addresses;

            const addresses = addressesString.replace(" ", "").split(",");
            const response = await this.getBalances(network, addresses);

            res.send(response);
        });

        return router;
    }
}