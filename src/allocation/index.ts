import axios from "axios";
import { AllocationInfo, GraphQLResponse, AllocationResponse, OperatorInfo, OperatorsResponse, BlockResponse } from "./types";

export class SubgraphManager {
    private subgraphURL: string

    constructor(subgraphURL: string) {
        this.subgraphURL = subgraphURL
    }

    async fetchCurrentEpoch(): Promise<number> {
        console.log("Fetching current epoch")

        const body = {
            "query": "{epoches(orderDirection:desc,orderBy:startBlock,first:1){id}}",
            "variables": {}
        }

        const response = await axios.post(this.subgraphURL, body)
        const responseBody = response.data as GraphQLResponse<BlockResponse>

        return parseInt(responseBody.data.epoches[0].id)
    }

    async fetchAllocations(indexer: string): Promise<AllocationInfo[]> {
        console.log(`Fetching allocations for indexer ${indexer}`)

        const body = {
            "query": `{
                allocations(where:{indexer:"${indexer.toLowerCase()}",closedAtBlockNumber:null}) {
                    createdAtEpoch
                    subgraphDeployment {
                        ipfsHash
                        originalName
                    }
                }
            }`,
            "variables": {}
        }

        const response = await axios.post(this.subgraphURL, body)
        const responseBody = response.data as GraphQLResponse<AllocationResponse>

        return responseBody.data.allocations.map((allocation) => {
            return {
                name: allocation.subgraphDeployment.originalName,
                ipfsHash: allocation.subgraphDeployment.ipfsHash,
                creationTime: allocation.createdAtEpoch
            }
        })
    }

    async fetchOperators(indexer: string): Promise<OperatorInfo[]> {
        console.log(`Fetching operators for indexer ${indexer}`)

        const body = {
            "query": `query{indexers(where:{id:"${indexer.toLowerCase()}"}){account{operators{id}}}}`,
            "variables": {}
        }

        const response = await axios.post(this.subgraphURL, body)
        const responseBody = response.data as GraphQLResponse<OperatorsResponse>
        const indexerBody = responseBody.data.indexers[0]

        if (indexerBody === undefined) {
            return []
        }

        return indexerBody.account.operators.map((operator) => {
            return {
                id: operator.id
            }
        })
    }
}

export class GraphManager {
    private ethMainnetSubgraphManager: SubgraphManager
    private ethGoerliSubgraphManager: SubgraphManager

    constructor(ethMainnetSubgraphManager: SubgraphManager, ethGoerliSubgraphManager: SubgraphManager) {
        this.ethMainnetSubgraphManager = ethMainnetSubgraphManager
        this.ethGoerliSubgraphManager = ethGoerliSubgraphManager
    }

    private getManager(network: Network): SubgraphManager {
        switch (network) {
            case "eth-mainnet":
                return this.ethMainnetSubgraphManager;
            case "eth-goerli":
                return this.ethGoerliSubgraphManager;
            default:
                throw new Error("Invalid network");
        }
    }

    public async fetchCurrentEpoch(network: Network): Promise<number> {
        let manager = this.getManager(network);
        return manager.fetchCurrentEpoch();
    }

    public async fetchAllocations(network: Network, indexer: string): Promise<AllocationInfo[]> {
        let manager = this.getManager(network);
        return manager.fetchAllocations(indexer);
    }

    public async fetchOperators(network: Network, indexer: string): Promise<OperatorInfo[]> {
        let manager = this.getManager(network);
        return manager.fetchOperators(indexer);
    }
}