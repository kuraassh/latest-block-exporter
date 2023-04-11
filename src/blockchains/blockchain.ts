import { Formatter } from "../formatter"
import { RPCManager } from "../rpc"

export interface BlockchainMetricsManager {
    getLatestBlockMetrics(): Promise<string>
    getCurrentBlockMetrics(): Promise<string>
}

export class AnyBlockchainMetricsManager implements BlockchainMetricsManager {
    protected rpcManagers: RPCManager[]

    protected latestRPCManager: RPCManager
    protected formatter: Formatter
    protected blockchainName: string

    constructor(rpcManagers: RPCManager[], formatter: Formatter, blockchainName: string, latestRPCManager: RPCManager) {
        this.rpcManagers = rpcManagers
        this.formatter = formatter

        this.latestRPCManager = latestRPCManager
        this.blockchainName = blockchainName
    }

    async getLatestBlockMetrics(): Promise<string> {
        const currentBlock = await this.latestRPCManager.fetchBlockFromRPC()
        const formattedResponse = this.formatter.formatLatest(this.blockchainName, currentBlock)
        return formattedResponse
    }

    private async getCurrentBlockMetricsForRPC(rpc: RPCManager): Promise<string> {
        const currentBlock = await rpc.fetchBlockFromRPC()
        const rpcHostname = rpc.rpcHostname

        const formattedResponse = this.formatter.formatCurrent(this.blockchainName, currentBlock, rpcHostname)
        return formattedResponse
    }

    async getCurrentBlockMetrics(): Promise<string> {
        const results: string[] = []

        for (const rpc of this.rpcManagers) {
            try {
                const response = await this.getCurrentBlockMetricsForRPC(rpc)
                results.push(response)
            } catch (e) {
                console.log(e)
            }
        }

        return results.join("\n")
    }
}