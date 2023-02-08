import { Router } from "express";
import { GraphManager, SubgraphManager } from ".";
import { Formatter } from "../formatter";
import { OperatorInfo } from "./types";

export class AllocationRouterFactory {
    private formatter: Formatter
    private graphManager: GraphManager

    constructor(graphManager: GraphManager, formatter: Formatter) {
        this.graphManager = graphManager
        this.formatter = formatter
    }

    private async getAllocations(network: Network, indexer: string): Promise<string> {
        const allocations = await this.graphManager.fetchAllocations(network, indexer);
        
        return allocations.map((allocation) => {
            return this.formatter.formatAllocation(network, indexer, allocation.name, allocation.ipfsHash, allocation.creationTime)
        }).join("\n\n")
    }

    private async getAllocationsForIndexers(network: Network, indexers: string[]): Promise<string> {
        const promises = indexers.map( (indexer) => { return this.getAllocations(network, indexer) })
        const allocations: string[] = []

        for (const promise of promises) {
            try {
                allocations.push(await promise);
            } catch (e) {
                console.log(e);
            }
        }

        return allocations.join("\n\n");
    }

    private async fetchCurrentEpoch(network: Network): Promise<string> {
        const epoch = await this.graphManager.fetchCurrentEpoch(network);

        return this.formatter.formatEpoch(network, epoch);
    }

    public make(): Router {
        const router = Router();

        router.get("/:network/epoch", async (req, res) => {
            const network = req.params.network as Network;

            const epoch = await this.fetchCurrentEpoch(network);

            res.send(epoch);
        });

        router.get("/:network/:indexers", async (req, res) => {
            const network = req.params.network as Network;
            const indexers = req.params.indexers as string;

            const allocations = await this.getAllocationsForIndexers(network, indexers.replace(" ", "").split(","));

            res.send(allocations);
        });

        return router;
    }   
}